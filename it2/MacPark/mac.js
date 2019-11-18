// @ts-check

class MacInfo  {
    constructor(navn,os,minne,hd,hdl,modell) {
        this.navn = navn;
        this.os = os;
        this.minne = minne;
        this.hd = hd;
        this.hdl = hdl;
        this.modell = modell;
    }
}

const macData = [ ];


function setup() {
    let divAlle = document.getElementById("alle");
    let inpNavn = document.getElementById("navn");
    let inpOs = document.getElementById("os");
    let inpMinne = document.getElementById("minne");
    let inpHD = document.getElementById("hdtot");
    let inpHDL = document.getElementById("hdledig");
    let inpModell = document.getElementById("modell");
    let btnLagre = document.getElementById("lagre");

    btnLagre.addEventListener("click", lagreData);

    function lagreData() {
        let navn = inpNavn.value;
        let os = inpOs.value;
        let minne = inpMinne.nodeValue;
        let hd = inpHD.value;
        let hdl = inpHDL.value;
        let modell = inpModell.value;
        macData.push(new MacInfo(navn,os,minne,hd,hdl,modell));

        visAlle();
       
    }

    function visAlle() {
        divAlle.innerHTML = "";
        let s = "";
        for (let mac of macData) {
            s += `<div>${mac.navn} ${mac.os} ${mac.hd} 
                  ${mac.hdl} ${mac.minne} ${mac.modell}</div>`;
        }
        divAlle.innerHTML = s;

    }
}