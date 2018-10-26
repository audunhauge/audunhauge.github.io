// @ts-check
let autokeys = {
    bokID: 0,
    forfatterID: 0,
    forlagID: 0,
    eksemplarID: 0,
    utlaanID: 0,
}

class Bok {
    constructor({ bokid=1, isbn, tittel, sjanger, utgitt=1, forfatterid=1, forlagid=1, sider }) {
        this.bokid = bokid;
        this.isbn = isbn;
        this.tittel = tittel;
        this.sjanger = sjanger;
        this.sider = sider;
        this.utgitt = utgitt;
        this.forfatterid = forfatterid;
        this.forlagid = forlagid;
    }
}

class Forfatter {
    constructor({ forfatterid=1,  navn, }) {
        this.forfatterid = forfatterid;
        this.navn = navn;
    }
}

let bib = {
    bok: {},
    forfatter: {},
    forlag: {},
    eksemplar: {},
    utlaan: {},
}

// les det som finnes i tabellene
async function lesBibliotek() {
    let r = await select("select * from bok");
    if (r.results && r.results.length) {
        r.results.forEach(e => {
            let b = new Bok(e);
            bib.bok[b.bokid] = b;
        })
    }
    r = await select("select * from forfatter");
    if (r.results && r.results.length) {
        r.results.forEach(e => {
            let b = new Forfatter(e);
            bib.forfatter[b.forfatterid] = b;
        })
    }
}

async function forfatter() {
    let divAntall = document.getElementById("antall");
    let inpForfatterID = document.getElementById("forfatterid");
    let inpNavn = document.getElementById("navn");
    let btnLagre = document.getElementById("lagre");
    btnLagre.addEventListener("click", lagreData);
    await lesBibliotek().catch(e => console.log(e));
    divAntall.innerHTML = String(Object.keys(bib.forfatter).length);

    function lagreData() {
        let forfatterid = inpForfatterID.value;
        let navn = inpNavn.value;

        inpForfatterID.value = String(+forfatterid+1);
        inpNavn.value = "";

        let forfatterData = new Forfatter({forfatterid, navn});
        let key = forfatterData.forfatterid;
        bib.forfatter[key] = forfatterData;
        divAntall.innerHTML = String(Object.keys(bib.bok).length);
        upsert('insert into forfatter (forfatterid,navn)'+ 
        'values ( $[forfatterid],$[navn])', forfatterData);      
    }
}



async function setup() {
    let divAntall = document.getElementById("antall");
    let inpISBN = document.getElementById("isbn");
    let inpBOKID = document.getElementById("bokid");
    let inpTittel = document.getElementById("tittel");
    let inpForfatter = document.getElementById("forfatter");
    let inpSjanger = document.getElementById("sjanger");
    let inpSider = document.getElementById("sider");
    let btnLagre = document.getElementById("lagre");
    btnLagre.addEventListener("click", lagreData);
    await lesBibliotek().catch(e => console.log(e));
    divAntall.innerHTML = String(Object.keys(bib.bok).length);

    function lagreData() {
        let bokid = inpBOKID.value;
        let isbn = inpISBN.value;
        let tittel = inpTittel.value;
        let sjanger = inpSjanger.value;
        let sider = inpSider.value;

        inpBOKID.value = String(+bokid+1);
        inpISBN.value = "";
        inpTittel.value = "";
        inpForfatter.value = "";
        inpSjanger.value = "";
        inpSider.value = "";

        let bokData = new Bok({bokid,isbn, tittel, sjanger, sider});
        let key = bokData.bokid;
        bib.bok[key] = bokData;
        divAntall.innerHTML = String(Object.keys(bib.bok).length);
        upsert('insert into bok (bokid,tittel,isbn,forfatterid,forlagid,sider,sjanger,utgitt)'+ 
        'values ( $[bokid],$[tittel],$[isbn],$[forfatterid],$[forlagid],1,$[sjanger],1)', bokData);

        
    }
}

async function bokliste() {
    let divMain = document.getElementById("main");
    let inpSjanger = document.getElementById("sjanger");

    inpSjanger.addEventListener("change", oppdaterListe);
    await lesBibliotek().catch(e => console.log(e));
    oppdaterListe();

    function oppdaterListe() {
        let s = ""; let books;
        let sjanger = inpSjanger.value || "historie";
        if (sjanger === "alle") {
            books = filtrer(bib.bok, "sjanger", (e, v) => true);
        } else {
            books = filtrer(bib.bok, "sjanger", sjanger);
        }
        books.forEach(
            book => {
                let klasse = book.sjanger;
                s += `<div class="${klasse}"><h4>` + book.tittel + "</h4><div>";
                s += `<label>Forfatter</label><label>${book.forfatter}</label>`;
                s += `<label>ISBN</label><label>${book.isbn}</label>`;
                s += `<label>Utgitt</label><label>${book.utgiv}</label>`;
                s += `<label>Sjanger</label><label>${book.sjanger}</label>`;
                s += "</div></div>";
            }
        );
        divMain.innerHTML = s;
    }
}



function filtrer(liste, egenskap, test) {
    if (!Array.isArray(liste)) {
        // try to make an array
        try {
            liste = Object.keys(liste).map(k => liste[k]);
        } catch (e) {
            liste = [];
        }
    }
    if (typeof test === "function") {
        return liste.filter(e => test(e, egenskap));
    }
    return liste.filter(e => e[egenskap].trim() === test);
}

function upsert(sql="", data) {
    let init = {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ sql,data }),
        headers: {
            "Content-Type": "application/json"
        }
    };
    fetch("runsql", init);
} 


async function select(sql = "select * from bok") {
    let init = {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ sql }),
        headers: {
            "Content-Type": "application/json"
        }
    };
    const response = await fetch("runsql", init);
    let res = await response.json();
    return res;
}
