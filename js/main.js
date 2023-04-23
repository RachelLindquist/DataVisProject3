let data, characters, episodes;
let arc;
let barFilter = {'ifFilter' : false, 'arcToShow' : ""};
let characterFilter = {'ifFilter': false, charactersToShow : new Set()};
let episodeFilter = {'ifFilter': false, episodesToShow : new Set()};
// let set_filteredOutCharacters = new Set();
// let set_filteredOutEpisodes = new Set();

class tempClass {
    constructor(_data, _ALLDATA) {
        this.data = _data;
        this.ALLDATA = _ALLDATA;
        this.hist = [];
    }
}

d3.csv("data/UtFullmEA.csv").then(_data => {
    data = _data
    
    // TODO remove this ?
    characters = [...new Set(data.map(d => d["Speaker"]))];
    // console.log(characters)

    // TODO move allowed characters in a list
    data = data.filter(function (d) {
        // These are all of the characters that appear throughout multiple episodes
        // We can remove some of the less important people or Narration
        // The series also has different songs that play each episode, 1 (zettai unmei...) is constant
        // The other changes based on who the antagonist of the episode is
        // I left both of them out, but they can be added
        // Main characters: Utena, Saionji, Miki, Juri, Touga, Anthy, Akio (Dios), Nanami
        // Important characters: Shiori, Kozue, Shadow, Ruka, Mikage, Mitsuru, Wakaba
        // Important, but only for 1 or a couple episodes: Mamiya, Tatsuya, Tokiko, Kanae
        // Nanami's lackies, show up often: Keiko, Aiko, Yuuko
        return d["Speaker"].includes("Wakaba") || d["Speaker"].includes("Utena") || d["Speaker"].includes("Shiori")
            || d["Speaker"].includes("Saionji") || d["Speaker"].includes("Miki") || d["Speaker"].includes("Juri")
            || d["Speaker"].includes("Touga") || d["Speaker"].includes("Anthy") || d["Speaker"].includes("Nanami")
            || d["Speaker"].includes("Kozue") || d["Speaker"].includes("Keiko") || d["Speaker"].includes("Aiko")
        /*|| d["Speaker"].includes("Narration") */ || d["Speaker"].includes("Shadow") || d["Speaker"].includes("Yuuko")
            || d["Speaker"].includes("Kanae") || d["Speaker"].includes("Keiko") || d["Speaker"].includes("Mamiya")
            || d["Speaker"].includes("Mitsuru") || d["Speaker"].includes("Mikage") || d["Speaker"].includes("Tatsuya")
            || d["Speaker"].includes("Tokiko") || d["Speaker"].includes("Dios") || d["Speaker"].includes("Ruka")
            || d["Speaker"].includes("Akio");
    });
    // console.log("data:", data);

    // TODO convert to lowercase ?
    characters = [...new Set(data.map(d => d["Speaker"]))];
    episodes = [...new Set(data.map(d => d["Episode"]))];
    
    console.log("characters set:", characters);
    //lineCount = countLines();
    //episodeCount = countEpisodes();
    characterLines = getCharLines();


    //I will fix this later to match character's actual colors depending on how many characters we want to display
    const characterColors = d3.scaleOrdinal()
        .domain(characters)
        .range(d3.quantize(d3.interpolateHcl("#0000ff", "#f0000f"), characters.length));




    // console.log('heatmapdata:', heatmapdata_characterLinesVsEp);

    let widthitem = (5 / 12) * window.innerWidth  - 15;
    const colWidth = parseInt(window.innerWidth / 12);
    // console.log("innerwidth colwidth:", window.innerWidth, colWidth);
    // console.log(colWidth * (4));
    let heightitem = window.innerHeight / 2.5;
    // let heightitem = window.innerHeight / 1.5;

    // placeholder to help sort through all the garbage
    placeholderClass = new tempClass(data, data);  // this is a placeholder for heatmap


    placeholderClass.hdata = getHeatmapData(data);

    // heatmap
    heatMapObj = new heatmap({
        'parentElement': '#dateheatmap',
        'containerHeight': heightitem,
        'containerWidth': parseInt(colWidth * 7),
        // 'containerWidth': colWidth * (4/12) - 15,
    }, placeholderClass.hdata[0],
        placeholderClass.hdata[1],
        placeholderClass.hdata[2],
        "Episodes",
        "Characters",
        data);


    // stacked chart
    characterBarChart = new StackedBarChart({
        'parentElement': '#stackedBarChart',
        'containerHeight': heightitem,
        'containerWidth': parseInt(colWidth * 5),
        'reverseOrder': true,
        // 'yScaleLog': false
        'colors': ['#00ff00', '#0000ff']
    }, getBarData(data), "Characters Lines by Arc", true, "Character", "Number of Lines", data);

    characterBarChart.updateVis();
   
    // line chart
    lineChart = new LineChart({
        'parentElement': '#linechart',
        'containerHeight': heightitem,
        'containerWidth': parseInt(colWidth * 12),
    }, getLineChartData(data)[0]);
    // placeholderClass.hdata[0]

    // Wordcloud
    wordCloud = new WordCloud({
        'parentElement': '#wordCloud',
        'containerHeight': widthitem,
        'containerWidth': parseInt(colWidth * 6),
    }, getWords(data));

    //phraseCloud
    phraseCloud = new WordCloud({
        'parentElement': '#phraseCloud',
        'containerHeight': widthitem,
        'containerWidth': parseInt(colWidth * 6),
    }, getPhrases(data));

    arc = new Arc({
        'parentElement': '#arc',
        'containerHeight': 750,
        'containerWidth': parseInt(colWidth * 12),
    }, data);




});

