// @flow

function setup() {
    let divLand = document.getElementById("land");
    let divBy = document.getElementById("by");
    let divInfo = document.getElementById("info");
    let landListe = [ "norge","sverige","danmark"];
    let byIland = {
        norge: ["haugesund","oslo","bergen","trondheim"],
        sverige: ["stockholm","gøteborg","kalmar","malmø"],
        danmark: [ "aarhus","københavn","odense"]
    }

    let info = {
        haugesund:"fin by på vestlandet",
        oslo:"by i norge",
        bergen:"fin vestlandsby",
        trondheim:"by langt mot nord",
        stockholm:"by i sverige",
        "gøteborg":"fin by på vestkysten av sverige",
        kalmar:"fin by",
        "malmø":"fin atomby",
        aarhus:"fin by med god smak",
        "københavn":"dansk hovedstad",
        odense:"fin by i danmark",
    }

    let selLand = lagKombo(landListe, "land");
    divLand.innerHTML = "";  // fjern gamle ting
    divLand.appendChild(selLand);
    
    selLand.addEventListener("change", lagByVelger);

    function lagByVelger(e) {
        let land = e.target.value;
        let byer = byIland[land];  // kan være udefinert 
        divInfo.innerHTML = "";  // fjern gammel info
        if (byIland[land]) {
           divBy.innerHTML = "";
           let selBy = lagKombo(byer, "by");
           divBy.appendChild(selBy);

           selBy.addEventListener("change", visByInfo);
        }
    }

    function visByInfo(e) {
       let by = e.target.value;
       divInfo.innerHTML = info[by];
    }




}

function lagKombo(liste, type) {
    let sel = document.createElement("select");
    liste.unshift("velg " + type);
    for (let valg of liste) {
        let opt = document.createElement("option");
        opt.innerHTML = valg;
        sel.appendChild(opt);
    }
    return sel;
}
