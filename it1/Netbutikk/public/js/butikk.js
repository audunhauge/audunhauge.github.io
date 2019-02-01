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
    await lesButikk().catch(e => console.log(e));
}
async function vareliste() {
    let divMain = document.getElementById("main");
    await lesButikk().catch(e => console.log(e));
    oppdaterListe();

    function oppdaterListe() {
        let s = ""; 
        let varer = butikk.vare;
        varer.forEach(
            vare => {
               s += `<br>${vare.varenavn} ${vare.basispris} ${vare.beholdning}`
            }
        );
        divMain.innerHTML = s;
    }
}

async function select(sql = "select * from vare") {
    let init = {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ sql }),
        headers: {
            "Content-Type": "application/json"
        }
    };
    const response = await fetch("/runsql", init);
    let res = await response.json();
    return res;
}


