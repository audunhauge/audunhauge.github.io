// @flow

function setup() {
    let selFra = document.getElementById("fra");
    let selTil = document.getElementById("til");
    let inpAntall = document.getElementById("antall");
    let chkLeiebil = document.getElementById("leiebil");
    let btnBestill = document.getElementById("bestill");
    let divMelding = document.getElementById("melding");

    let priser = {
        "OSL": { "SVG": 399, "BGO": 410, "HAU": 180 },
        "SVG": { "BGO": 50, "HAU": 10 },
        "BGO": { "HAU": 5 }
    }

    let leiepris = 1000;

    // $FlowFixMe
    btnBestill.addEventListener("click", bestillFlight);

    function bestillFlight() {
        // $FlowFixMe
        let fra = selFra.value;
        // $FlowFixMe
        let til = selTil.value;
        let pris = 0;

        if (priser[fra] && priser[fra][til]) {
            pris = priser[fra][til];
        } else {
            pris = priser[til][fra];
        }
        // $FlowFixMe
        if (Number.isInteger(inpAntall.valueAsNumber)) {
            // $FlowFixMe
            pris *= inpAntall.valueAsNumber;
        }

        // $FlowFixMe
        if (chkLeiebil.checked) {
            pris += leiepris;
        }

        // $FlowFixMe
        divMelding.innerHTML = `Din flight 
    fra ${fra} 
    til ${til} 
    koster ${pris} kr.`;

    }



}