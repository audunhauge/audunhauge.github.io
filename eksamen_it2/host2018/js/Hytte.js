// @ts-check

/**
 * Denne filen simulerer database for hytter
 * Brukes av oppg2 og oppg3
 */

const Jul = 0, Vinterferie = 1, Påske = 2;

class Hytte {
    constructor(navn, plasser, standard, badstue, prisK, antall = 2) {
        this.navn = navn;
        this.plasser = plasser;
        this.standard = standard;
        this.badstue = badstue;
        this.pris = prisK * 1000;
        this.bilde = navn.toLowerCase() + ".jpg";
        this.antallBilder = antall;
        this.reservert = [0, 0, 0];
    }

    vis() {
        return `${this.navn}
        <br>Pris: ${this.pris} 
        <br>Plasser: ${this.plasser}
        <br>Standard: ${this.standard} 
        <br>Badstu: ${this.badstue} 
         `;
    }

    /**
     * Reserverer hytta for gitt periode
     * @param {number} periode 0,1,2 
     */
    reserver(periode) {
        this.reservert[periode] = 1;
    }

    /**
     * Sann dersom minst en periode er ledig
     */
    get ledig() {
        return this.reservert.some(e => e === 0);
    }

    /**
     * Sann dersom hytta er ledig i denne perioden
     * @param {number} periode 0,1,2
     */
    erledig(periode) {
        return this.reservert[periode] === 0;
    }
}

/**
 * Denne leses fra fil eller database
 * Simulerer bruk av eksterne data med denne tekst-strengen.
 * Navn,plasser,standard,badstu(1=ja),pris(*1000),reservertp0,p1,p2
 */
let hyttedata_str = `Granstua,4,Høy,1,12:1,1,0
Granbo,6,"Middels",0,15:0,0,1
Grantoppen,8,"Lav",0,16:1,0,1
Granhaug,10,"Høy",1,30:1,0,1`;

const hytter = new Map();

// gitt navnet på en periode -> tallverdi
const Perioder = new Map([["Jul", Jul], ["Vinterferie", Vinterferie], ["Påske", Påske]]);


// legger inn reserveringer fra tabell (henta fra database/fil)
let hytteListe = hyttedata_str.split('\n');
hytteListe.forEach(hyttedata => {
    let [inf, reservert] = hyttedata.split(":");
    let [navn,plasser,standard,badstu,pris] = inf.split(",");
    let [p0,p1,p2] = reservert.split(",");
    let hytte = new Hytte(navn,plasser,standard,badstu,pris);
    // innlegging av eksisterende data kan forenkles
    // med egen funksjon som tar "1,0,1" som parameter
    // men trenger reserver(periode) senere - så bruker denne
    if (p0 === "1") hytte.reserver(0);
    if (p1 === "1") hytte.reserver(1);
    if (p2 === "1") hytte.reserver(2);
    hytter.set(navn, hytte);
})