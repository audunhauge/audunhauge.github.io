// @ts-check
let autokeys = {
    bokID:0,
    forfatterID:0,
    forlagID:0,
    eksemplarID:0,
    utlaanID:0,
} 

class Bok {
    constructor(isbn, tittel, sjanger, sider) {
        this.bokID = autokeys.bokID++;
        this.isbn = isbn;
        this.tittel = tittel;
        this.sjanger = sjanger;
        this.sider = sider;
    }
}

let bib = {
    bok: {},
    forfatter: {},
    forlag: {},
    eksemplar: {},
    utlaan: {},
}

if (localStorage.getItem("bibliotek")) {
    let biblist = localStorage.getItem("bibliotek");
    bib = JSON.parse(biblist);
}

if (localStorage.getItem("bibliotek_auto")) {
    let auto = localStorage.getItem("bibliotek_auto");
    autokeys = JSON.parse(auto);
}

function setup() {
    let divAntall = document.getElementById("antall");
    let inpISBN = document.getElementById("isbn");
    let inpTittel = document.getElementById("tittel");
    let inpForfatter = document.getElementById("forfatter");
    let inpSjanger = document.getElementById("sjanger");
    let inpSider = document.getElementById("sider");
    let btnLagre = document.getElementById("lagre");
    btnLagre.addEventListener("click", lagreData);
    divAntall.innerHTML = String(Object.keys(bib.books).length);

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

        let bokData = new Bok(isbn,tittel,sjanger,sider);
        let key = bokData.bokID;
        bib.books[key] = bokData;
        divAntall.innerHTML = String(Object.keys(bib.books).length);
        // oppdater databasen med alle endringer
        // NB dette er ikke en god løsning (denne modellen er bare for å illustrere virkemåte)
        // HELE databasen lagres på nytt for HVER ENESTE endring
        localStorage.setItem("bibliotek", JSON.stringify(bib));
        localStorage.setItem("bibliotek_auto",JSON.stringify(autokeys));
    }
}

function bokliste() {
    let divMain = document.getElementById("main");
    let inpSjanger = document.getElementById("sjanger");

    inpSjanger.addEventListener("change", oppdaterListe);

    oppdaterListe();

    function oppdaterListe() {
        let s = ""; let books;
        let sjanger = inpSjanger.value || "historie";
        if (sjanger === "alle") {
            books = filtrer(bib.books, "sjanger", (e, v) => true);
        } else {
            books = filtrer(bib.books, "sjanger", sjanger);
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

function makeSelect(tname, tdata) {
   

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