// @ts-check

let bib = {
    books: {},
}

if (localStorage.getItem("bibliotek")) {
    let biblist = localStorage.getItem("bibliotek");
    bib = JSON.parse(biblist);
}

function setup() {
    let divAntall = document.getElementById("antall");
    let inpISBN = document.getElementById("isbn");
    let inpTittel = document.getElementById("tittel");
    let inpForfatter = document.getElementById("forfatter");
    let inpSjanger = document.getElementById("sjanger");
    let inpUtgiv = document.getElementById("utgiv");
    let btnLagre = document.getElementById("lagre");
    btnLagre.addEventListener("click", lagreData);
    divAntall.innerHTML = String(Object.keys(bib.books).length);

    function lagreData() {
        let isbn = inpISBN.value;
        let tittel = inpTittel.value;
        let forfatter = inpForfatter.value;
        let sjanger = inpSjanger.value;
        let utgiv = inpUtgiv.value;

        inpISBN.value = "";
        inpTittel.value = "";
        inpForfatter.value = "";
        inpSjanger.itemValue = "";
        inpUtgiv.value = "";

        let bokData = { isbn, tittel, forfatter, sjanger, utgiv };
        bib.books[isbn] = bokData;
        localStorage.setItem("bibliotek", JSON.stringify(bib));
        divAntall.innerHTML = String(Object.keys(bib.books).length);
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
            books = filtrer(bib.books, "sjanger", (e,v) => true );
        } else {
            books = filtrer(bib.books, "sjanger", sjanger);
        }
        books.forEach(
            book => {
                s += "<div><h4>" + book.tittel + "</h4><div>";
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
        return liste.filter(e => test(e,egenskap));
    }
    return liste.filter(e => e[egenskap] === test);
}