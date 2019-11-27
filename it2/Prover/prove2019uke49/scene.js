// @ts-check
class Medlem {
    div; navn; kjonn; hoyde; x; y;
    constructor({ div, navn, kjonn, hoyde, x, y }) {
        Object.assign(this, { div, navn, kjonn, hoyde, x, y });
    }
    render() {
        this.div.innerHTML = this.navn;
        // oppg. 3
        this.div.title = `${this.kjonn} ${this.hoyde}`;
        this.div.style.transform =
            `translate(${this.x}px,${this.y}px)`;
    }
}

// oppg. 4
// skal kunne flytte på valgt
class Keys {
    static keys = new Set();
    static za = document.addEventListener("keydown", Keys.mark)
    static zb = document.addEventListener("keyup", Keys.unmark);
    static mark(e) { Keys.keys.add(e.key); }
    static unmark(e) { Keys.keys.delete(e.key); }
    static any() { return Keys.keys.size > 0; }
    static many() { return Keys.keys.size > 1; }
    static has(a) { return Keys.keys.has(a); }
}

const g = (id) => document.getElementById(id);
// @ts-ignore  id assumed to be for input-element
const get = (id) => g(id).value;

let medlemsListe = [];

// oppg. 7
const farger = "red,green,blue,yellow,pink,teal,ochre,pink".split(",");

function setup() {
    let divMain = g("main");
    let btnLagre = g("lagre");
    let btnTegn = g("tegn");
    let btnFordel = g("fordel");
    btnLagre.addEventListener("click", lagre);
    btnTegn.addEventListener("click", tegn);
    btnFordel.addEventListener("click",fordel);

    // oppg. 8 fordel utover
    function fordel() {
        let antall = medlemsListe.length;
        if (antall > 2) {
            // kan ikke fordele ellers
            // antar bredde = 10*16 ~ 180px pr medlemm
            // antar høyde ~ 20px
            let total = Math.floor(800 / 180) * Math.floor(600 / 20);
            if (antall > total) {
                alert("for mange");
                return;
            }
            // fordeler med 4 i bredden.
            let rader = Math.floor(antall / 4);
            let radrom = 600 / rader;
            
        }
    }

    // oppg. 6  -- kopi fra MacInfo
    if (localStorage.getItem("scenografi")) {
        let raw = JSON.parse(localStorage.getItem("scenografi"));
        medlemsListe = raw.map(e => new Medlem(e));

        // denne siste biten må til for å få det til å virke
        // men du kan få 1.9 av 2 for biten over + biten i lagre()
        for (let m of medlemsListe) {
            let div = document.createElement("div");
            div.className = "person";
            m.div = div;
            // div som lagra i localStorage er bare {}
            // må derfor lage nye diver for alle
        }
    }

    // oppg. 5
    let btnSlett = g("slett");
    btnSlett.addEventListener("click", slettSiste);
    function slettSiste() {
        if (medlemsListe.length > 0) {
            medlemsListe.pop();
            tegn();
        }
    }

    // oppg. 4
    let flytting = null;  // ingen flytter seg nå
    let reisende = null;  // personen som flyttes

    // oppg. 4
    // klart den vanskeligste oppgaven
    // bruker metode fra maur.js
    divMain.addEventListener("click", moveme);
    function moveme(e) {
        let t = e.target;
        if (t.classList.contains("person")) {
            // en person ble klikket på
            if (t.classList.contains("flyttmeg")) {
                // holder på med flytting - slutt med det
                t.classList.remove("flyttmeg");
                if (flytting) clearInterval(flytting);
                // slår av intervallet
                flytting = null;
                reisende = null;
            } else if (flytting === null) {
                // ingen flytting aktiv - setter interval
                let idx = Number(t.dataset.idx);
                reisende = medlemsListe[idx];  // personen som skal flyttes
                t.classList.add("flyttmeg");
                flytting = setInterval(flytt, 20);
            }
        }
    }

    // oppg. 4
    function flytt() {
        if (Keys.has("ArrowLeft")) {
            reisende.x -= 2;
            reisende.render();
        }
        if (Keys.has("ArrowRight")) {
            reisende.x += 2;
            reisende.render();
        }
        // tilsvarende løsning for opp/ned
    }

    function tegn() {
        divMain.classList.remove("hidden");
        divMain.innerHTML = "";
        for (let m of medlemsListe) {
            divMain.appendChild(m.div);
            m.render();
        }
    }


    function lagre() {

        let navn = get("navn");
        let kjonn = get("kjonn") || "M";
        let hoyde = Number(get("hoyde")) || 160;
        let x = Number(get("x")) || 0;
        let y = Number(get("y")) || 0;
        if (navn === "") return;
        // ikke registrer folk uten navn
        let div = document.createElement("div");
        div.className = "person";
        // divMain.appendChild(div);
        let m = new Medlem({ div, navn, kjonn, hoyde, x, y });
        medlemsListe.push(m);
        m.render();

        // oppg. 4 trenger å kunne finne personen
        // kobla til valgt div
        div.dataset.idx = String(medlemsListe.length - 1);

        // oppg. 7 setter farge fra liste
        let idx = (medlemsListe.length) % farger.length;
        div.style.backgroundColor = farger[idx];

        // oppg. 6
        localStorage.setItem("scenografi", JSON.stringify(medlemsListe));

    }
}