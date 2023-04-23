class heatmap {
    constructor(_config, _data, epList, characterList, _xlabel, _ylabel, _ALLDATA) {
        this.config = {
            parentElement: _config.parentElement,
            margin: { top: 15, bottom: 85, right: 80, left: 100},
            scaleType: _config.scaleType
            // margin: { top: 10, bottom: 30, right: 10, left: 30 }
        }

        let dataLength = undefined;

        if (typeof _data === 'object')
            dataLength = Object.keys(_data).length * _config.barWidth;

        // this.config.contentWidth = _config.contentWidth || dataLength || 600;
        // this.config.contentHeight = _config.contentHeight || 400;
        // this.config.containerWidth = this.config.contentWidth + this.config.margin.left 
        //     + this.config.margin.right;
        // this.config.containerHeight = this.config.contentHeight + this.config.margin.top
        //     + this.config.margin.bottom;

        this.config.containerWidth = _config.containerWidth;
        this.config.containerHeight = _config.containerHeight;

        this.config.contentWidth = _config.containerWidth - this.config.margin.left - this.config.margin.right;
        this.config.contentHeight = _config.containerHeight - this.config.margin.top - this.config.margin.bottom;
        // Call a class function

        // console.log("width/h:", this.config.con
        this.data = _data;
        this.epList = epList;
        this.characterList = characterList;
        this.xlabel = _xlabel;
        this.ylabel = _ylabel;
        this.ALLDATA = _ALLDATA;

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

        vis.chart.append('text')
            .attr('class', 'axis-title')
            .attr("y", vis.height + vis.config.margin.bottom - 45)
            .attr("x", (vis.width / 2))
            .style("text-anchor", "middle")
            .text(vis.xlabel);

        let ylabels = vis.chart.append('text')
            .attr('class', 'axis-title')
            .attr("transform", "rotate(-90)")
            .attr("y", 25 - vis.config.margin.left)
            .attr("x", 0 - (vis.height / 2))
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .text(vis.ylabel);

        // ylabels .on('mouseover', function (event, d) {
        //         console.log("mouseover:", d);
        //     });

        // console.log("eps:", vis.data.map(d => d.epNum));
        vis.xScale = d3.scaleBand()
            .range([0, vis.width])
            .domain(vis.epList)
            .paddingInner(0.2);

        // console.log("arr:", [1, d3.max(vis.data, d => parseInt(d.epNum))]);

        vis.yScale = d3.scaleBand()
            .range([0, vis.height])  // TODO why reverse:w
            .domain(vis.characterList)
            .paddingInner(0.2);
            // .domain([...new Set(vis.data.map(d => d.character))]);

        vis.xAxis = d3.axisBottom(vis.xScale)
            .scale(vis.xScale)
            .tickSize(0);

        vis.yAxis = d3.axisLeft(vis.yScale)
            .scale(vis.yScale)
            .tickSize(0);

        // Draw axes

        vis.xAxisG = vis.chart.append('g')
            .attr('class', 'axis x-axis')
            .attr('transform', `translate(0, ${vis.height})`)
            .call(vis.xAxis)
            .call(g => g.select('.domain').remove());
        // .attr('transform', `translate(0, 300));

        // TODO check if approach correct to add mouseover to ticks
        d3.selectAll('.x-axis .tick')
            .on('mouseenter', function (event, d) {
                event.target.classList.add('hovered-label');
                // console.log("mouseover:", d);
            })
            .on('mouseleave', (event, d) => {
                event.target.classList.remove('hovered-label');
            })
            .on('click', function (event, d) {

                if (episodeFilter.episodesToShow.has(d)) {
                    episodeFilter.episodesToShow.delete(d);

                    if (episodeFilter.episodesToShow.size === 0)
                        episodeFilter.ifFilter = false;
                } else {
                    episodeFilter.episodesToShow.add(d);
                    episodeFilter.ifFilter = true;
                }

                console.log("epfilter:", episodeFilter);
                vis.updateVis();
                // console.log("filtered out episodes:", set_filteredOutEpisodes);
                filterData(vis.ALLDATA);
            });

        vis.yAxisG = vis.chart.append('g')
            .attr('class', 'axis y-axis')
            .call(vis.yAxis)
            .call(g => g.select('.domain').remove());
        // vis.xAxisG
        //     .call(vis.xAxis);

        // vis.yAxisG
        //     .call(vis.yAxis);
        d3.selectAll('.y-axis .tick')
            .on('mouseenter', function (event, d) {
                event.target.classList.add('hovered-label');
                // console.log("mouseover:", d);
            })
            .on('mouseleave', (event, d) => {
                event.target.classList.remove('hovered-label');
            })
            .on('click', function (event,  d) {

                if (characterFilter.charactersToShow.has(d)) {
                    characterFilter.charactersToShow.delete(d);

                    if (characterFilter.charactersToShow.size === 0)
                        characterFilter.ifFilter = false;
                } else {
                    characterFilter.charactersToShow.add(d);
                    characterFilter.ifFilter = true;
                }

                console.log("chFilter:", characterFilter);
                vis.updateVis();
                // console.log("filtered out characters:", set_filteredOutCharacters);
                filterData(vis.ALLDATA);
            });

        vis.color = d3.scaleLinear()
            .range(["#ffffff", "#244396", "#983521"])
            // .range(["#ffffff", "#d20424"])
            .domain([0, d3.max(vis.data, d => d.words) / 2, d3.max(vis.data, d => d.words)]);

        vis.updateVis();
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

        console.log()
        let vis = this;

        const heatZones = vis.chart.selectAll('rect')
            .data(vis.data.filter(function (d) {

                if (characterFilter.ifFilter === false || episodeFilter.ifFilter === false)
                    return true;

                if (!characterFilter.charactersToShow.has(d.character) ||
                    !episodeFilter.episodesToShow.has(d.episode))
                    return false;
                else
                    return true;

            }))
            // .data(Object.entries(heatmapZoneMap), function(d) {console.log("data is: ", d);})
            .join('rect')
            // .enter()
            // .append('rect')
            .attr('x', d => vis.xScale(vis.xValue(d)))
            .attr('y', d => vis.yScale(vis.yValue(d)))
            .attr("width", vis.xScale.bandwidth())
            .attr("height", vis.yScale.bandwidth())
            // .attr("class", d => d[0])
            .attr("class", 'embossed-text')
            // .attr("style", "outline: thin solid red;")
            // .style("fill", d => vis.color(vis.xValue(d)));
            .style("fill", function(d) {
                return vis.color(d.words);
            })
            .on('mouseover', function(event, d) {
                // console.log("entering ", d);
                // console.log("e:", event.target.style);
                // event.target.style.fill = "red";
                // event.target.style.outlineColor = "red";
                // event.target.style.outlineWidth = "4";
                event.target.style.outline = "3px solid #ab965e";
                // event.target.classList.add('embossed-text');

                // event.target.style.fill = "red";
                // event.target.style.fill = "red";
                // console.log("event:", event.target.attr("style", "outline: thin solid red;"));

                d3.select('#tooltip_heatmap')
                    .style('opacity', 1)
                    .style('z-index', 1000000)
                    .html(`
                           <div class="tooltip-character-name">${d.character}</div>
                           said ${d.words} words in episode ${d.epNum}
                          `);
            })
            .on('mousemove', (event) => {
                d3.select('#tooltip_heatmap')
                    .style('left', (event.pageX + 10) + 'px')
                    .style('top', (event.pageY + 10) + 'px');
            })
            .on('mouseleave', (event, d) => {
                event.target.style.outline = "0";
                d3.select('#tooltip_heatmap').style('opacity', 0);  // turn off the tooltip
            })
            .on('click', function(event, d) {

                /*
                // console.log(d)
                if (set_filteredOutCharacters.includes(d.character)) {
                    set_filteredOutCharacters = set_filteredOutCharacters.filter(f => f !== d.character);
                    d3.select(event.currentTarget).style("stroke", "#000000").style("stroke-width", 3);
                } else {
                    set_filteredOutCharacters.push(d.character);
                    d3.select(event.currentTarget).style("stroke", "#000000").style("stroke-width", 3);
                }

                if (set_filteredOutEpisodes.includes(d.epNum)) {
                    set_filteredOutEpisodes = set_filteredOutEpisodes.filter(f => f !== d.epNum);;
                    d3.select(event.currentTarget).style("stroke", "none");
                } else {
                    set_filteredOutEpisodes.push(d.epNum);
                    d3.select(event.currentTarget).style("stroke", "#000000").style("stroke-width", 3);
                }
                */

                filterData(vis.ALLDATA);
            });

    }

    renderVis() {

    }
};
