// @ts-check

/**
 * Jeg velger å lage object med object fordi det blir
 * veldig lett å slå opp med navn på to hytter
 * - i en array må jeg slå opp med indeks (0..6) og
 * koden blir ikke så lettlest
 * Kunne laga const GJENDESHEIM=0, osv, men virker unødvendig
 */
const avstander = {
    gjendesheim: { glitterheim: 22, memurubu: 14 },
    glitterheim: { gjendesheim: 22, memurubu: 18, spitertstulen: 17 },
    memurubu: { gjendesheim: 14, glitterheim: 18, gjendebu: 10 },
    gjendebu: { memurubu: 10, leirvassbu: 19, spitertstulen: 24, olavsbu: 16 },
    leirvassbu: { gjendebu: 19, spitertstulen: 15, olavsbu: 11 },
    spitertstulen: { glitterheim: 17, gjendebu: 24, leirvassbu: 15 },
    olavsbu: { gjendebu: 16, leirvassbu: 11 },
}
// avstander["gjendebu"]["memurubu"] === 10

let tur = [];  // skal lagre navn på hytter som utgjør turen

function setup() {
    const divOppsummering = document.getElementById("oppsummering");
    const selStart = document.getElementById("start");
    const divNeste = document.getElementById("divneste");
    const selNeste = document.getElementById("neste");
    const btnAvslutt = document.getElementById("avslutt");
    const btnAngre = document.getElementById("angre");
    const divValg = document.getElementById("valg");
    const hytter = Object.keys(avstander);
    {
        let s = "<option>..velg..</option>";
        for (let hytte of hytter) {
            s += `<option>${hytte}</option>`;
        }
        selStart.innerHTML = s;
    }
    selStart.addEventListener("change", startTuren);
    btnAvslutt.addEventListener("click", oppsummering);
    btnAngre.addEventListener("click", angre);

    function angre() {
        // her skal jeg ta tur.pop() og
        // fikse divValg og selNeste (må oppdateres)
        // TODO kan avslutte med bare en hytte, men lar den ligge
        if (tur.length > 1) {
            tur.pop();
            const siste = tur[tur.length - 1];
            divValg.innerHTML = "Din tur: " + tur.join();
            visNesteHytte(siste);
        }
    }

    function oppsummering() {
        let forrige = null;
        let avstand = 0;
        let oppsummering = '';
        for (let hytte of tur) {
            if (forrige !== null) {
                // TODO bør sjekke at verdien finnes
                const lengde = avstander[forrige][hytte];
                avstand += lengde;
                oppsummering += `Fra ${forrige} til ${hytte} er ${lengde} km <br>`;
            }
            forrige = hytte;
        }
        oppsummering += `Hele turen er på ${avstand}km.`;
        divOppsummering.innerHTML = oppsummering;
    }

    function startTuren() {
        if (selStart.value === '..velg..') {
            return;
        }
        tur = [selStart.value];
        divNeste.classList.remove("hidden");
        visNesteHytte(selStart.value);
        selNeste.addEventListener("change", leggTilHytte);
    }


    /**
     * Oppdaterer select elementet for valg av neste hytte
     * @param {string} hytte 
     */
    function visNesteHytte(hytte) {
        const hytter = Object.keys(avstander[hytte]);
        {
            let s = "<option>..velg..</option>";
            for (let hytte of hytter) {
                s += `<option>${hytte}</option>`;
            }
            selNeste.innerHTML = s;
        }
    }

    function leggTilHytte() {
        if (selStart.value === '..velg..') {
            return;
        }
        btnAvslutt.classList.remove("hidden");
        btnAngre.classList.remove("hidden");
        const hytte = selNeste.value;
        tur.push(hytte);
        divValg.innerHTML = "Din tur: " + tur.join();
        visNesteHytte(hytte);
    }
}