// @ts-check


// denne gir en alert dersom du skriver navn på id feil
const g = id => {
    let elm = document.getElementById(id);
    if (elm == null || elm == undefined) {
        alert(`Stavefeil? finner ikke ${id}`)
    }
}

// bruk denne for å hente value fra en inpNavn osv
// slipper rød strek under .value
const get = element => element.value;

const trening = {
    armer: ["Biceps", "Fransk"],
    skuldre: ["Stående", "Sidehev"],
    ben: ["Knebøy", "legex", "legcurl"],
    rygg: ["Nedtrekk", "Roing"],
    bryst: ["Benk", "flies", "Pushup"],
}


// en funksjon som lager en nedtrekksliste
/**
 * @param {Object}  tabell      Inneholder verdier som skal brukes i nedtrekk
 * @param {string} valgtNokkel  Nøkkel fra første nedtrekk 
 *                              - fyller ut den andre med verdier fra tabell
 * @returns {string}            Innhold til en select, 
 *                              bruk sel.innerHTML = lagNedTrekk(..)
 */

function lagNedtrekk(valgtNokkel, tabell) {
    let s = '';
    if (tabell[valgtNokkel]) {
        let verdier = tabell[valgtNokkel];
        for (let v of verdier) {
            s += `<option>${v}</option>`;
        }
    }
    return s;
}



function setup() {
    let selGruppe = document.getElementById("selgruppe");
    let selOvelse = document.getElementById("selovelse");
    let divValg = document.getElementById("valgene");
    selGruppe.addEventListener("change", oppdaterOvelse);
    selOvelse.addEventListener("change", visValgte);

    let gruppe, ovelse;


    function oppdaterOvelse() {
        gruppe = get(selGruppe);
        if (gruppe !== "") {
            selOvelse.innerHTML = '<option>Velg</option>' + lagNedtrekk(gruppe, trening);
        }
    }
    function visValgte() {
        ovelse = get(selOvelse);
        if (ovelse !== "Velg") {
            // noe er valgt
            divValg.innerHTML = `Du har valgt muskelgruppe ${gruppe} og øvelsen ${ovelse}`;
        }
    }
}