// @ts-check

// antar at vi skal registrere deltagere på kurs

// Klasse for deltagere
class Deltaker {
    constructor(navn, adresse,epost,tlf) {
        this.navn = navn;
        this.adresse = adresse;
        this.epost = epost;
        this.tlf = tlf;
    }
}

let deltakerListe = [];

function setup() {
    let inpNavn = document.getElementById("navn");
    let inpAdresse = document.getElementById("adresse");
    let inpEpost = document.getElementById("epost");
    let inpTlf = document.getElementById("tlf");
    let alleInputs = Array.from(document.querySelectorAll("#registrer input"));
    let btnLagre = document.getElementById("lagre");

    let frmRegistrer = document.getElementById("registrer");
    frmRegistrer.addEventListener("change", sjekkGyldig);

    function sjekkGyldig(e) {
        // fjerner feilmelding fra alle inputs
        alleInputs.forEach(inp => inp.className="riktig" );
        let navn = inpNavn.value;
        let adresse = inpAdresse.value;
        let epost = inpEpost.value;
        let tlf = inpTlf.value;
        if (navn !== "" && adresse !== "" && epost != "" && tlf !== "") {
            btnLagre.disabled = false;
            btnLagre.addEventListener("click", sendTilLagring);
        } else {
            // alternative metoder
            // alleInputs.forEach(inp => { if (inp.value === "") { inp.classList.add("feil");} });
            // løkka under gjør det samme uten bruk av array-funksjoner
            /*
            for(let inp of alleInputs) {
                if (inp.value === "") { inp.classList.add("feil");} 
            }
            */
            if (navn === "") { inpNavn.className ="feil";}
            if (adresse === "") { inpAdresse.className ="feil";}
            if (epost === "") { inpEpost.className ="feil";}
            if (tlf === "") { inpTlf.className ="feil";}
            // kanskje unødvendig å fjerne event listener, men viser metode ...
            btnLagre.disabled = false;
            btnLagre.removeEventListener("click", lagreDeltaker);
        }

        function sendTilLagring(e) {
           lagreDeltaker(navn,adresse,epost,tlf);
        }
        
    }
}

/**
 * 
 * @param {string} navn Navn på deltaker
 * @param {string} adresse 
 * @param {string} epost 
 * @param {string} tlf 
 */
function lagreDeltaker(navn,adresse,epost,tlf) {
    let deltaker = new Deltaker(navn,adresse,epost,tlf);
    deltakerListe.push(deltaker);
}

