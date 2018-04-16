class Kunde {
    constructor(navn, adresse) {
        this.navn = navn;
        this.adresse = adresse;
    }
}

function setup() {
    let kunde;  // skal lagre data om kunden
    let inpNavn = document.getElementById("navn");
    let inpAdresse = document.getElementById("adresse");

    let inpBukse = document.getElementById("bukse");
    let inpSkjorte = document.getElementById("skjorte");
    let inpSlips = document.getElementById("slips");

    let btnKjop = document.getElementById("kjop");
    btnKjop.addEventListener("click", kjopVarer);

    let divPrisvis = document.getElementById("prisvis");
    let divHalvPris = document.getElementById("halvpris");
    let selHalv = document.getElementById("halv");

    let vistTilbud = false;


    function kjopVarer(e) {
        // lagrer kundedata
        let navn = inpNavn.value;
        let adresse = inpAdresse.value;
        kunde = new Kunde(navn, adresse);

        divPrisvis.innerHTML = "";
        let halv = selHalv.value; // Nei takk,bukse,skjort, ...
        let freebe = 0;
        if (halv !== "Nei takk") {
            freebe = Number(document.getElementById("bukse").dataset.pris) /2;
        }
        let antallBukser = inpBukse.valueAsNumber || 0;
        let antallSlips = inpSlips.valueAsNumber || 0;
        let antallSkjorter = inpSkjorte.valueAsNumber || 0;
        let antall = antallBukser + antallSkjorter + antallSlips;
        if (kunde && kunde.navn !== "" && kunde.adresse !== "" && antall > 0) {
            let pris = antallBukser * inpBukse.dataset.pris
                + antallSkjorter * inpSkjorte.dataset.pris
                + antallSlips * inpSlips.dataset.pris;
            if (pris > 1000 && vistTilbud === false ) {
                // skriv en forklaring på tanker om løsning
                divPrisvis.innerHTML = "";
                divHalvPris.classList.remove("hidden");
                vistTilbud = true;
            } else {
                let tillegg = (freebe) ? `Du har fått en ${halv} til halv pris.`: '';
                divPrisvis.innerHTML = `
                Kjære ${kunde.navn} <br>
                Ordrebekreftelse: Du har bestillt varer for ` 
                + (pris + freebe) + " kr" +
                "<hr>" + `Du har kjøpt: ${antallSlips} slips, ${antallSkjorter} skjorter og
                ${antallBukser} bukser. ` + tillegg
                + `<br>Varene sendes til ${kunde.adresse}`; 
            }
        } else {
            divPrisvis.innerHTML = "Skriv inn navn,adresse og velg minst en vare.";
        }
    }

}