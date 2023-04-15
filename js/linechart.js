class LineChart {

    constructor(_config, _data) {
      this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 600,
        containerHeight: _config.containerHeight || 300,
        margin: { top: 50, bottom: 50, right: 50, left: 50 }
      }
  
      this.data = _data;
      this.initVis();
    }

    initVis() {
        let vis = this; 
      
        // Calculate inner chart size. Margin specifies the space around the actual chart.
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;
        
        // Initialize scales
        // vis.xScale = d3.scaleLinear()
        //     .range([0, vis.width]);
    
        // vis.yScale = d3.scaleLinear()
        //     .range([vis.height, 0])
        //     .nice();
    
        // Initialize axes
        // vis.xAxis = d3.axisBottom(vis.xScale)
        //     .ticks(6)
        //     .tickSizeOuter(0)
        //     .tickPadding(10)
        //     .tickFormat(d => d);
    
        // vis.yAxis = d3.axisLeft(vis.yScale);
        //     .ticks(6)
        //     .tickSizeOuter(0)
        //     .tickPadding(10);
    
        // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        // group the data: I want to draw one line per group
        const sumstat = d3.group(vis.data, d => d.character); // nest function allows to group the calculation per level of a factor

        // Add X axis
        const x = d3.scaleLinear()
            .domain(d3.extent(vis.data, d => d.epNum ))
            .range([ 0, vis.width ]);
        vis.svg.append("g")
            .attr("transform", `translate(0, ${vis.height})`)
            .call(d3.axisBottom(x).ticks(10));

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, d3.max(vis.data, d => +d.words)])
            .range([ vis.height, 0 ]);
        vis.svg.append("g")
            .call(d3.axisLeft(y));

        // color palette
        const color = d3.scaleOrdinal()
            .range(['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00','#ffff33','#a65628','#f781bf','#999999'])

        // Draw the line
        vis.svg.selectAll(".line")
            .data(sumstat)
            .join("path")
            .attr("fill", "none")
            .attr("stroke", function(d){ return color(d[0]) })
            .attr("stroke-width", 1.5)
            .attr("d", function(d){
        return d3.line()
            .x(function(d) { return x(d.epNum); })
            .y(function(d) { return y(+d.words); })
            (d[1])
        })
    }
    updateVis() {
        let vis = this;
    }
}