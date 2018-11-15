// @ts-check

class Hytter {
    constructor(navn, plasser, standard, badstue, prisK) {
        this.navn = navn;
        this.plasser = plasser;
        this.standard = standard;
        this.badstue = badstue;
        this.pris = prisK * 1000;
        this.bilde = navn.toLowerCase() + ".jpg";
    }

    vis() {
        return `${this.navn}
        <br>Pris: ${this.pris} 
        <br>Plasser: ${this.plasser}
        <br>Standard: ${this.standard} 
        <br>Badstu: ${this.badstue} 
         `;
    }
}

const hytter = {};

hytter.stua = new Hytter("Granstua", 4, "Høy", true, 12);
hytter.bo = new Hytter("Granbo", 6, "Middels", false, 15);
hytter.toppen = new Hytter("Grantoppen", 8, "Lav", false, 16);
hytter.haug = new Hytter("Granhaug", 10, "Høy", true, 30);


function setup() {
    let divsInfo = Array.from(document.querySelectorAll(".info"));
    let divMeny = document.getElementById("meny");



    divMeny.addEventListener("click", visInfo);

    function visInfo(e) {
        let t = e.target;
        divsInfo.forEach(div => div.classList.remove("show"));
        if (t.classList.contains("tags")) {
            let id = t.id; // bo eller stua
            let divInf = document.getElementById(id + "info");
            divInf.classList.add("show");
            divInf.addEventListener("click", next);
            let hytte = hytter[id];
            divInf.innerHTML = hytte.vis();

            function next(e) {
                divInf.className = "info show";
                let nr = Number(divInf.dataset.nr) % 2 + 1;
                let strNr = String(nr);
                divInf.dataset.nr = strNr;
                let klass = "nr" + "0".repeat(2 - strNr.length) + strNr;
                divInf.classList.add(klass);
            }
        }
    }
}