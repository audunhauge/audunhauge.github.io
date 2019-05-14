// @ts-check

const W = 16;
const H = 16;


/**
 * Lager et brett med gitt bredde x høyde
 * @param {number} width Bredde på brett
 * @param {number} height Høyde
 * @returns {Array} array som representerer brettet
 */
function lagBrett(width, height) {
    const TOTAL = width * height;
    let b = Array(TOTAL).fill(0);
    let antall = 35;
    do {
        let x = Math.trunc(Math.random() * TOTAL);
        if (b[x] === 0) {
            b[x] = 8;
            antall--;
        }
    } while (antall);
    for (let i = 0; i < TOTAL; i++) {
        let n = b[i];
        if (n === 8) continue;
        b[i] = tellOpp(b, i, width);
    }
    return b;
}

/**
 * Henter verdi fra nabo-rute
 * Gir tilbake 0 dersom utenfor brett
 * @param {Array} brett Array over alle bomber
 * @param {number} idx cellenr
 * @param {number} w bredde på brett
 * @param {number} n antall ruter totalt
 * @param {number} dx delta x
 * @param {number} dy delta y
 * @returns {number} 1/0 1 dersom ruta har en 8
 */
const getAround = (brett, idx, w, n, dx, dy) => {
    if (idx < w && dy === -1) return 0;
    if (idx > n - w && dy === 1) return 0;
    if (idx % w === 0 && dx === -1) return 0;
    if ((idx + 1) % w === 0 && dx === 1) return 0;
    return brett[idx + dx + w * dy] === 8 ? 1 : 0;
}

/**
 * 
 * @param {Array<number>} arr Array over bomber, 8=bombe
 * @param {number} idx Ruten vi sjekker
 * @param {number} w Bredde på brett
 * @returns {number} Antall bomber rundt denne ruten
 */
function tellOpp(arr, idx, w) {
    const adjacent = (dx, dy) => getAround(arr, idx, w, arr.length, dx, dy);
    let n = 0;
    n += adjacent(0, 1);
    n += adjacent(0, -1);
    n += adjacent(1, 0);
    n += adjacent(-1, 0);
    n += adjacent(1, 1);
    n += adjacent(1, -1);
    n += adjacent(-1, 1);
    n += adjacent(-1, -1);
    return n;
}

// viser bruk av funksjoner med parameter
// bruker $ som i jquery og andre bib
/**
 * Gitt en id - returner ref til html-element
 * @param {string} id Id på html-element
 * @returns {HTMLElement}
 */
function $(id) {
    return document.getElementById(id);
}

/**
 * Viser brettet på skjermen
 * Gir tilbake array over html-elementer for rutene
 * @param {HTMLElement} div Div hvor brikker vises
 * @param {Array} arr Plassering av miner
 * @returns {Array<HTMLElement>}
 */
function visBrett(div, arr) {
    div.innerHTML = "";
    let r = [];
    for (let i = 0; i < arr.length; i++) {
        let b = arr[i];
        let rute = document.createElement("div");
        rute.className = "rute";
        rute.dataset.idx = String(i);
        rute.dataset.n = String(b);   // antall naboer som 
        // er bomber, n === 8 markerer en bombe
        div.appendChild(rute);
        r.push(rute);
    }
    return r;
}

function setup() {
    const brikker = lagBrett(W, H);
    let divTid = $("tid");
    let divAntall = $("antall");
    let divBrett = $("brett");
    let divSmily = $("smily");
    let ruter = visBrett(divBrett, brikker);
    divBrett.addEventListener("click", sjekkBombe);

    function sjekkBombe(event) {
        let t = event.target;
        if (t.classList.contains("rute")) {
            let idx = Number(t.dataset.idx);
            if (t.classList.contains("rute")) {
                reveal(idx);
                function reveal(idx) {
                    let t = ruter[idx];
                    if (t.classList.contains("visible")) {
                        return;
                    }
                    t.classList.add("visible");
                    if (t.dataset.n !== "0") {
                        return;
                    }
                    if (idx < W || idx > 238 || idx % W === 0 || (idx + 1) % W === 0) {
                        // sadhkh
                    } else {
                        setTimeout(() => reveal(idx - 1), 100);
                        setTimeout(() => reveal(idx + 1), 100);
                        setTimeout(() => reveal(idx - 16), 100);
                        setTimeout(() => reveal(idx + 16), 300);
                    }
                }
            }
        }
    }
}