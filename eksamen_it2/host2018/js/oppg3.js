// @ts-check

function setup() {
    let divMain = document.getElementById("main");
    let divInfo = document.getElementById("info");
    let divmelding = document.getElementById("melding");
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

    function alleOpptatt() {
        let noeLedig = false;
        hytter.forEach((hytte,navn) => {
            noeLedig = noeLedig || hytte.ledig;
            // sann dersom denne hytta har en ledig periode
        })
        if (! noeLedig) {
            divInfo.innerHTML = "Alle hyttene er bestilt!";
        }
        return (! noeLedig);
    }

    function visLedig(e) {
        // sjekker om alle hytter er opptatt
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
            if (antall > 0) {
              divMain.appendChild(selHytte);
            } else {
              // ingen hytter ledig for valgt periode
              divMain.removeChild(selHytte);
            }
            selHytte.addEventListener("change", visHytte);
        }

        function visHytte(e) {
            let hyttenavn = selHytte.value;
            if (hyttenavn !== "") {
                let hytte = hytter.get(hyttenavn);
                divInfo.innerHTML = hytte.vis()
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
                divInfo.innerHTML = `Du har nå reservert ${hyttenavn} for ${periode}.`
                selHytte.innerHTML = "";
                visLedig(null);
            }
        }
    }


}