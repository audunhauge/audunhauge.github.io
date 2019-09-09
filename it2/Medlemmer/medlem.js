// @ts-check

class Medlem {
    epost;
    fornavn;
    etternavn;
    alder;
    mobil;
    constructor(epost, fn, en, alder, mob) {
        this.epost = epost;
        this.fornavn = fn;
        this.etternavn = en;
        this.alder = alder;
        this.mobil = mob;
    }
}

function $(id) {
    return document.getElementById(id);
}

function setup() {
    let inpEpost = $("epost");
    let inpFornavn = $("fornavn");
    let inpEtternavn = $("etternavn");
    let inpAlder = $("alder");
    let inpMobil = $("mobil");
    let btnRegistrer = $("registrer");
    let divListe = $("liste");
    let btnVis = $("vis");

    btnRegistrer.addEventListener("click", registrer);
    btnVis.addEventListener("click", visListe);


    let medlemsListe = [ ];

    function visListe() {
        visMedlemmer(medlemsListe, divListe);
    }

    function registrer() {
        // @ts-ignore
        let epost = inpEpost.value;
        // @ts-ignore
        let fornavn = inpFornavn.value;
        // @ts-ignore
        let etternavn = inpEtternavn.value;
        // @ts-ignore
        let alder = inpAlder.valueAsNumber || 20;
        // @ts-ignore
        let mobil = inpMobil.value;

        let medlem = new Medlem(epost,fornavn,etternavn,alder,mobil);

        medlemsListe.push(medlem);

    }
}

function visMedlemmer(arr, div) {
    let s = "<table>";
    for (let i=0; i< arr.length; i += 1) {
        let m = arr[i];
        // s += m.fornavn + " " + m.etternavn  + "<br>";
        s += `<tr><td>${m.fornavn}</td><td>${m.etternavn}</td><td>${m.alder}
                  </td><td>${m.epost}</td><td>${m.mobil}</td></tr>`;
    }
    s += "</table>"
    div.innerHTML = s;
}