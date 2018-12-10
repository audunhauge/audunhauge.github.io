// @ts-check

// Lager et objekt med info om de forskjellige valgene
// kan være nyttig dersom en lang beskrivelse er knytta til valgene
// merk at nøkkelen er value fra option i html-fila
const info = {
    sang: "Sang og dans i Bykle",
    dans: "Hallingkast gjennom tidene"
};

/**
 * Litt utvida versjon
 * Lagt til en klasse-funksjon
 * Alle paameldinger vet hvordan de skal rendres på skjermen
 */
class Paamelding {
    constructor(vaksne, barn, arr) {
        this.vaksne = vaksne;
        this.barn = barn;
        this.arr = arr;
    }

    /**
     * Lager en linje i en liste for denne paameldingen
     */
    render() {
        let tekst = info[this.arr];
        return `<li>${tekst} , ${this.barn} barn og ${this.vaksne} voksne.</li>`;
    }
}

// viser hvordan en kan bruke arv i js
class MedlemsListe extends Array {
    // konstruktor ikke påkrevd (da den ikke gjør noe ekstra)
    // tas med bare for å vise metode - kan kjøre egen kode etter super
    // ikke før - for da er this ikke definert
    constructor() {
        super();
    }
    vis() {
       return '<ol>' + this.reduce((s,v) => s + v.render() , "") + '</ol>'
    }
}



function setup() {
    let list = new MedlemsListe();
    let inpVoksne = document.getElementById("voksne");
    let inpBarn = document.getElementById("barn");
    let selArr = document.getElementById("arr");
    let divVisListe = document.getElementById("visliste");

    let btnLagre = document.getElementById("lagre");
    btnLagre.addEventListener("click", lagreData);


    function lagreData(event) {
        let voksne = inpVoksne.valueAsNumber;
        let barn = inpBarn.valueAsNumber;
        let arr = selArr.value;
        if (!((voksne > 0 || barn > 0) && arr !== "")) {
            alert("Du må velge arr og antall voksne/barn");
            return;
        }
        let paamelding = new Paamelding(voksne, barn, arr);
        list.push(paamelding);
        visListe();     // viser liste på ny etter hver registrering
    }

    function visListe() {
        let uList = list.vis();
        divVisListe.innerHTML = uList;
    }
}