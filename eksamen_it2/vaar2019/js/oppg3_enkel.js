// @ts-check

const avstander = {
    gjendesheim: { glitterheim: 22, memurubu: 14 },
    glitterheim: { gjendesheim: 22, memurubu: 18 , spitertstulen:17},
    memurubu: { gjendesheim: 14, glitterheim: 18,gjendebu:10 },
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

    function startTuren() {
        if (selStart.value === '..velg..') {
            return;
        }
        tur = [selStart.value];
        divNeste.classList.remove("hidden");
        visNesteHytte(selStart.value);
        selNeste.addEventListener("change", leggTilHytte);
    }

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
        const hytte = selNeste.value;
        tur.push(hytte);
        divValg.innerHTML = "Din tur: " + tur.join();
        visNesteHytte(hytte);
    }
}