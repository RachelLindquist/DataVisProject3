class heatmap {
    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            margin: { top: 15, bottom: 85, right: 80, left: 36},
            scaleType: _config.scaleType
            // margin: { top: 10, bottom: 30, right: 10, left: 30 }
        }

        let dataLength = undefined;

        if (typeof _data === 'object')
            dataLength = Object.keys(_data).length * _config.barWidth;

        this.config.contentWidth = _config.contentWidth || dataLength || 600;
        this.config.contentHeight = _config.contentHeight || 400;
        this.config.containerWidth = this.config.contentWidth + this.config.margin.left 
            + this.config.margin.right;
        this.config.containerHeight = this.config.contentHeight + this.config.margin.top
            + this.config.margin.bottom;

        // Call a class function

        this.data = _data;
        this.initVis();
    }

    initVis() {
        let vis = this;

        vis.width = vis.config.containerWidth - vis.config.margin.left -
            vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - 
            vis.config.margin.bottom;

        // vis.xValue = d => d.radius;
        vis.xValue = d => d.epNum;
        vis.yValue = d => d.character;

        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},
                ${vis.config.margin.top})`);

        // vis.chart.append("text").attr("x", -36).attr("y", 10).text("Sat")
        //     .style("font-size", "15px");

        // vis.chart.append("text").attr("x", -36).attr("y", 108).text("Sun")
        //     .style("font-size", "15px");

        // vis.chart.append("text").attr("x", 0).attr("y", 128).text("Jan")
        //     .style("font-size", "15px");

        // vis.chart.append("text").attr("x", 820).attr("y", 128).text("Dec")
        //     .style("font-size", "15px");

        vis.xAxisG = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0,${vis.height})`);
            // .attr('transform', `translate(0, 300));

        vis.yAxisG = vis.chart.append('g')
            .attr('class', 'axis y-axis');

        // vis.xScale = d3.scaleBand()
        //     .range([ 0, vis.width ])
        //     .domain([d3.min(vis.data, vis.xValue), d3.max(vis.data, vis.xValue)])
        //     .padding(0.01);

        // vis.xScale = d3.scaleLog()
        //     .base(10)
        //     .range([0, vis.width]);

        // vis.yScale = d3.scaleBand()
        //     .range([vis.height, 0])
        //     .domain([d3.min(vis.data, vis.yValue), d3.max(vis.data, vis.yValue)])
        //     .padding(0.01);

        vis.xScale = d3.scaleLinear()
            .range([0, vis.width])
            .domain([1, d3.max(vis.data, d => parseInt(d.epNum))]);

        console.log("arr:", [1, d3.max(vis.data, d => parseInt(d.epNum))]);

        vis.yScale = d3.scaleBand()
        // .range([0, vis.height]);
            .range([0, vis.height])  // TODO why reverse:w
            .domain([...new Set(vis.data.map(d => d.character))]);

        // let zones = 10;
        // let xZones = 365;
        // let yZones = 7;

        // let bandSize = (d3.max(vis.data, vis.xValue) - 
        //     d3.min(vis.data, vis.xValue)) / zones;

        // let xMinMaxVal = d3.extent(vis.data.map(d => vis.xScale(vis.xValue(d))));
        // let yMinMaxVal = d3.extent(vis.data.map(d => vis.yScale(vis.yValue(d))));

        // console.log("xMinMaxVal:", xMinMaxVal);

        // let xBandSize = (xMinMaxVal[1] - xMinMaxVal[0]) / xZones;
        // let yBandSize = (yMinMaxVal[1] - yMinMaxVal[0]) / yZones;

        // console.log("min max:", minMaxVal);
        // console.log("band size:", bandSize);
        // console.log("vis.data length:", vis.data.length);  // result seems okay

        // // add x and y zone to each heatmap block
        // for (const calldata of vis.data) {
        //     let xVal = vis.xScale(vis.xValue(calldata));
        //     let yVal = vis.yScale(vis.yValue(calldata));
        //     // console.log("y val:", vis.yScale(vis.yValue(planet)));

        //     // for each individual call data, assign it a zone
        //     for (let i = 0, step = 0; i < xZones; i++) {
        //         if (vis.xScale(vis.xValue(calldata)) >= step &&
        //             vis.xScale(vis.xValue(calldata)) < step + xBandSize) {
        //             calldata.xzone = i;
        //             break;
        //         }

        //         step += xBandSize;
        //     }

        //     // TODO check if zone exists in planet, if not set zone to last one ?
        //     if (!calldata.hasOwnProperty("xzone")) {
        //         console.log("x key does not exist!!!, so adding");
        //         calldata.xzone = xZones - 1;
        //     }

        //     for (let i = 0, step = 0; i < yZones; i++) {
        //         if (vis.yScale(vis.yValue(calldata)) >= step &&
        //             vis.yScale(vis.yValue(calldata)) < step + yBandSize) {
        //             calldata.yzone = i;
        //             break;
        //         }

        //         step += yBandSize;
        //     }

        //     // TODO check if zone exists in planet, if not set zone to last one ?
        //     if (!planet.hasOwnProperty("yzone")) {
        //         console.log("y key does not exist!!!, so adding");
        //         planet.yzone = zones - 1;
        //     }
        // }

        // console.log("after zone:", vis.data);
        // scatterplotdata = vis.data;

        // for (const planet of vis.data) {
        //     if (!planet.hasOwnProperty("xzone") || !planet.hasOwnProperty("yzone"))
        //         console.log("NO x or y ZONE!!!!!!!!");
        // }


        // var heatmapZoneMap = {};  // stores info about each zone

        // for (let i = 0; i < zones; i++)
        //     for (let j = 0; j < zones; j++)
        //         heatmapZoneMap[i + "," + j] = 0;

        // // TODO determine count for each cell
        // for (const planet of vis.data) {
        //     const zoneKey = planet.xzone + "," + planet.yzone;

        //     // if (!heatmapZoneMap.hasOwnProperty(zoneKey))
        //     //     heatmapZoneMap[zoneKey] = 0;

        //     heatmapZoneMap[zoneKey]++;

        //     // TODO also add other info about the planets
        // }

        // console.log("Object entries heatmapZoneMap:", Object.entries(heatmapZoneMap));

        // var maxPlanets = 0;
        // var totalPlanets = 0;

        // for (const key in heatmapZoneMap) {

        //     if (heatmapZoneMap[key] > maxPlanets) {
        //         maxPlanets = heatmapZoneMap[key];
        //     }

        //     totalPlanets += heatmapZoneMap[key];
        // }

        // console.log("total planets: ", totalPlanets);

        vis.xAxis = d3.axisBottom(vis.xScale)
            .ticks(6);

        vis.yAxis = d3.axisLeft(vis.yScale)
            .ticks(6);

        // vis.xAxisG
        //     .call(vis.xAxis);
            // .call(g => g.select('.domain').remove());

        // vis.yAxisG
        //     .call(vis.yAxis);

        vis.color = d3.scaleLinear()
            .range(["#92d6c7", "#032b22"])
            .domain([0, d3.max(vis.data, d => d.words)]);

        // vis.chart.selectAll('rect')
        //     .data([1,2,3], function(d) {console.log(d);})
        //     .enter()
        //     .append('rect')
        //     .attr("x", 50)
        //     .attr("y", 50)
        //     .attr("width", 100)
        //     .attr("height", 100)
        //     .style("fill", "brown");

        const heatZones = vis.chart.selectAll('rect')
            .data(vis.data)
            // .data(Object.entries(heatmapZoneMap), function(d) {console.log("data is: ", d);})
            .enter()
            .append('rect')
            .attr('x', d => vis.xScale(vis.xValue(d)))
            .attr('y', d => vis.yScale(vis.yValue(d)))
            // .attr("x", function(d) {
            //     // console.log("d value:", d);
            //     const xVal = d.week;
            //     // console.log("xval int val: ", parseInt(xVal));
            //     return 16 * xVal;
            // })
            // .attr('y', d => vis.yScale(vis.yValue(d)))
            // .attr("y", function(d) {
            //     const yVal = d.day;

            //     return 16 * yVal;
            // })
            // .attr('width', d => vis.xScale.bandwidth())
            // .attr('height', d => vis.yScale.bandwidth())
            .attr("width", 14)
            .attr("height", 14)
            // .attr("class", d => d[0])
            // .attr("style", "outline: thin solid red;")
            // .style("fill", d => vis.color(vis.xValue(d)));
            .style("fill", function(d) {
                return vis.color(d.words);
            });

            // .on('mouseover', function(event, d) {
            //     // console.log("entering ", d);
            //     // console.log("e:", event.target.style);
            //     // event.target.style.fill = "red";
            //     // event.target.style.outlineColor = "red";
            //     // event.target.style.outlineWidth = "4";
            //     event.target.style.outline = "3px solid #f5762c";

            //     // event.target.style.fill = "red";
            //     // event.target.style.fill = "red";
            //     // console.log("event:", event.target.attr("style", "outline: thin solid red;"));


            //     d3.select('#tooltip_heatmap')
            //         .style('opacity', 1)
            //         .style('z-index', 1000000)
            //         // Format number with million and thousand separator
            //         .html(`<div class="tooltip-label"><div>Date: ${d.date}</div>
            //             <div>No of calls: ${d.value}</div></div>`);
            // })
            // .on('mousemove', (event) => {
            //     d3.select('#tooltip_heatmap')
            //         .style('left', (event.pageX + 10) + 'px')
            //         .style('top', (event.pageY + 10) + 'px');
            // })
            // .on('mouseleave', (event, d) => {
            //     // console.log("leaving ", d);
            //     if (d.ifClicked === false)
            //         event.target.style.outline = "0";
            //     else
            //         event.target.style.outline = "3px solid #e03660";

            //     d3.select('#tooltip_heatmap').style('opacity', 0);  // turn off the tooltip
            // })
            // .on('click', function(event, d) {
            //     console.log("click d:", d);
            //     // console.log("event:", event);

            //     d.ifClicked = !d.ifClicked;

            //     if (d.ifClicked === true) {
            //         event.target.style.outline = "3px solid #e03660";
            //         d.ifFilter = true;
            //     } else {
            //         event.target.style.outline = "0";
            //         d.ifFilter = false;
            //     }


            //     // filterData(d);
            //     // TODO add all calls in this block to list ?

            //     d.filterIDs.forEach(item => set_filterIDs.add(item));
            //     // console.log("set_filterIDs:", set_filterIDs);

            //     filterMapData();
            // });

        // .on('mouseover', function(event, d) {
        //     // console.log("entering ", d);
        //     // console.log("e:", event.target.style);
        //     // event.target.style.fill = "red";
        //     // event.target.style.outlineColor = "red";
        //     // event.target.style.outlineWidth = "4";
        //     event.target.style.outline = "4px solid #c42351";

        //     // event.target.style.fill = "red";
        //     // event.target.style.fill = "red";
        //     // console.log("event:", event.target.attr("style", "outline: thin solid red;"));
        // })
        // .on('mouseleave', (event, d) => {
        //     event.target.style.outline = "0";
        //     // console.log("leaving ", d);
        // })
        // .on('click', function(event, d) {
        //     console.log("click d:", d);

        //     filterData(d);
        // });
            // .style("fill", d => vis.color(d[1]));
            // .style("fill", "brown");

        // heatZones
        //     .on('mouseover', (event, d) => {
        //     // console.log("heatzone event:", event);
        //     console.log("heatzone d:", d);

        //     d3.select('svg.' + d[0])
        //         .attr("style", "outline: thin solid red;");
        // })
        //     .on('mouseleave', (event, d) => {
        //         d3.select('svg.' + d[0])
        //             .attr("style", "outline: 0;");
        //     });

    }


    clearCells() {
        let vis = this;

        vis.chart.selectAll('rect')
            .style("outline", "0");

        vis.data.forEach(function(d) {
            d.ifClicked = false;
        });
    }

    updateVis() {

    }

    renderVis() {

    }
};
