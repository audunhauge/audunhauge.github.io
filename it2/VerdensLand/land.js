// @ts-check
class Land {
    constructor(navn, befolkning, hovedstad, bnp, areal, hbef) {
        this.navn = navn;
        this.befolkning = befolkning;
        this.hovedstad = hovedstad;
        this.bnp = bnp;
        this.areal = areal;
        this.hbef = hbef;
    }
}

const landListe = [
    new Land("Norge", 5.3, "Oslo", 2, 300, 0.6),
    new Land("Sverige", 9.3, "Stockholm", 2, 300, 0.6),
    new Land("Danmark", 5.5, "København", 2, 300, 0.6),
    new Land("Finland", 5.2, "Helsinki", 2, 300, 0.6),
    new Land("Island", 0.3, "Reykjavik", 2, 300, 0.6),
];

function setup() {
    let btnTegn = document.getElementById("tegn");
    let selL1 = document.getElementById("land1");
    let selL2 = document.getElementById("land2");
    let selL3 = document.getElementById("land3");
    let selL4 = document.getElementById("land4");
    let divMain = document.getElementById("main");
    let divGrafikk = document.getElementById("grafikk");
    let divOversikt = document.getElementById("oversikt");
    let btnLagre = document.getElementById("lagre");
    let inpNavn = document.getElementById("navn");
    let inpBefolkning = document.getElementById("befolkning");
    // ... flere linjer
    btnLagre.addEventListener("click", lagreData);
    btnTegn.addEventListener("click", visGrafisk);
    visListe();

    function lagreData() {
        let navn = inpNavn.value;
        let befolkning = inpBefolkning.value;
        //  .. flere linjer
        let land = new Land(navn, befolkning);
        landListe.push(land);
        visListe();
    }

    function visGrafisk() {
        let l1 = selL1.value;
        let l2 = selL2.value;
        let l3 = selL3.value;
        let l4 = selL4.value;
        if (l1 === l2 && l3 === l4 && l2 === l3) {
            alert("Velg minst to land");
            return;
        }
        let liste = new Set([l1, l2, l3, l4]);
        divGrafikk.innerHTML = "";

        let max = 0;
        liste.forEach(e => {
            let land = finnLand(e);
            if (land.befolkning > max) max = land.befolkning;
        })
        let sortertListe = Array.from(liste).map(e => finnLand(e)).sort((a,b) => b.befolkning - a.befolkning);
        console.log(sortertListe);
        sortertListe.forEach(e => {
            lagRunning(e,max);
        })

    }

    /**
     * Lager en running som tilsvarer bef. i et valgt land
     * @param {Land} land   Navn på et land som skal finnes i landListe
     * @param {number} max  maksimum bef for valgte land
     */
    function lagRunning(land,max) {
        let radius = Math.sqrt(200*200*(+land.befolkning/max));
        let sirkel = document.createElement("div");
        sirkel.className = "sirkel";
        divGrafikk.appendChild(sirkel);
        sirkel.style.width = sirkel.style.height = radius + "px";

    }

     /**
      * Gitt navnet på et land - finner data om landet
      * @param {string} navn navn på land du søker
      * @returns {Land} gir tilbake en instans av klassen Land
      */
    function finnLand(navn) {
        for (let i = 0; i < landListe.length; i++) {
            let land = landListe[i];
            if (navn === land.navn) {
                return land;
            }
        }
    }

    function visListe() {
        // let s = landListe.map(l => `<option>${l.navn}</option>`).join("");

        let s = "";
        for (let l of landListe) {
            s += `<option>${l.navn}</option>`;
        }
        selL1.innerHTML = selL2.innerHTML = selL3.innerHTML = selL4.innerHTML = s;
    }
}