// @ts-check

/**
 * "gjøre rede for hensikten med objektorientert 
 * utvikling og begrepene klasse, objekt og arv"
 * Viser litt kompetanse på dette målet
 */

class Hotell {
    constructor(navn, kortnavn, sommerpris, vinterpris) {
        this.navn = navn;
        this.kortnavn = kortnavn;
        this.s = sommerpris;
        this.v = vinterpris;
    }
}

let vispris;
/**
 * Lager en Map over hotell og priser
 * En Map er en variant av Array/Object men med bedre egenskaper
 * Kan slå opp på hotellnavn og sesong og finne prisen
 * "programmere med enkle og indekserte variabler eller andre kolleksjoner av variabler"
 */
let hotellPris = new Map();
hotellPris.set("aurora",new Hotell("Aurora","aurora",590,690));
hotellPris.set("downtown",new Hotell("Downtown","downtown",660,750));
hotellPris.set("cityhall",new Hotell("City Hall","cityhall",450,530));



function setup() {
    let pris,hotell;
    let selBy = document.getElementById("by");
    let divBekreftelse = document.getElementById("bekreftelse");
    let divMain = document.getElementById("main");
    let btnLagre = document.getElementById("lagre");
    let formSkjema = document.getElementById("skjema");
    let selPeriode =  document.getElementById("periode");
    let selDobbelt =  document.getElementById("dobbelt");
    let selEnkelt =  document.getElementById("enkelt");
    let selHotell =  document.getElementById("hotell");
    let chkKultur =  document.getElementById("kultur");
    let spanPris =   document.getElementById("pris");

    selBy.addEventListener("change", visValgtBy);
    btnLagre.addEventListener("click", bekreftelse);

    function bekreftelse() {
        divMain.classList.add("skjult");
        divBekreftelse.innerHTML = `Din bestilling er nå lagret. 
        <p>
        Du skal betale ${pris} kr for overnatting på ${hotell}.
        </p>
        `;
    }

    function visValgtBy() {
        formSkjema.classList.remove("valgt");
        let by = selBy.value;
        if (by === "") return;
        // ingen by valgt - hopp ut
        if (by === "newyork") {
            // bare løsning for New York
            formSkjema.classList.add("valgt");
            // Bruker Map hotellpris til å lage options
            // for hotellvelgeren - nå er det en fordel at
            // jeg har laga klassen Hotell
            let s = "";
            hotellPris.forEach(hotell => {
                s += `<option value="${hotell.kortnavn}">${hotell.navn}</option>`;
            });
            /**
             * NB merk at foreach er en innebygget FOR-løkke som er definert for Map
             * Jeg kunne laga denne slik:
             * for (let hotell of hotellPris) { }
             */
            selHotell.innerHTML = s;
        }
    }

    vispris = function () {
        let periode = selPeriode.value;
        let enkelt = selEnkelt.value;
        let dobbelt = selDobbelt.value;
        hotell = selHotell.value;
        let kultur = chkKultur.checked;
        pris = kultur ? 700 : 0;
        let rompris = hotellPris.get(hotell);
        let sesongpris = rompris[periode];
        /**
         * Her hadde jeg feil ledetekst på enkelt/dobbeltrom
         * Fant feilen med breakpoint på linja under
         * "teste og finne feil i programmer ved å bruke vanlige teknikker"
         */
        pris += sesongpris * dobbelt + (sesongpris + 300) * enkelt;
        spanPris.innerHTML = pris.toFixed(2);
    }
}