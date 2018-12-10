// @ts-check


class Person {
    constructor(navn,alder,adresse) {
        this.alder = alder;
        this.navn = navn;
        this.adresse = adresse;
    }
}


function setup() {

    let personListe = [ ];

    let inpNavn = document.getElementById("navn");
    let inpAlder = document.getElementById("alder");
    let inpAdresse = document.getElementById("adresse");
    let btnLagre = document.getElementById("lagre");
    let divOversikt = document.getElementById("oversikt");
    btnLagre.addEventListener("click", lagreData);

    function lagreData() {
        let navn = inpNavn.value;
        let alder = inpAlder.value;
        let adresse = inpAdresse.value;
        let person = new Person(navn,alder,adresse);
        personListe[0] = person;
        visListe();
    }

    function visListe() {
        let innhold = "";
        for (let p of personListe) {
           innhold += `Navn:${p.navn}  Alder:${p.alder} Adresse:${p.adresse}`;
        }
        innhold += "";
        divOversikt.innerHTML = innhold;
    }
}