// @ts-check

// alle hytter har et bilde med navn.jpg
// de har også galleri med navn01.jpg .. navnNN.jpg
// siden dette ikke er på en server må vi lagre
// antall bilder for hver hytte (default = 2)
// dvs alle hytter må ha minst to galleribilder

class Hytter {
    constructor(navn, plasser, standard, badstue, prisK, antall = 2) {
        this.navn = navn;
        this.plasser = plasser;
        this.standard = standard;
        this.badstue = badstue;
        this.pris = prisK * 1000;
        this.bilde = navn.toLowerCase() + ".jpg";
        this.antallBilder = antall;
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
                // ved klikk på bakgrunn vises neste bilde
                // går i sirkel
                const ANTALL = 2;  // antall bilder
                divInf.className = "info show";
                let nr = Number(divInf.dataset.nr) % ANTALL + 1;
                let strNr = String(nr);
                divInf.dataset.nr = strNr;
                let klass = "nr" + "0".repeat(ANTALL - strNr.length) + strNr;
                divInf.classList.add(klass);
            }
        }
    }
}