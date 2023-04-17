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
        getMaxChar();


        //get the character who says the word/line the most
        function getMaxChar(){
            let speakers = d3.group(vis.words, d => d["Speaker"])
            vis.aggregatedData.forEach( d => {
                let wordSearch = d.Word;
                let max = 0
                let char = ""
                speakers.forEach(c => {
                    let t = (c.map(d => d["Word"]))
                    let oc = t.filter(x => x===wordSearch).length
                    if (oc > max){
                        max = oc
                        char = c[0].Speaker;
                    }
                });
                d["Speaker"] = char;
                d["Speakercount"] = max;
            });
        }

        vis.layout = d3.layout.cloud()
            .size([vis.width, vis.height])
            //.words(vis.words.map( function(d) { return d.Word;}).map(function(d) { return {text: d}; }))
            .words(vis.aggregatedData.map(function(d)  { return {text: d.Word, size:d.count, char: d.Speaker}; }))
            //.words(vis.t)
            .padding(5)
            //change fontSize if we add more items
            .fontSize(function(d) { 
                if (sizing >= 100) { //need to shrink words
                    return d.size / (sizing/40);
                } else { //need to increase words
                    return d.size * (sizing/25);
                }
            })
            .on("end", draw);
        vis.layout.start();

        function draw(words) {
            console.log(words);
            vis.svg.selectAll("text").remove();
            vis.svg
                .append("g")
                .attr("transform", "translate(" + vis.width / 2 + "," + vis.height/ 2 + ")")
                .selectAll("text")
                //.data(vis.words.map( function(d) { return d.Word;}))
                .data(words)
                .enter().append("text")
                  .style("font-size", function(d) { return d.size + "px"; })
                  .attr("text-anchor", "middle")
                  //.style("fill", "blue")
                  .style("fill", function(d){
                        if(d.char === "Shiori"){
                            return "#b85294";
                        } else if (d.char === "Kozue") {
                            return "#8489ef";
                        } else if (d.char === "Wakaba") {
                            return "#d77149";
                        } else if (d.char === "Mitsuru") {
                            return "#f1cc3d";
                        } else if (d.char === "Touga") {
                            return "#ba2332";
                        } else if (d.char === "Saionji") {
                            return "#57845b";
                        } else if (d.char === "Juri") {
                            return "#ef6d10";
                        } else if (d.char === "Miki") {
                            return "#2383e4";
                        } else if (d.char === "Utena") {
                            return "#f6a0cd";
                        } else if (d.char === "Anthy") {
                            return "#7641ab";
                        } else if (d.char === "Akio" || d.char === "Dios") {
                            return "#f3cdf0";
                        } else if (d.char === "Nanami") {
                            return "#f9da31";
                        } else if (d.char === "Mikage") {
                            return "#3c285d";
                        } else if (d.char === "Ruka") {
                            return "#1f3cab";
                        } else if (d.char === "Tatsuya") {
                            return "#3e3b33";
                        } else if (d.char === "Shadow") {
                            return "grey";
                        } else if (d.char === "Tokiko") {
                            return "#5d2128";
                        } else if (d.char === "Kanae") {
                            return "#dcf2c4";
                        } else if (d.char === "Keiko") {
                            return "#9d6a3a";
                        } else if (d.char === "Aiko") {
                            return "#2e2816";
                        } else if (d.char === "Yuuko") {
                            return "#652815";
                        } else {
                            return "black";
                        }
                  })
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