// @ts-check

/**
 * Enkelt skjema for påmelding/valg av kurs o.l.
 * Lista med påmeldte vises automatisk
 * Kan lett endres slik at dette styres av en knapp
 */

class Paamelding {
    constructor(vaksne, barn, arr) {
        this.vaksne = vaksne;
        this.barn = barn;
        this.arr = arr;
    }
}

// Lager et objekt med info om de forskjellige valgene
// kan være nyttig dersom beskrivelse er knytta til valgene
// merk at nøkkelen er value fra option i html-fila
let info = {
    sang: "Sang og dans i Bykle",
    dans: "Hallingkast gjennom tidene"
};

function setup() {
    let list = [];
    let inpVoksne = document.getElementById("voksne");
    let inpBarn = document.getElementById("barn");
    let selArr = document.getElementById("arr");
    let divVisListe = document.getElementById("visliste");

    let btnLagre = document.getElementById("lagre");
    btnLagre.addEventListener("click", lagreData);

    /**
     * Bruk linjene under dersom du vil styre visning med 
     * knapp. Husk å lage knapp i html
     */
    // let btnVis = document.getElementById("vis");
    // btnVisListe.addEventListener("click", visListe);



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
        list.sort((a, b) => a.arr > b.arr ? -1 : 1);
        // sorterer liste etter feltet .arr
        // dvs sorterer på Sang/Dans

        visListe();     // viser liste på ny etter hver registrering
    }

    function visListe() {
        let uList = "<ol>";
        for (let p of list) {
            let tekst = info[p.arr];
            uList += `<li>${tekst} , ${p.barn} barn og ${p.vaksne} voksne.</li>`;
        }
        uList += "</ol>";
        divVisListe.innerHTML = uList;
    }
}