// @ts-check
function setup() {

    let divText = document.getElementById("text");
    let divAlternativer = document.getElementById("alternativ");
    let divKontroll = document.getElementById("kontroll");

    let spraak = [];

    let amerikansk = [];
    // her er det enkelt å legge til flere språk senere

    spraak.push(amerikansk);

    // legger til sprsml til amerikansk
    // her bør vi egentlig lese sprsml fra filen, men
    // det rekker jeg ikke nå
    /*
     let url = "sporsmaal.json";
     fetch(url).then(r => r.json())
     .then(data => behandle(data))
     .catch(e => console.log("Dette virka ikke."))
    */
    amerikansk.push("Hva er potet på amerikansk:potet,+potato,pomefrit");
    amerikansk.push("Hva er ost på amerikansk:chz,+cheese,gauda");
    amerikansk.push("Hva er fisk på amerikansk:chz,+fish,gauda");

    let riktigsvar = "";
    let total = 0;
    let index = 0;
    let valgtSpraak = spraak[0];
    // dette er en forenkla løsning da vi bare har amerikansk
    // senere bør dette endres slik at bruker kan velge språk

    function visNeste() {
        visSporsmaal(index);
    }

    function vurder() {
        let valgte = Array.from(document.querySelectorAll("input:checked"));
        let riktig = 0;
        let feil = 0;
        for (let valg of valgte) {
            // @ts-ignore
            if (valg.value === riktigsvar) {
                riktig++;
            } else {
                feil++;
            }
        }
        total += riktig - feil;
        if (valgtSpraak.length > index + 1) {
           index++;
           visNeste();
        } else {
            visResultat();
        }

    }

    function visResultat() {
        let melding = "";
        if (total < 0) {
          melding = "ikke noe håp";
        } 
        if (total === 3) {
            melding = "alt rett";
        }
        if ( total >= 0 && total < 3) {
            melding = "ta deg en tur til new york";
        }
        document.getElementById("main").innerHTML = melding;
    }

    function visSporsmaal(index) {
        let sprmsl = valgtSpraak[index];
        // bruker nye funksjoner fra es7, destructuring assignment
        let [ledetekst, resten] = sprmsl.split(":");
        let alternativer = resten.split(",");
        divText.innerHTML = ledetekst;

        let liste = '';
        for (let valg of alternativer) {
            if (valg.charAt(0) === "+") {
                valg = valg.substr(1);
                riktigsvar = valg;
            }
            liste += `<br><input value="${valg}" type="checkbox">` + valg;
        }
        liste += '<div><button id="vurder" type="button">Vurder</button></div>';

        divAlternativer.innerHTML = liste;
        document.getElementById("vurder").addEventListener("click", vurder);
    }

    visNeste();



}