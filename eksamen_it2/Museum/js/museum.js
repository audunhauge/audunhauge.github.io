// @ts-check

// antar at vi skal registrere deltagere på kurs

// Klasse for deltagere
class Deltaker {
    constructor(navn, adresse, epost, tlf, kurs) {
        this.navn = navn;
        this.adresse = adresse;
        this.epost = epost;
        this.tlf = tlf;
        this.kurs = kurs;
    }
}

// dette er en global variable som simulerer lagring
// irl ville dette være en database ...
let deltakerListe = [];


// jeg bruker indre funksjoner i setup
// slik at disse har tilgang til variablene definert
// i toppen (inpNavn ...)
// reduserer også bruken av globale variable (som er en god ting).
function setup() {
    Test.summary();
    let inpNavn = document.getElementById("navn");
    let inpAdresse = document.getElementById("adresse");
    let inpEpost = document.getElementById("epost");
    let inpTlf = document.getElementById("tlf");
    let alleInputs = Array.from(document.querySelectorAll("#registrer input"));
    let btnLagre = document.getElementById("lagre");
    let divDeltakerliste = document.getElementById("deltakerliste");
    let inpKurs = document.getElementById("kursvalg");

    let frmRegistrer = document.getElementById("registrer");

    let navn, adresse, epost, tlf, kurs;


    frmRegistrer.addEventListener("change", sjekkGyldig);
    btnLagre.addEventListener("click", sendTilLagring);

    function sendTilLagring(e) {
        lagreDeltaker(navn, adresse, epost, tlf,kurs);
        divDeltakerliste.innerHTML = "Antall:" + tellOpp(deltakerListe);
        visDeltakerListe(divDeltakerliste);

    }


    function sjekkGyldig(e) {
        // fjerner feilmelding fra alle inputs
        alleInputs.forEach(inp => inp.className = "riktig");
        navn = inpNavn.value;
        adresse = inpAdresse.value;
        epost = inpEpost.value;
        tlf = inpTlf.value;
        kurs = inpKurs.value;
        if (navn !== "" && adresse !== "" && epost != "" && tlf !== "") {
            btnLagre.disabled = false;
        } else {
            // alternative metoder
            // alleInputs.forEach(inp => { if (inp.value === "") { inp.classList.add("feil");} });
            // løkka under gjør det samme uten bruk av array-funksjoner
            /*
            for(let inp of alleInputs) {
                if (inp.value === "") { inp.classList.add("feil");} 
            }
            */
            if (navn === "") { inpNavn.className = "feil"; }
            if (adresse === "") { inpAdresse.className = "feil"; }
            if (epost === "") { inpEpost.className = "feil"; }
            if (tlf === "") { inpTlf.className = "feil"; }
            // kanskje unødvendig å fjerne event listener, men viser metode ...
            btnLagre.disabled = false;
        }

    }
}

// funksjonene under er mest mulig uavhengige av
// andre deler av prosjektet - slik at testing blir enklere

/**
 * 
 * @param {string} navn Navn på deltaker
 * @param {string} adresse 
 * @param {string} epost 
 * @param {string} tlf 
 */
function lagreDeltaker(navn, adresse, epost, tlf, kurs) {
    let deltaker = new Deltaker(navn, adresse, epost, tlf, kurs);
    deltakerListe.push(deltaker);
}


// i visual studio sjekker editoren typene på parametre
// dersom jeg har en jsdoc  kommentar som vist under.
// jeg får da feilmelding dersom jeg sender noe som IKKE er
// et html-element til denne funksjonen

/**
 * Vis liste over alle deltakere
 * @param {HTMLElement} div  ref til div hvor lista skal vises 
 */
function visDeltakerListe(div) {
    let liste = document.createElement("div");
    deltakerListe.forEach(e => {
        let divDeltaker = document.createElement("div");
        divDeltaker.innerHTML = `
      <div>Navn: ${e.navn} </div>
      <div>Adresse: ${e.adresse} </div>
      <div>Epost: ${e.epost} </div>
      <div>Tlf: ${e.tlf} </div>
      <div>Kurs: ${e.kurs} </div>
     `;
        liste.appendChild(divDeltaker);
    });
    div.appendChild(liste);
}

/**
 * Skal telle antall unike tlf i lista
 * @param {Array} deltakerListe 
 */
function tellOpp(deltakerListe) {
    let telefonListe = deltakerListe.map(e => e.tlf);
    let unike = new Set(telefonListe);
    return unike.size;
}

/*
Automatiserte tester av noen funksjoner.
I tillegg til disse testene må jeg ha brukertester,
feiltester (hva skjer dersom input er feil) osv
*/

// tellopp med tom array
expect(tellOpp, []).to.be(0);

// tellopp med duplikate tlf
expect(tellOpp, [{ tlf: 12 }, { tlf: 12 }]).to.be(1);

expect(tellOpp, [{ tlf: 12 }, { tlf: 13 }]).to.be(2);


