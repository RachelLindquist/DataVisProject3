class Arc{

    /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _data) {
      // Configuration object with defaults
      this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 710,
        containerHeight: _config.containerHeight || 200,
        margin: _config.margin || {top: 25, right: 60, bottom: 60, left: 70},
      }
      this.data = _data;
      this.initVis();
    }

    initVis(){
        let vis = this;
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.svg = d3.select(vis.config.parentElement)
            .append("svg")
                .attr("width", vis.width)
                .attr("height", vis.height)
            .append("g")
                .attr("transform",
                    "translate(" + vis.config.margin.left + "," + vis.config.margin.top + ")");


        vis.circlesG = vis.svg.append('g')
            .attr('class', 'circlesG');

        vis.labelsG = vis.svg.append('g')
            .attr('class', 'labelsG');

        vis.linesG = vis.svg.append('g')
            .attr('class', 'linesG');

        vis.updateVis();
    }

    updateVis(){
        let vis = this;
        vis.getNodesAndLinks();
        var allNodes = vis.nodes.map(function(d){return d.name})
        vis.x = d3.scalePoint()
            .range([0, vis.width-100])
            .domain(allNodes)
        
        vis.renderVis();
    }

    getNodesAndLinks(){
        let vis = this;
        //based on example data: https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_network.json
        //get nodes
        let characters = [...new Set(vis.data.map(d => d["Speaker"]))];
        // console.log(characters);
        let i = 1;
        vis.nodes = [];
        characters.forEach(c => {
            vis.nodes.push({id: i, name: c});
            i += 1;
        });
        let t = d3.group(vis.data, d => d["Episode"], s => s["Scene"]);
        //for each episode
        vis.links = [];
        t.forEach(c => {
            //for each scene
            c.forEach(l => {
                //grab speakers
                let n = [...new Set(l.map(d => d["Speaker"]))];
                //for each line
                l.forEach(s => {
                    let sou = vis.nodes.filter(d => d.name === s.Speaker)[0].id;
                    let rec = n.filter(d => d != s.Speaker);
                    rec.forEach(r => {
                        let tar = vis.nodes.filter(d => d.name === r)[0].id;
                        let dic = {source:sou, target: tar};
                        let dicInLinks = false;
                        vis.links.forEach(i => {
                            // console.log();
                            if ((i.source == dic.source) && (i.target == dic.target)){
                                dicInLinks = true;
                                // break;
                            }

                        })
                        if (!dicInLinks)
                            vis.links.push(dic);
                    });
                });
            });
        });
        // console.log("Links",vis.links);
    }

    getColor(d){
        if(d.name === "Shiori"){
            return "#b85294";
        } else if (d.name === "Kozue") {
            return "#8489ef";
        } else if (d.name === "Wakaba") {
            return "#d77149";
        } else if (d.name === "Mitsuru") {
            return "#f1cc3d";
        } else if (d.name === "Touga") {
            return "#ba2332";
        } else if (d.name === "Saionji") {
            return "#57845b";
        } else if (d.name === "Juri") {
            return "#ef6d10";
        } else if (d.name === "Miki") {
            return "#2383e4";
        } else if (d.name === "Utena") {
            return "#f6a0cd";
        } else if (d.name === "Anthy") {
            return "#7641ab";
        } else if (d.name === "Akio" || d.name === "Dios") {
            return "#f3cdf0";
        } else if (d.name === "Nanami") {
            return "#f9da31";
        } else if (d.name === "Mikage") {
            return "#3c285d";
        } else if (d.name === "Ruka") {
            return "#1f3cab";
        } else if (d.name === "Tatsuya") {
            return "#3e3b33";
        } else if (d.name === "Shadow") {
            return "grey";
        } else if (d.name === "Tokiko") {
            return "#5d2128";
        } else if (d.name === "Kanae") {
            return "#dcf2c4";
        } else if (d.name === "Keiko") {
            return "#9d6a3a";
        } else if (d.name === "Aiko") {
            return "#2e2816";
        } else if (d.name === "Yuuko") {
            return "#652815";
        } else {
            return "black";
        }
    }

    renderVis() {
        let vis = this;
        console.log("nodes:", vis.nodes);
       
        vis.circleNodes = vis.circlesG
            .selectAll("circle")
            .data(vis.nodes)
            .join('circle')
            .attr("class", "mynodes")
            .attr("cx", d => vis.x(d.name))
            .attr("cy", vis.height - 60)
            .attr("r", 8)
            .style("fill", d => vis.getColor(d));

        vis.nodelabels = vis.labelsG
            .selectAll("text")
            .data(vis.nodes)
            .join('text')
            .attr("x", d => vis.x(d.name))
            .attr("y", vis.height-40)
            .text(function(d){ return(d.name)})
            .style("text-anchor", "middle")
            .attr('font-size', "10");

        var idToNode = {};

        vis.nodes.forEach(function (n) {
            idToNode[n.id] = n;
        });
        
        vis.linkLines = vis.linesG
            .selectAll('path')
            .data(vis.links)
            .join('path')
            .attr('d', function (d) {
                let start = vis.x(idToNode[d.source].name)
                let end = vis.x(idToNode[d.target].name)      
                return ['M', start, vis.height-60,   
                    'A',                            
                    (start - end) / 2, ',', 
                    (start - end) / 2, 0, 0, ',',
                    start < end ? 1 : 0, end, ',', vis.height - 60] 
                    .join(' ');
            })
            .style("fill", "none")
            .style("stroke", d => vis.getColor(idToNode[d.source]));

        vis.circleNodes.on('mouseover', function (event, d) {
            vis.circleNodes.style('fill', "#B8B8B8")
            d3.select(this).style("fill", d => vis.getColor(d))
            //TODO: fix highlights
            vis.linkLines
                .style('stroke', function (link_d) { return link_d.source === d.id || link_d.target === d.id ? vis.getColor(d) : '#b8b8b8';})
                .style('stroke-width', function (link_d) { return link_d.source === d.id || link_d.target === d.id ? 4 : 1;})
        })
            .on('mouseout', function (d) {
                vis.circleNodes.style("fill", d => vis.getColor(d))
                vis.linkLines
                    .style('stroke', d => vis.getColor(idToNode[d.source]))
                    .style('stroke-width', '1')
            })

        /*vis.svg
          .append("text")
            .attr("text-anchor", "middle")
            .style("fill", "#B8B8B8")
            .style("font-size", "17px")
            .attr("x", 50)
            .attr("y", 10)
            .html("Hover nodes") */
         
    }
}
