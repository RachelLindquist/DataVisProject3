let data, characters;

d3.csv("data/UtFullmEA.csv").then( _data =>{
    data = _data
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
    lineCount = countLines();
    episodeCount = countEpisodes();
    characterLines = getCharLines();

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
}