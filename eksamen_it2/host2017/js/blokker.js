// @flow

function setup() {
  // partiene med default-verdier for prosentpoeng
  let partiene = (
    "raudt:3.7,sv:5.0,a:23.0,sp:4.2,mdg:3.8" +
    ",krf:2.8,v:6.7,h:28.2,frp:15.6,pir:4.3"
  ).split(",");

  let frmSkjema = document.getElementById("skjema");

  // oppdaterer innhold av skjema ved å endre innerHTML
  let html = partiene.map(partiInfo => {
    // her ønsker jeg at teksten inne i `` skal være lettlest.
    // lange variabelnavn motvirker dette.
    // p,o brukes bare i linja rett etter forklaringen - dermed
    // øker lesbarheten ved valg av korte navn (for lokale temporære variable)
    let [p, o] = partiInfo.split(":"); // p-parti o-oppsluttning
    return `<div><label>${p.toLocaleUpperCase()}</label></div>
      <div><input type="number" data-id="${p}" 
        min=0 max=100 value="${o}"> </div>`;
  });
  frmSkjema.innerHTML =
    `<div><h4>Parti</h4></div><div><h4>Prosent</h4></div>` + html.join("");

  // legger til en knapp i skjema, viser alternativ metode vs innerHTML
  // fordelen her er at jeg nå har en ref til knappen - slipper querySelector/getElementById
  let btnBlokker = document.createElement("button");
  btnBlokker.type = "button";
  btnBlokker.innerHTML = "Vis blokker";
  frmSkjema.appendChild(btnBlokker);
  btnBlokker.addEventListener("click", visBlokker);
  frmSkjema.addEventListener("change", visBlokker);

  // definerer eventhandleren som en inner function
  // har da adgang til de lokale variablene i setup

  /**
   * Eksempel på bruk av jsdoc - denne typen kommentarer
   * kan brukes til å generere automatisk dokumentasjon av alle funksjoner
   * @param {Event} _  bruker ikke event objektet i denne handleren
   * @returns null
   */
  function visBlokker(_) {
    let divBlokkene = document.getElementById("blokkene");
    let rgBlokk = "a,sp,sv".split(","); // rød-grønn blokk
    let borgBlokk = "h,frp,krf,v".split(","); // borgerlig blokk
    let andreBlokk = "raudt,mdg,pir".split(","); // alle de andre

    // henter ut alle input feltene fra skjema - gjør om til en array (fra en nodeList)
    let prosentListe = Array.from(frmSkjema.querySelectorAll("input"));

    // bruker funksjonen tellOpp til å summere poeng for blokkene
    let borgPoeng = tellOpp(prosentListe, borgBlokk);
    let rgPoeng = tellOpp(prosentListe, rgBlokk);
    let andrePoeng = tellOpp(prosentListe, andreBlokk);

    let borgDiv = lageSoyle(borgPoeng, "blue");
    let rgDiv = lageSoyle(rgPoeng, "green");
    let andreDiv = lageSoyle(andrePoeng, "brown");

    divBlokkene.innerHTML = ""; // fjern tidligere gererte søyler
    divBlokkene.appendChild(borgDiv);
    divBlokkene.appendChild(rgDiv);
    divBlokkene.appendChild(andreDiv);

    let diff = Math.abs(borgPoeng - rgPoeng).toFixed(1);

    let biggest = borgPoeng > rgPoeng ? "Borgerlig" : "Rød-grønn";
    let divInfo = document.createElement("div");
    divInfo.className = "info";
    divInfo.innerHTML = `${biggest} blokk er størst, de har ${diff} mer poeng en de andre blokkene.`;
    divBlokkene.appendChild(divInfo);
  }
}

/**       pure functions - funksjoner uten side-effekter        */
/*  *********************************************************** */
// i et større prosjekt kan disse skilles ut i en egne fil/modul

/**
 * @param {Array} liste - alle input fra skjema
 * @param {Array} blokk - liste med parti som er medlem av gitt blokk
 * @returns {Number} sum av prosentpoeng for gitt blokk
 */
function tellOpp(liste, blokk) {
  return liste
    .filter(e => blokk.includes(e.dataset.id))
    .reduce((s, e) => s + Number(e.value), 0);
}

/**
 * Lager en div som tilsvarer søyle for blokk
 * @param {Number} poeng prosentpoeng for blokk
 * @param {string} farge farge på søyle
 * @returns {HTMLElement}
 */
function lageSoyle(poeng, farge) {
  let divSoyle = document.createElement("div");
  divSoyle.className = "soyle";
  divSoyle.innerHTML = poeng.toFixed(2);
  divSoyle.style.width = 3 * poeng + "px";
  divSoyle.style.backgroundColor = farge;
  return divSoyle;
}

