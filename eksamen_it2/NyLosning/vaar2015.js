// @ts-check

class Matvare {
    constructor(protein, kcal, fett) {
        this.protein = protein;
        this.kcal = kcal;
        this.fett = fett;
    }
}

let matvareListe = new Map();

matvareListe.set("ost", new Matvare(1, 2, 3));
matvareListe.set("smør", new Matvare(4, 5, 6));
matvareListe.set("melk", new Matvare(7, 8, 9));
matvareListe.set("brød", new Matvare(10, 11, 12));

// kan lett legge til nye linjer med matvarer
// kan lese matvarer fra fil, men vanskelig å vise 
// da fetch() metoden ikke virker uten server

function setup() {
    let divMain = document.getElementById("main");
    let frmSkjema = lagSkjema(divMain);
    let divGraf = document.createElement("div");
    divGraf.className = "graf";
    divMain.appendChild(divGraf);
    frmSkjema.addEventListener("change", behandleData);
}

/**
 * Lager et enkelt skjema
 * @param {HTMLElement} div 
 * @returns HTMLElemnt
 */
function lagSkjema(div) {
    let frm = document.createElement("form");
    div.appendChild(frm);
    frm.innerHTML = `
      Diagrammet oppdateres ved hver endring
      <br>Antall ost <input type="number" id="ost">
      <br>Antall melk <input type="number" id="melk">
      <br>Antall brød <input type="number" id="brød">
      <br>Antall smør <input type="number" id="smør">
    `;
    return frm;
}

/**
 * 
 * @param {string} id htmlelement
 * @returns {number} verdien fra input
 */
function getValue(id) {
    // @ts-ignore
    return Number(document.getElementById(id).value) || 0;
}

function behandleData() {
  let ost = getValue("ost");
  let melk = getValue("melk");
  let brod = getValue("brød");
  let smor = getValue("smør");
  let ostData = matvareListe.get("ost");
  let melkData = matvareListe.get("melk");
  let brodData = matvareListe.get("brød");
  let smorData = matvareListe.get("smør");

  let protein = ostData.protein*ost + melkData.protein*melk;
  protein += brodData.protein * brod + smorData.protein*smor;

  let fett = ostData.fett*ost + melkData.fett*melk;
  fett += brodData.fett * brod + smorData.fett*smor;

  tegnSoyle(protein,"Protein",true);
  tegnSoyle(fett,"Fett");
  //tegnSoyle(kcal,"KCal");
}

/**
 * 
 * @param {number} verdi Bredde på søyle
 * @param {string} tekst Tekst på søyle
 */
function tegnSoyle(verdi,tekst,visk=false) {
    let divGraf = document.querySelector(".graf");
    if (visk) {
        divGraf.innerHTML = "";
    }
    let soyle = document.createElement("div");
    soyle.className = "soyle";
    divGraf.appendChild(soyle);
    soyle.innerHTML = tekst;
    soyle.style.width = (40 + verdi*5) + "px";
}