// @ts-check

/**
 *  Lager koblinger til alle input i skjema
 *  Ved klikk på lagre knappen skal vi kjøre funksjonen lagreData
 */
function setup() {
    // koblinger til html - vi har gitt alle input i html en id="xxx"
    let inpNavn = document.getElementById("navn");
    let inpAdresse = document.getElementById("adresse");
    let inpEpost = document.getElementById("epost");
    let inpMobil = document.getElementById("mobil");
    let btnLagre = document.getElementById("lagre");

    btnLagre.addEventListener("click", lagreData);
    // ved klikk på knappen Lagre skal vi kjøre funksjonen lagreData


    function lagreData() {
        // hent verdiene som er skrevet i input feltene
        let navn = inpNavn.value;
        let adresse = inpAdresse.value;
        let epost = inpEpost.value;
        let mobil = inpMobil.value;

        // lag en pakke med all info
        let info = {navn,adresse,epost,mobil};
        // lagre pakken i localStorage
        localStorage.setItem(navn,JSON.stringify(info));
    }

}

// merk at du kan åpne console (cmd-clikk på websida - inspiser/inspect)
// velg console-vinduet
// skriv localStorage (og trykk enter)
// du kan fjerne alle data fra localStorage ved å skrive:
// localStorage.clear()