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

        var svg = d3.select(vis.config.parentElement)
            .append("svg")
                .attr("width", vis.width)
                .attr("height", vis.height)
            .append("g")
                .attr("transform",
                    "translate(" + vis.config.margin.left + "," + vis.config.margin.top + ")");

        vis.updateVis();
    }

    updateVis(){
        let vis = this;
        vis.getNodesAndLinks();
        vis.renderVis();
    }

    getNodesAndLinks(){
        let vis = this;
        //based on example data: https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_network.json
        //get nodes
        let characters = [...new Set(vis.data.map(d => d["Speaker"]))];
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
                        vis.links.push({source:sou, target: tar});
                    });
                });
            });
        });
    }

    renderVis(){
        let vis = this;
    }
}