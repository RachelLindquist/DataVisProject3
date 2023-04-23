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
        // const sumstat = d3.group(vis.data, d => d.character); // nest function allows to group the calculation per level of a factor

        // Add X axis
        vis.xScale = d3.scaleLinear()
            .domain(d3.extent(vis.data, d => +d.epNum ))
            .range([ 0, vis.width ]);

        vis.svg.append("g")
            .attr('class', 'axis y-axis')
            .attr("transform", `translate(0, ${vis.height})`)
            .call(d3.axisBottom(vis.xScale).ticks(40));

        // Add Y axis
        vis.yScale = d3.scaleLinear()
            .domain([0, d3.max(vis.data, d => +d.words)])
            .range([ vis.height, 0 ]);

        vis.svg.append("g")
            .attr('class', 'axis y-axis')
            .call(d3.axisLeft(vis.yScale));

        this.updateVis();
    }
    updateVis() {
        let vis = this;

        vis.xScale.domain(d3.extent(vis.data, d => +d.epNum ));
        // vis.yScale.domain([0, getLargest(vis.data)]);

        const sumstat = d3.group(vis.data, d => d.character); 
        
        // Draw the line
        vis.svg.selectAll(".line")
            .data(sumstat)
            .join("path")
            .attr("fill", "none")
            .attr("stroke", function(d){ 
                console.log(d)
                return vis.getColor(d[1][0]) })
            .attr("stroke-width", 1.5)
            .attr("d", function(d){
        return d3.line()
            .x(function(d) { return vis.xScale(d.epNum); })
            .y(function(d) { return vis.yScale(+d.words); })
            (d[1])
        })
    }

    getColor(d){
        if(d.character === "Shiori"){
            return "#b85294";
        } else if (d.character === "Kozue") {
            return "#8489ef";
        } else if (d.character === "Wakaba") {
            return "#d77149";
        } else if (d.character === "Mitsuru") {
            return "#f1cc3d";
        } else if (d.character === "Touga") {
            return "#ba2332";
        } else if (d.character === "Saionji") {
            return "#57845b";
        } else if (d.character === "Juri") {
            return "#ef6d10";
        } else if (d.character === "Miki") {
            return "#2383e4";
        } else if (d.character === "Utena") {
            return "#f6a0cd";
        } else if (d.character === "Anthy") {
            return "#7641ab";
        } else if (d.character === "Akio" || d.character === "Dios") {
            return "#f3cdf0";
        } else if (d.character === "Nanami") {
            return "#f9da31";
        } else if (d.character === "Mikage") {
            return "#3c285d";
        } else if (d.character === "Ruka") {
            return "#1f3cab";
        } else if (d.character === "Tatsuya") {
            return "#3e3b33";
        } else if (d.character === "Shadow") {
            return "grey";
        } else if (d.character === "Tokiko") {
            return "#5d2128";
        } else if (d.character === "Kanae") {
            return "#dcf2c4";
        } else if (d.character === "Keiko") {
            return "#9d6a3a";
        } else if (d.character === "Aiko") {
            return "#2e2816";
        } else if (d.character === "Yuuko") {
            return "#652815";
        } else {
            return "black";
        }
    }
}