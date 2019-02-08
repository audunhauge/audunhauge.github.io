// @ts-check

class Vare {
    constructor({ vareid, varenavn, beholdning, basispris }) {
        this.vareid = vareid;
        this.varenavn = varenavn;
        this.beholdning = beholdning;
        this.basispris = basispris;
    }
}

let butikk = {
    vare:{},
}

// les det som finnes i tabellene
async function lesButikk() {
    let r = await select("select * from vare");
    if (r.results && r.results.length) {
        r.results.forEach(e => {
            let v = new Vare(e);
            butikk.vare[v.vareid] = v;
        })
    }
}
async function setup() {
    let select = document.querySelector("db-select");
    let homebar = document.querySelector('home-bar');
    if (homebar) {
        homebar.setAttribute("menu",
        `<i class="material-icons">menu</i>
        <ul>
          <li>Registrer varer
          <li>Bestillinger
        </ul>
        `)
    }
    select.addEventListener("korg", bestilling);

    function bestilling() {
        alert("Du har kjøpt varer");
        select.style.display = "none";
    }
}