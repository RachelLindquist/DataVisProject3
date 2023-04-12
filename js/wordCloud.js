class WordCloud{

    /**
     * Class constructor with basic chart configuration
     * @param {Object}
     * @param {Array}
     */
    constructor(_config, _words) {
      // Configuration object with defaults
      this.config = {
        parentElement: _config.parentElement,
        containerWidth: _config.containerWidth || 710,
        containerHeight: _config.containerHeight || 200,
        margin: _config.margin || {top: 25, right: 60, bottom: 60, left: 70},
      }
      this.words = _words;
      this.initVis();
    }

    initVis(){
        let vis = this;
      
  
        // Calculate inner chart size. Margin specifies the space around the actual chart.
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.svg = d3.select(vis.config.parentElement).append("svg")
            .attr("width", vis.config.containerWidth)
            .attr("height", vis.config.containerHeight)
            .append("g")
            .attr("transform", "translate(" + vis.config.margin.left + "," + vis.config.margin.top + ")");

        
        vis.updateVis();

    }
    //TODO: add colors based on most often speaker

    updateVis(){
        let vis = this;
        //vis.words = [...new Set(vis.words.map(d => d["Word"]))];
        //let aggregatedDataMap = d3.rollups(vis.words, v => v.length, d => d.Word);
        let aggregatedDataMap = d3.rollups(vis.words, v => v.length, d => d.Word);
        vis.aggregatedData = Array.from(aggregatedDataMap, ([Word, count]) => ({ Word, count}));
        vis.aggregatedData = vis.aggregatedData.sort((a,b) => {
            return b.count -  a.count;
          });
        let sizing = vis.aggregatedData[0].count;
        //grabbing top 70, can grab more, just need to change font sizes a bit
        if (sizing >= 100){ //lots of common words
            vis.aggregatedData = vis.aggregatedData.slice(0, 70);
        } else { // lots of uncommon words
            vis.aggregatedData = vis.aggregatedData.slice(0, 50);
        }

        vis.layout = d3.layout.cloud()
            .size([vis.width, vis.height])
            //.words(vis.words.map( function(d) { return d.Word;}).map(function(d) { return {text: d}; }))
            .words(vis.aggregatedData.map(function(d)  { return {text: d.Word, size:d.count}; }))
            //.words(vis.t)
            .padding(5)
            //change fontSize if we add more items
            .fontSize(function(d) { 
                if (sizing >= 100) {
                    return d.size / (sizing/40);
                } else {
                    return d.size * (sizing/25);
                }
            })
            .on("end", draw);
        vis.layout.start();

        function draw(words) {
            console.log(words);
            vis.svg
                .append("g")
                .attr("transform", "translate(" + vis.width / 2 + "," + vis.height/ 2 + ")")
                .selectAll("text")
                //.data(vis.words.map( function(d) { return d.Word;}))
                .data(words)
                .enter().append("text")
                  .style("font-size", function(d) { return d.size + "px"; })
                  .attr("text-anchor", "middle")
                  .attr("transform", function(d) {
                    //d.rotate
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                  })
                  .text(function(d) { return d.text; });
    
          }
                

    }

    
 
    renderVis(){

    }

}