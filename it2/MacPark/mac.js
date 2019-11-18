// @ts-check

class MacInfo  {
    constructor({navn,os,minne,hd,hdl,modell}) {
        this.navn = navn;
        this.os = os;
        this.minne = minne;
        this.hd = hd;
        this.hdl = hdl;
        this.modell = modell;
    }
    render() {
        return `<div>${this.navn} ${this.os} ${this.hd} 
        ${this.hdl} ${this.minne} ${this.modell}</div>`;
    }

    display() {
        return `
        <div class="display" data-idx="0">
          <div><label>Navn      </label>    ${this.navn} </div>
          <div><label>Os        </label>    ${this.os} </div>
          <div><label>HD        </label>    ${this.hd} </div>
          <div><label>HD ledig  </label>    ${this.hdl} </div>
          <div><label>Minne     </label>    ${this.minne}</div>
          <div><label>Modell    </label>    ${this.modell}</div>
        </div>` 
    }
}

let macData = [ ];

function start() {
    if (localStorage.getItem("macdata")) {
        let raw = JSON.parse(localStorage.getItem("macdata"));
        macData = raw.map(e => new MacInfo(e) );
        // lagra data er {navn,os,minne,hd,hdl,modell}
        // gjør dette om til instanser av MacInfo
        // slik at .render() og .display() virker
    }
    let divTeach = document.getElementById("teachdiv");
    let selTeach = document.getElementById("teach");
    let s = "";
    for (let i=0; i < macData.length; i++) {
        let mac = macData[i];
        s += `<option value="${i}">${mac.navn}</option>`;
    }
    selTeach.innerHTML = s;

    selTeach.addEventListener("change", visValgt);

    function visValgt() {
        let idx = Number(selTeach.value);
        let mac = macData[idx];
        divTeach.innerHTML = mac.display();
        divTeach.querySelector("div.display").dataset.idx = String(idx);
    }
}


function setup() {
    if (localStorage.getItem("macdata")) {
        let raw = JSON.parse(localStorage.getItem("macdata"));
        macData = raw.map(e => new MacInfo(e) );
    }
    let divAlle = document.getElementById("alle");
    let inpNavn = document.getElementById("navn");
    let inpOs = document.getElementById("os");
    let inpMinne = document.getElementById("minne");
    let inpHD = document.getElementById("hdtot");
    let inpHDL = document.getElementById("hdledig");
    let inpModell = document.getElementById("modell");
    let btnLagre = document.getElementById("lagre");

    btnLagre.addEventListener("click", lagreData);

    visAlle();

    function lagreData() {
        let navn = inpNavn.value;
        let os = inpOs.value;
        let minne = inpMinne.value;
        let hd = inpHD.value;
        let hdl = inpHDL.value;
        let modell = inpModell.value;
        macData.push( new MacInfo({navn,os,minne,hd,hdl,modell}) );
        localStorage.setItem("macdata", JSON.stringify(macData) );

        visAlle();
       
    }

    function visAlle() {
        let s = "";
        for (let mac of macData) {
            s += mac.render();
        }
        divAlle.innerHTML = s;
    }
}