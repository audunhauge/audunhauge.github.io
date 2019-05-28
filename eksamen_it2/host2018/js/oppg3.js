// @ts-check


/**
 * Data om reserverte hytter kan lagres i localstorage slik at en kan besøke
 * sida flere ganger og få simulert at bestilling er lagra.
 * Dette kan fungere for en demo/prototyp som vises kunden for å få tilbakemelding på
 * design og funksjonalitet.
 * Senere ville vi da flytte lagring til database på server ...
 */


 /**
   En del av valgene jeg tar her er styrt av formuleringene:
    "lager enkle multimediale
       brukergrensesnitt uten bruk av
       programmert kode " (lavt nivå)
    "bruker programmeringsspråk i
        utvikling av multimedieapplikasjoner " (høyt nivå)
   Jeg bruker da kode under til å lage html-elementer som like enkelt
   kan lages i editor, spesielt i vs-code med støtte for emmet
   eks  "select>option*3"  lager en select med tre options

   Den selecten som må endre innhold etter valgt periode må selvsagt lages med kode
   Den første kunne med fordel lages i html (ulempe: dersom flere perioder legges til)
  */

function setup() {
    let divMain = document.getElementById("main");
    let divInfo = document.getElementById("info");
    let divMelding = document.getElementById("melding");
    let divFeil = document.getElementById("feil");
    let selPeriode = document.createElement("select");
    let selHytte = document.createElement("select");
    {   // lager innhold i select
        let opt = document.createElement("option");
        opt.innerHTML = "..velg periode.."
        opt.value = "";
        selPeriode.appendChild(opt);
        for (let k of "Jul,Vinterferie,Påske".split(",")) {
            let opt = document.createElement("option");
            opt.innerHTML = k;
            selPeriode.appendChild(opt);
        }
        divMain.appendChild(selPeriode);
    }
    
    selPeriode.addEventListener("change", visLedig);

    
    selHytte.classList.add("hidden");
    divMain.appendChild(selHytte);

    function alleOpptatt() {
        let noeLedig = false;
        hytter.forEach((hytte,navn) => {
            noeLedig = noeLedig || hytte.ledig;
            // sann dersom denne hytta har en ledig periode
        })
        if (! noeLedig) {
            divFeil.innerHTML = "Alle hyttene er bestilt!";
        }
        return (! noeLedig);
    }

    function visLedig(e) {
        // sjekker om alle hytter er opptatt
        if (e) {
            // on change event
            divInfo.innerHTML = divMelding.innerHTML = divFeil.innerHTML = "";
        }
        if (alleOpptatt() ) return;   
        let periode = selPeriode.value;
        if (periode !== "") {
            // gyldig periode
            // fjerner innhold fra select
            let antall = 0;   // antall ledige hytter denne perioden
            selHytte.innerHTML = "";
            {
                let opt = document.createElement("option");
                opt.innerHTML = "..velg hytte.."
                opt.value = "";
                selHytte.appendChild(opt);
                hytter.forEach((hytte, navn) => {
                    let p = Perioder.get(periode);
                    if (hytte.erledig(p)) {
                        let opt = document.createElement("option");
                        opt.innerHTML = navn;
                        selHytte.appendChild(opt);
                        antall ++;
                    }
                });

            }
            if (antall > 1) {
              selHytte.classList.remove("hidden");
            } else if (antall === 1) {
                selHytte.classList.add("hidden");
                selHytte.selectedIndex = 1;
                visHytte();
            } else {
              // ingen hytter ledig for valgt periode
              selHytte.classList.add("hidden");
              divFeil.innerHTML = "(Ingen flere hytter ledige for valgt periode)";
            }
            selHytte.addEventListener("change", visHytte);
        }

        function visHytte(e) {
            let hyttenavn = selHytte.value;
            if (hyttenavn !== "") {
                let hytte = hytter.get(hyttenavn);
                divInfo.innerHTML = '<h4>Ledig Hytte</h4>'
                + hytte.vis(true)  // true slik at vi får bilde
                + `<p><button data-navn="${hyttenavn}" id="bestill">Bestill</button>`;

                document.getElementById("bestill").addEventListener("click", bestill);

            }
        }

        function bestill(e) {
            let hyttenavn = e.target.dataset.navn;
            if (hyttenavn && hytter.has(hyttenavn)) {
                let hytte = hytter.get(hyttenavn);
                let periodeID = Perioder.get(periode);
                hytte.reserver(periodeID);  
                // periode er tilgjengelig da den er definert
                // i den yttre funksjonen visLedig
                // Det er litt urimelig at en bruker skal
                // reservere flere hytter i samme app-vindu
                // men for å vise at hyttene er reservert
                // velger jeg denne løsningen
                divInfo.innerHTML = "";
                divMelding.innerHTML = `Du har nå reservert ${hyttenavn} for ${periode}.`
                selHytte.innerHTML = "";
                visLedig(null);
            }
        }
    }


}