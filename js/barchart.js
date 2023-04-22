class StackedBarChart {
    /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data, _title, _discover, _xlabel, _ylabel, _ALLDATA) {
        // Configuration object with defaults
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 710,
            containerHeight: _config.containerHeight || 200,
            margin: _config.margin || { top: 25, right: 60, bottom: 60, left: 70 },
            reverseOrder: _config.reverseOrder || false,
            tooltipPadding: _config.tooltipPadding || 15,
            yScaleLog: _config.yScaleLog || false,
            colors: _config.colors || NaN,
        }
        this.data = _data;
        this.title = _title;
        this.discover = _discover;
        this.xlabel = _xlabel;
        this.ylabel = _ylabel;
        this.ALLDATA = _ALLDATA;
        //   this.id = _id
        this.initVis();
    }

    /**
     * Initialize scales/axes and append static chart elements
     */
    initVis() {
        let vis = this;

        // Calculate inner chart size. Margin specifies the space around the actual chart.
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.xScale = d3.scaleBand()
            .range([0, vis.width])
            .paddingInner(0.2)
            .paddingOuter(0.2);

        vis.yScale = d3.scaleLinear()
            .range([vis.height, 0]);

        // Initialize axes
        vis.xAxis = d3.axisBottom(vis.xScale);
        vis.yAxis = d3.axisLeft(vis.yScale).ticks(6);

        // Define size of SVG drawing area
        vis.svg = d3
            .select(vis.config.parentElement)
            .attr("width", vis.config.containerWidth)
            .attr("height", vis.config.containerHeight);

        // Append group element that will contain our actual chart
        vis.chart = vis.svg
            .append("g")
            .attr(
                "transform",
                `translate(${vis.config.margin.left},${vis.config.margin.top})`
            );

        // Append empty x-axis group and move it to the bottom of the chart
        vis.xAxisG = vis.chart
            .append("g")
            .attr("class", "axis x-axis")
            .attr("transform", `translate(0,${vis.height})`);

        // Append y-axis group
        vis.yAxisG = vis.chart.append("g").attr("class", "axis y-axis");

        // Initialize stack generator and specify the categories or layers
        // that we want to show in the chart
        vis.stack = d3.stack().keys(["milk", "water"]);

        vis.updateVis();
    }

    /**
     * Prepare the data and scales before we render it.
     */
    updateVis() {
        let vis = this;

        if (vis.config.reverseOrder) {
            vis.data.reverse();
        }

        //   vis.xScale.domain([2015, 2016, 2017]);
        //   vis.yScale.domain([0, 18]);

        // Specificy x- and y-accessor functions
        //   console.log(vis.data);
        // vis.xValue = d => d[0];
        // vis.yValue = d => d[1];
        // vis.colorValue = d => vis.colors(d[0]);

        // Set the scale input domains
        vis.xScale.domain(getCharacters(vis.data));
        vis.yScale.domain([0, getLargest(vis.data)]);

        // Call stack generator on the dataset
        //   vis.stackedData = vis.stack(vis.data);
        //   console.log(vis.stackedData);
        if (vis.discover) {
            // console.log(vis.discover)
            vis.xAxisG
                // .transition().duration(1000)
                .call(vis.xAxis)
                .selectAll('text')
                .style("text-anchor", "start")
                .style("font-size", "10px")
                .attr('transform', "rotate(25)");

        }

        vis.renderVis();
    }

    /**
     * This function contains the D3 code for binding data to visual elements
     * Important: the chart is not interactive yet and renderVis() is intended
     * to be called only once; otherwise new paths would be added on top
     */
    renderVis() {
        let vis = this;

        let bars = vis.chart
            .selectAll(".category")
            .data(vis.data)
            .join("g")
            .attr("class", (d) => `category ${d.key}`)
            .selectAll("rect")
            .data((d) => d)
            .join("rect")
            .attr("x", (d) => vis.xScale(d.data.speaker))
            .attr("y", (d) => vis.yScale(d[1]))
            .attr("height", (d) => vis.yScale(d[0]) - vis.yScale(d[1]))
            .attr("width", vis.xScale.bandwidth());


        bars
            .on('mouseover', (event, d) => {
                // console.log(d);
                d3.select('#tooltip')
                    .style('opacity', 1)
                    // Format number with million and thousand separator
                    .html(`<div class="tooltip-label">${d.data.speaker}</div>${getArcFromVals(d)}: ${d3.format(',')(d[1] - d[0])}`);
            })
            .on('mousemove', (event) => {
                d3.select('#tooltip')
                    .style('left', (event.pageX + vis.config.tooltipPadding) + 'px')
                    .style('top', (event.pageY + vis.config.tooltipPadding) + 'px')
            })
            .on('mouseleave', () => {
                d3.select('#tooltip').style('opacity', 0);
            });

        bars.on('click', function (event, d) {

            // "Calls By Zipcode"
            if (vis.title === "Characters Lines by Arc") {
                //already has wednesday
                const isActive = barFilter.includes(getArcFromVals(d).slice(-1));
                if (isActive) {
                    //weekday.findIndex(d[0])
                    barFilter = barFilter.filter(f => f !== getArcFromVals(d).slice(-1)); // Remove from filter
                    // d3.select(event.currentTarget).style("stroke", "none");
                    //^CSS, change as we see fit
                } else {
                    barFilter.push(getArcFromVals(d).slice(-1)); // Add to filter
                    // d3.select(event.currentTarget).style("stroke", "#000000").style("stroke-width", 3);
                    //^CSS, change as we see fit
                }
            }



            filterData(vis.ALLDATA);

        });

        // Update the axes
        vis.xAxisG.call(vis.xAxis);
        vis.chart.append('text')
            .attr('class', 'axis-title')
            .attr("y", vis.height + vis.config.margin.bottom - 10)
            .attr("x", (vis.width / 2))
            .style("text-anchor", "middle")
            .text(vis.xlabel);

        vis.yAxisG.call(vis.yAxis);
        vis.chart.append('text')
            .attr('class', 'axis-title')
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - vis.config.margin.left)
            .attr("x", 0 - (vis.height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(vis.ylabel);
    }
}



function getCharacters(data_base) {
    characters = []
    data_base.forEach(arc => {
        arc.forEach(d => {
            if (!(d['data']['speaker'] in characters)) {
                characters.push(d['data']['speaker'])
            }
        })
    })


    return (characters)
}

function getLargest(data_base) {
    let mx = 0

    data_base.forEach(arc => {
        arc.forEach(d => {
            if ((d['1'] > mx)) {
                mx = d['1']
            }
        })
    })
    // console.log(mx)
    return (mx)
}

function getArcFromVals(item) {
    // console.log(item.data)
    for (let arc in item.data) {
        if (item.data[arc] === (item[1] - item[0])) {
            return (arc)
        }
    }
    return ('poijhn')
}
