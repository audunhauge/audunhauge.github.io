// @ts-check

/*
1 "bruker relevant dokumentasjon og kode"

2 "vurderer nytten av objektorientert
programmering og begrepene klasse,
objekt og arv"

3 "bruker relevante teknikker i
utviklings- og planleggingsverktøy og
kjenner verktøyenes muligheter."

Jeg bruker vs-code (verktøy 3) og devdocs.io (dokumentasjon 1)
På et prosjekt ville jeg brukt github for koden (3)
*/

// for å vise kompetanse på (3) lager jeg en klasse for hytter

/* vurdere nytte:
  Med denne klassen kan jeg lage objekter som samler all informasjon
  og funksjonalitet knytta til hytter i ett objekt.
  Arv bruker jeg ikke - da modellen er veldig enkel 
  Kunne hatt Hytte extends Hus -- men jeg trenger ikke hus
*/

class Hytte {
    constructor(navn, sengeplasser, standard, badstu, ukepris) {
        this.navn = navn;
        this.sengeplasser = sengeplasser;
        this.standard = standard;
        this.badstu = badstu;
        this.ukepris = Number(ukepris) * 1000;
        this.bilde = navn.toLowerCase() + ".jpg";
        // antar at hyttenavn og navn på bilde stemmer overens som i tabellen
        this.utleid = [0, 0, 0];
    }

    bestill(sesong = 0) {
        this.utleid[sesong] = 1;
    }

    vis() {
        return `<h4>${this.navn}
        <br>Sengeplasser: ${this.sengeplasser}
        <br>Standard: ${this.standard}
        <br>Badstu: ${this.badstu}
        <br>Ukepris: ${this.ukepris} kr
        <br><img src="../media/${this.bilde}" >
        `;
    }
}

/*
// enkel bruk av klassen
let h = new Hytte("Granbu",4,"Høy","Ja",6000);
h.vis()
*/

let hytteData = new Map();   // skal lagre data om alle hyttene

const hytteText = `Granstua,4,Høy,Ja,12
Grantoppen,6,Middels,Nei,15
Granbo,8,Lav,Nei,16
Granhaug,10,Høy,Ja,30`;


function lesHytteData() {
    // simulerer at jeg har lest tekstfil med data om hyttene
    let hytteLinjer = hytteText.split('\n');
    for (let h of hytteLinjer) {
        let [navn, plasser, standard, badstu, pris] = h.split(",");
        let hytte = new Hytte(navn, plasser, standard, badstu, pris);
        hytteData.set(navn, hytte);
    }
}

function setup() {
    lesHytteData();   // henter informasjon om hyttene
}