function countEpisodes() {
    speakers = d3.group(data, d => d["Speaker"]);
    episode = {}
    speakers.forEach(c => {
        let t = [...new Set(c.map(d => d["Episode"]))].length;
        episode[c[0]["Speaker"]] = t;
    });
    return episode;
}

function countLines() {
    speakers = d3.group(data, d => d["Speaker"])
    line = {}
    speakers.forEach(c => {
        let t = c.length
        line[c[0]["Speaker"]] = t;
    })
    return line;
}

function getCharLines() {
    speakers = d3.group(data, d => d["Speaker"])
    lines = {}
    speakers.forEach(c => {
        let t = (c.map(d => d["Line"]))
        lines[c[0]["Speaker"]] = t;
    })
    // console.log(lines);
    return lines;
}

function getWords() {
    let words = [];
    data.forEach(c => {
        let line = c["Line"];
        line = clean(line);
        line.forEach(l => {
            words.push({ Speaker: c["Speaker"], Word: l, Episode: c["Episode"], Arc: c["Arc"] });
        });

    });
    // console.log(words);
    return words;//.slice(0, 2000);
}

function getPhrases() {
    let phrases = [];
    data.forEach(c => {
        let line = c["Line"];
        //line = cleanLine(line);
        phrases.push({ Speaker: c["Speaker"], Word: line, Episode: c["Episode"], Arc: c["Arc"] });
    });
    // console.log(phrases);
    return phrases;//.slice(0, 2000);
}

function findInput(){
    let input = document.getElementById("input").value;
    let locations = [];
    data.forEach(c => {
        if (c.Line.includes(input)){
            locations.push({ Speaker: c["Speaker"], Line: /*c["Line"]*/ "Said ", Episode: c["Episode"], Arc: c["Arc"]});
        }
    })
    console.log(input);
    lineChart.data = getLineChartData(locations)[0];
    lineChart.updateVis();
    //inputLine.data = locations;
    //console.log(input);
    //console.log(locations);
    //return locations;
}


