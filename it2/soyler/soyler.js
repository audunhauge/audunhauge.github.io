// @ts-check

class Person {
    constructor(fornavn, etternavn, alder, vekt, hoyde) {
        this.fornavn = fornavn;
        this.etternavn = etternavn;
        this.alder = alder;
        this.vekt = vekt;
        this.hoyde = hoyde;
    }
}


function setup() {
    let divMain = document.getElementById("main");
    let inpFornavn = document.getElementById("fornavn");
    let inpEtternavn = document.getElementById("etternavn");
    let inpAlder = document.getElementById("alder");
    let inpHoyde = document.getElementById("hoyde");
    let inpVekt = document.getElementById("vekt");
    let btnLagre = document.getElementById("lagre");

    btnLagre.addEventListener("click", lagrePerson);

    let personer = [];

    function lagrePerson() {
        let fornavn = inpFornavn.value;
        let etternavn = inpEtternavn.value;
        let vekt = inpVekt.valueAsNumber;
        let alder = inpAlder.valueAsNumber;
        let hoyde = inpHoyde.valueAsNumber;
        let p = new Person(fornavn, etternavn, alder, vekt, hoyde);
        personer.push(p);
        lagSoylerForPersoner();
    }

    function lagSoylerForPersoner() {
        divMain.innerHTML = "";
        for (let i = 0; i < personer.length; i++) {
            let p = personer[i];
            let s = lagSoyle(p.hoyde * 2);
            setEtikett(s,p.fornavn + " bmi:" + bmi(p).toFixed(1) );
            divMain.appendChild(s);
        }
    }


}