// @ts-check

class Trening {
    navn;
    repetisjoner;
    motstand;
    constructor(navn, repetisjoner, motstand) {
        this.navn = navn;
        this.repetisjoner = repetisjoner;
        this.motstand = motstand;
    }
}

function $(id) {
    let x = document.getElementById(id);
    if (x == undefined) alert("Hva er " + x);
    return x;
}

const get = (id) => id.value;

function setup() {
    let inpNavn = $("navn");
    let inpReps = $("reps");
    let inpMot = $("mot");
    let btnRegistrer = document.getElementById("registrer");
    let divListe = $("liste");
   

    btnRegistrer.addEventListener("click", registrer);


    let treningsListe = [ ];

    function visListe() {
        visTrening(treningsListe, divListe);
    }

    function registrer() {
        
        let navn = get(inpNavn) 
        let reps = Number(get(inpReps));
        let motstand = Number(get(inpMot));
        let sett = new Trening(navn,reps,motstand)

        treningsListe.push(sett);
        visListe();

    }
}

function visTrening(arr, div) {
    let s = "<table><tr><th>Sett</th><th>Repetisjoner</th><th>Motstand</th>";
    let total = 0;
    for (let i=0; i< arr.length; i += 1) {
        let m = arr[i];
        s += `<tr><td>${m.navn}</td><td>${m.repetisjoner}</td><td>${m.motstand}</tr>`;
        total += m.repetisjoner * m.motstand;
    }
    s += "</table>" + "<div>Trenigsvolum:" + total + " kg</div>"
    div.innerHTML = s;
}