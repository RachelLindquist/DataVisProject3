let data;

d3.csv("data/UtFullmEA.csv").then( _data =>{
    data = _data
    data = data.filter(function(d){
        return d["Speaker"].includes("Wakaba") || d["Speaker"].includes("Utena") || d["Speaker"].includes("Shiori")
        || d["Speaker"].includes("Saionji") || d["Speaker"].includes("Miki") || d["Speaker"].includes("Juri") || d["Speaker"].includes("Touga")
        || d["Speaker"].includes("Anthy") || d["Speaker"].includes("Anthy") || d["Speaker"].includes("Nanami") || d["Speaker"].includes("Kozue") 
        || d["Speaker"].includes("Keiko") || d["Speaker"].includes("Aiko") || d["Speaker"].includes("Narration") || d["Speaker"].includes("Shadow")
        || d["Speaker"].includes("Yuuko") || d["Speaker"].includes("Kanae") || d["Speaker"].includes("Keiko") || d["Speaker"].includes("Mamiya")
        || d["Speaker"].includes("Tsuwabuki") || d["Speaker"].includes("Mikage") || d["Speaker"].includes("Tatsuya") || d["Speaker"].includes("Tokiko")
        || d["Speaker"].includes("Dios") || d["Speaker"].includes("Ruka") || d["Speaker"].includes("Akio");
    });
    console.log(data)
    let characters  = [...new Set(data.map(d => d["Speaker"]))];
    console.log(characters)

})