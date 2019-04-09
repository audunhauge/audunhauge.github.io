// @ts-check

const Jul = 0, Vinterferie = 1, Påske = 2;

class Hytte {
    constructor() {
        this.reservert = [0, 0, 0];
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
 */
let hyttedata_str = `Granstua,1,1,0
Granbo,0,0,1
Grantoppen,1,0,1
Granhaug,1,0,1`;

const hytter = new Map();

// gitt navnet på en periode -> tallverdi
const Perioder = new Map([["Jul", Jul], ["Vinterferie", Vinterferie], ["Påske", Påske]]);


// legger inn reserveringer fra tabell (henta fra database/fil)
let hytteListe = hyttedata_str.split('\n');
hytteListe.forEach(hyttedata => {
    let [navn, p0, p1, p2] = hyttedata.split(",");
    let hytte = new Hytte();
    // innlegging av eksisterende data kan forenkles
    // med egen funksjon som tar "1,0,1" som parameter
    // men trenger reserver(periode) senere - så bruker denne
    if (p0 === "1") hytte.reserver(0);
    if (p1 === "1") hytte.reserver(1);
    if (p2 === "1") hytte.reserver(2);
    hytter.set(navn, hytte);
})



function setup() {
    let divMain = document.getElementById("main");
    let selPeriode = document.createElement("select");
    let selHytte = document.createElement("select");
    {   // lager innhold i select
        let opt = document.createElement("option");
        opt.innerHTML = "..velg periode.."
        opt.value = "";
        selPeriode.appendChild(opt);
        for (let k of "Jul,Vinterferie,Påske".split(",")) {
            let opt = document.createElement("option");
            opt.innerHTML = k;
            selPeriode.appendChild(opt);
        }
        divMain.appendChild(selPeriode);
    }
    selPeriode.addEventListener("change", visLedig);






    function visLedig(e) {
        let periode = selPeriode.value;
        if (periode !== "") {
            // gyldig periode
            // fjerner innhold fra select
            selHytte.innerHTML = "";
            {
                let opt = document.createElement("option");
                opt.innerHTML = "..velg hytte.."
                opt.value = "";
                selHytte.appendChild(opt);
                hytter.forEach((hytte, navn) => {
                    let p = Perioder.get(periode);
                    if (hytte.erledig(p)) {
                        let opt = document.createElement("option");
                        opt.innerHTML = navn;
                        selHytte.appendChild(opt);
                    }
                });
                divMain.appendChild(selHytte);
            }
        }
    }


}