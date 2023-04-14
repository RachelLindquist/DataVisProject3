let data, characters;

d3.csv("data/UtFullmEA.csv").then( _data =>{
    data = _data
    characters  = [...new Set(data.map(d => d["Speaker"]))];
    console.log(characters)
    data = data.filter(function(d){
        //These are all of the characters that appear throughout multiple episodes
        //We can remove some of the less important people or Narration
        //The series also has different songs that play each episode, 1 (zettai unmei...) is constant
        //The other changes based on who the antagonist of the episode is
        //I left both of them out, but they can be added
        //Main characters: Utena, Saionji, Miki, Juri, Touga, Anthy, Akio (Dios), Nanami
        //Important characters: Shiori, Kozue, Shadow, Ruka, Mikage, Mitsuru, Wakaba
        //Important, but only for 1 or a couple episodes: Mamiya, Tatsuya, Tokiko, Kanae
        //Nanami's lackies, show up often: Keiko, Aiko, Yuuko
        return d["Speaker"].includes("Wakaba") || d["Speaker"].includes("Utena") || d["Speaker"].includes("Shiori")
        || d["Speaker"].includes("Saionji") || d["Speaker"].includes("Miki") || d["Speaker"].includes("Juri") 
        || d["Speaker"].includes("Touga") || d["Speaker"].includes("Anthy") || d["Speaker"].includes("Nanami") 
        || d["Speaker"].includes("Kozue") || d["Speaker"].includes("Keiko")  || d["Speaker"].includes("Aiko") 
        || d["Speaker"].includes("Narration") || d["Speaker"].includes("Shadow")  || d["Speaker"].includes("Yuuko") 
        || d["Speaker"].includes("Kanae") || d["Speaker"].includes("Keiko") || d["Speaker"].includes("Mamiya") 
        || d["Speaker"].includes("Mitsuru") || d["Speaker"].includes("Mikage") || d["Speaker"].includes("Tatsuya") 
        || d["Speaker"].includes("Tokiko") || d["Speaker"].includes("Dios") || d["Speaker"].includes("Ruka") 
        || d["Speaker"].includes("Akio");
    });
    console.log(data)
    characters  = [...new Set(data.map(d => d["Speaker"]))];
    console.log(characters)
    //lineCount = countLines();
    //episodeCount = countEpisodes();
    characterLines = getCharLines();

    let words = new WordCloud({
        'parentElement': '#wordCloud',
        'containerHeight': 500,
        'containerWidth': 500,
    }, getWords(data));

    let phrases = new WordCloud({
        'parentElement': '#phraseCloud',
        'containerHeight': 1000,
        'containerWidth': 1000,
    }, getPhrases(data));

    //I will fix this later to match character's actual colors depending on how many characters we want to display
    const  characterColors= d3.scaleOrdinal()
        .domain(characters)
        .range(d3.quantize(d3.interpolateHcl("#0000ff", "#f0000f"), characters.length));

    

});

function countEpisodes(){
    speakers = d3.group(data, d => d["Speaker"]);
    episode = {}
    speakers.forEach(c => {
        let t = [...new Set(c.map(d => d["Episode"]))].length;
        episode[c[0]["Speaker"]] = t;
    });
    return episode;
}

function countLines(){
    speakers = d3.group(data, d => d["Speaker"])
    line = {}
    speakers.forEach(c => {
        let t = c.length
        line[c[0]["Speaker"]] = t;
    })
    return line;
}

function getCharLines(){
    speakers = d3.group(data, d => d["Speaker"])
    lines = {}
    speakers.forEach(c => {
        let t = (c.map(d => d["Line"]))
        lines[c[0]["Speaker"]] = t;
    })
    console.log(lines);
    return lines;
}

function getWords(){
    let words = [];
    data.forEach(c => {
        let line = c["Line"];
        line = clean(line);
        line.forEach(l => {
            words.push({Speaker: c["Speaker"], Word: l, Episode: c["Episode"], Arc: c["Arc"]});
        });

    });
    console.log(words);
    return words;//.slice(0, 2000);
}

function getPhrases(){
    let phrases = [];
    data.forEach(c => {
        let line = c["Line"];
        //line = cleanLine(line);
        phrases.push({Speaker: c["Speaker"], Word: line, Episode: c["Episode"], Arc: c["Arc"]});
    });
    console.log(phrases);
    return phrases;//.slice(0, 2000);
}


function clean(line){
    //removed puncutation and cleans up the line
    line = line.replace("..."," ");
    line = line.replace(/-/g, " ");
    line = line.replace(/['"]+/g, '');
    line = line.toLowerCase();
    var punctuationless = line.replace(/[.,\/#!$%\^&\*;:{}=\_`~()?]/g,"");
    var cleanedString = punctuationless.replace(/\s{2,}/g," ");
    lineArr = cleanedString.split(" ");

    //remove filler words, pretend I've listed them all 
    let remove = ['i','me','my','myself','we','us','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him',
    'his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which',
    'who','whom','whose','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do',
    'does','did','doing','will','would','should','can','could','ought',"i'm","you're","he's","she's","it's","we're","they're","i've",
    "you've","we've","they've","i'd","you'd","he'd","she'd","we'd","they'd","i'll","you'll","he'll","she'll","we'll","they'll","isn't",
    "aren't","wasn't","weren't","hasn't","haven't","hadn't","doesn't","don't","didn't","won't","wouldn't","shan't","shouldn't","can't",
    "cannot","couldn't","mustn't","let's","that's","who's","what's","here's","there's","when's","where's","why's","how's",'a','an','the',
    'and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during',
    'before','after','above','below','to','from','up','upon','down','in','out','on','off','over','under','again','further','then','once',
    'here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not',
    'only','own','same','so','than','too','very','say','says','said','shall', "oh", 'o', " ", "go", "ya", "ive", "id", "yes", "no",
    "youre", "know", "im", "like", "going", "go", "san", "isnt", "ha", "eh", "dont", "sama", "ill", "huh", "youve"];
    lineArr = lineArr.filter(item => !remove.includes(item));
    lineArr = lineArr.filter(item => item);
    return lineArr;
}