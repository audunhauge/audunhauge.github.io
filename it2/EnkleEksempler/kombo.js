// @ts-check

// norge:oslo,bergen,tromsø
// danmark:kjøbenhavn,odense
// finland:helsinki,rovanjemi

// oslo:3000
// bergen:5000
// tromsø:10000
// kjøbenhavn:500
// odense:2000
// helsinki:8000
// rovanjemi:16000

let byliste = [
    "oslo,bergen,tromsø",
    "kjøbenhavn,odense",
    "helsinki,rovanjemi"
]

let endringer;

function setup() {
    let selLand = document.getElementById("land");
    let selBy = document.getElementById("by");
    let divResultat = document.getElementById("resultat");

    selLand.addEventListener("change", valgtLand);

    selBy.addEventListener("change", valgtBy);

    let landNr;

    function valgtLand() {
        landNr = selLand.value;
        if (landNr >= 0 && landNr < byliste.length) {
            let byTekst = byliste[landNr];
            let byene = byTekst.split(",");
            let s = "";
            for (let by of byene) {
                s += "<option>" + by + "</option>";
            }
            selBy.innerHTML = s;
        }

    }

    function valgtBy() {
        let byNavn = "Norge,Danmark,Finland".split(",");
        let by = selBy.value;
        let land = byNavn[landNr];
        divResultat.innerHTML = `Du reiser til ${land} 
        og besøker byen ${by}.
        Prisen på din reise blir ${pris}`;
    }

    endringer = valgtBy;
}