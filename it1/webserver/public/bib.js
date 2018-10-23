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

let bib = {
    bok: {},
    forfatter: {},
    forlag: {},
    eksemplar: {},
    utlaan: {},
}

async function lesBibliotek() {
    let r = await select("select * from bok");
    if (r.results && r.results.length) {
        r.results.forEach(e => {
            let b = new Bok(e);
            bib.bok[b.bokid] = b;
        })
    }
}





async function setup() {
    let divAntall = document.getElementById("antall");
    let inpISBN = document.getElementById("isbn");
    let inpTittel = document.getElementById("tittel");
    let inpForfatter = document.getElementById("forfatter");
    let inpSjanger = document.getElementById("sjanger");
    let inpSider = document.getElementById("sider");
    let btnLagre = document.getElementById("lagre");
    btnLagre.addEventListener("click", lagreData);
    await lesBibliotek().catch(e => console.log(e));
    divAntall.innerHTML = String(Object.keys(bib.bok).length);



    function lagreData() {
        let isbn = inpISBN.value;
        let tittel = inpTittel.value;
        let sjanger = inpSjanger.value;
        let sider = inpSider.value;

        inpISBN.value = "";
        inpTittel.value = "";
        inpForfatter.value = "";
        inpSjanger.itemValue = "";
        inpSider.value = "";

        let bokData = new Bok({isbn, tittel, sjanger, sider});
        bokData.bokid = 2;
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
    return liste.filter(e => e[egenskap] === test);
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