function clean(line) {
    //removed puncutation and cleans up the line
    line = line.replace("...", " ");
    line = line.replace(/-/g, " ");
    line = line.replace(/['"]+/g, '');
    line = line.toLowerCase();
    // TODO improve regex

    // see https://stackoverflow.com/a/494046
    // backslash itself needs to be escaped in order for it to be part of the regex pattern
    const replace = "[.,\\/#!$%\\^&\\*;:{}=\\_`~()?]";
    let re = new RegExp(replace, "g");
    var punctuationless = line.replace(re, "");

    var cleanedString = punctuationless.replace(/\s{2,}/g, " ");

    // convert string to array
    lineArr = cleanedString.split(" ");

    // remove filler words, pretend I've listed them all 
    let remove = ['i', 'me', 'my', 'myself', 'we', 'us', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him',
        'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which',
        'who', 'whom', 'whose', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do',
        'does', 'did', 'doing', 'will', 'would', 'should', 'can', 'could', 'ought', "i'm", "you're", "he's", "she's", "it's", "we're", "they're", "i've",
        "you've", "we've", "they've", "i'd", "you'd", "he'd", "she'd", "we'd", "they'd", "i'll", "you'll", "he'll", "she'll", "we'll", "they'll", "isn't",
        "aren't", "wasn't", "weren't", "hasn't", "haven't", "hadn't", "doesn't", "don't", "didn't", "won't", "wouldn't", "shan't", "shouldn't", "can't",
        "cannot", "couldn't", "mustn't", "let's", "that's", "who's", "what's", "here's", "there's", "when's", "where's", "why's", "how's", 'a', 'an', 'the',
        'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during',
        'before', 'after', 'above', 'below', 'to', 'from', 'up', 'upon', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once',
        'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not',
        'only', 'own', 'same', 'so', 'than', 'too', 'very', 'say', 'says', 'said', 'shall', "oh", 'o', " ", "go", "ya", "ive", "id", "yes", "no",
        "youre", "know", "im", "like", "going", "go", "san", "isnt", "ha", "eh", "dont", "sama", "ill", "huh", "youve"];

    lineArr = lineArr.filter(item => !remove.includes(item));
    lineArr = lineArr.filter(item => item);
    return lineArr;
}


function getBarData(data_base) {
    speakers = {}

    data_base.forEach(d => {
        if (d.Speaker in speakers) {
            // if (`Arc${d.Arc}` in speakers[d.Speaker]) {
            speakers[d.Speaker][`Arc${d.Arc}`] += 1;
            // } else {
            // speakers[d.Speaker][`Arc${d.Arc}`] = 1;
            // }
        } else {
            speakers[d.Speaker] = { 'Arc1': 0, 'Arc2': 0, 'Arc3': 0, 'Arc4': 0 };
            speakers[d.Speaker][`Arc${d.Arc}`] += 1; // in case they arnt in the first arc
        }

    })

    const stack = d3.stack().keys(['Arc1', 'Arc2', 'Arc3', 'Arc4']);
    // let barData = stack(speakers);
    // let barData = speakers;
    // console.log(dicToArr2(speakers))

    let data1 = stack(dicToArr2(speakers));
    return (data1);
}


function dicToArr(totalp) {
    // this is lazy coding but i needed to do it quickly so
    let data1 = [];
    for (let tp in totalp) {
        data1.push([tp, totalp[tp]]);
    }
    return (data1);
}
function dicToArr2(totalp) {
    // this is lazy coding but i needed to do it quickly so
    let data1 = [];
    for (let tp in totalp) {
        let val = totalp[tp];
        val['speaker'] = tp;
        data1.push(val);
    }
    return (data1);
}

function getHeatmapData(data) {
    // heatmap
    let characterLinesVsEp = {};

    let epSet = new Set();
    let characterSet = new Set();


    // console.log("characters:", characters);
    // add an object for each (character, ep) pair. This will map to indivudual cells in the heatmap
    characters.forEach(function (d) {
        characterLinesVsEp[d] = {};

        episodes.forEach(ep => characterLinesVsEp[d][ep] = 0);
    });

    for (const dialogData of data) {
        // console.log("speaker:", dialogData.Speaker);
        const character = dialogData.Speaker;
        const epNum = dialogData.Episode;

        // TODO remove this ?
        epSet.add(epNum);
        characterSet.add(character);

        // not sure how ?.length works. ref https://bobbyhadz.com/blog/javascript-count-spaces-in-string
        // console.log("character:", character);
        characterLinesVsEp[character][epNum] += (dialogData.Line.match(/(\s+)/g)?.length || 0);
    }

    // console.log("characterlinesvsepdata:", characterLinesVsEp);

    // now convert to array for that can be fed to heatmap object
    // array of objects, with each object to be mapped to a single cell in the heatmap
    let heatmapdata_characterLinesVsEp = [];

    Object.keys(characterLinesVsEp).forEach(k => {
        Object.keys(characterLinesVsEp[k]).forEach(epNum => {
            heatmapdata_characterLinesVsEp.push({
                "character": k,
                "epNum": epNum,
                "words": characterLinesVsEp[k][epNum]
            });
        });
    });

    epSet = Array.from(epSet).sort((a, b) => (parseInt(a) - parseInt(b))),
        characterSet = Array.from(characterSet)

    return ([heatmapdata_characterLinesVsEp, epSet, characterSet]);
}

function getLineChartData(data) {
    let characterLinesVsEp = {};

    let epSet = new Set();
    let characterSet = new Set();
    let characters = [...new Set(data.map(d => d["Speaker"]))];
    let epidodes = [...new Set(data.map(d => d["Episode"]))];
    // console.log("chars and episodes", characters, episodes)

    // console.log("characters:", characters);
    // add an object for each (character, ep) pair. This will map to indivudual cells in the heatmap
    characters.forEach(function (d) {
        characterLinesVsEp[d] = {};

        episodes.forEach(ep => characterLinesVsEp[d][ep] = 0);
    });

    for (const dialogData of data) {
        // console.log("speaker:", dialogData.Speaker);
        const character = dialogData.Speaker;
        const epNum = dialogData.Episode;

        // TODO remove this ?
        epSet.add(epNum);
        characterSet.add(character);

        // not sure how ?.length works. ref https://bobbyhadz.com/blog/javascript-count-spaces-in-string
        // console.log("character:", character);
        characterLinesVsEp[character][epNum] += (dialogData.Line.match(/(\s+)/g)?.length || 0);
    }

    // console.log("characterlinesvsepdata:", characterLinesVsEp);

    // now convert to array for that can be fed to heatmap object
    // array of objects, with each object to be mapped to a single cell in the heatmap
    let heatmapdata_characterLinesVsEp = [];

    Object.keys(characterLinesVsEp).forEach(k => {
        Object.keys(characterLinesVsEp[k]).forEach(epNum => {
            heatmapdata_characterLinesVsEp.push({
                "character": k,
                "epNum": epNum,
                "words": characterLinesVsEp[k][epNum]
            });
        });
    });

    epSet = Array.from(epSet).sort((a, b) => (parseInt(a) - parseInt(b))),
        characterSet = Array.from(characterSet)

    return ([heatmapdata_characterLinesVsEp, epSet, characterSet]);
}

// filter function for each item we plan on filtering
function filterData(workingData) {
    // console.log(barFilter)
    placeholderClass.data = workingData;  // set to ALLDATA ?
    // console.log(placeholderClass.data);
    // console.log(set_filteredOutCharacters);


    // dayChart filtering
    if (barFilter.ifFilter === true)
        placeholderClass.data = placeholderClass.data.filter(d => (barFilter.arcToShow === d.Arc));

    if (characterFilter.ifFilter === true)
        placeholderClass.data = placeholderClass.data.filter(d => characterFilter.charactersToShow.has(d.Speaker));

    if (episodeFilter.ifFilter === true)
        placeholderClass.data = placeholderClass.data.filter(d => episodeFilter.episodesToShow.has(d.Episode));
        
    placeholderClass.hdata = getHeatmapData(placeholderClass.data);

    characterBarChart.data = getBarData(placeholderClass.data);
    arc.data = placeholderClass.data;
    phraseCloud.words = getPhrases(placeholderClass.data);
    wordCloud.words = getWords(placeholderClass.data);


    //lineChart.data = placeholderClass.hdata[0];
    // console.log("lineChartData", getLineChartData(placeholderClass.data));
    lineChart.data = getLineChartData(placeholderClass.data)[0];

    heatMapObj.data = placeholderClass.hdata[0];
    heatMapObj.epList = placeholderClass.hdata[1];
    heatMapObj.characterList = placeholderClass.hdata[2];



    characterBarChart.updateVis();
    phraseCloud.updateVis();
    wordCloud.updateVis();
    lineChart.updateVis();
    heatMapObj.updateVis();
    arc.updateVis();

}
