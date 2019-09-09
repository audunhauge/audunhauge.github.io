// @ts-check

class Bil {
    fabrikant;
    modell;
    aarsmod;
    farge;
    volum;
    plasser;
    constructor(fabrikant, modell, aarsmod, farge, volum, plasser) {
        this.fabrikant = fabrikant;
        this.aarsmod = aarsmod;
        this.farge = farge;
        this.volum = volum;
        this.plasser = plasser;
    }
}

function $(id) {
    return document.getElementById(id);
}

function setup() {
    let inpfabrikant = $("fabrikant");
    let inpmodell = $("modell");
    let inpaarsmod = $("aarsmod");
    let inpfarge = $("farge");
    let inpvolum = $("volum");
    let inpplasser = $("plasser");
    let btnLagre = $("lagre");
    let divListe = $("liste");

    btnLagre.addEventListener("click", registrer);


    let bilRegister = [];

    function visBiler() {
        visListe(medlemsListe, divListe);
    }

    function registrer() {
        let fabrikant = inpfabrikant.value;
        let modell = inpmodell.value;
        let aarsmod = inpaarsmod.value;
        let farge = inpfarge.value;
        let volum = inpvolum.value;
        let plasser = inpplasser.value;

        let bil = new Bil(fabrikant,modell,aarsmod,farge,volum,plasser);

        bilRegister.push(bil);

    }
}

function visListe(arr, div) {
    let s = "";
    for (let i = 0; i < arr.length; i += 1) {
        let m = arr[i];
        s += m.jadda;
    }
    s += ""
    div.innerHTML = s;
}