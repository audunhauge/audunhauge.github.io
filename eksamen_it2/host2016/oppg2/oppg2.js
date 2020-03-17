// @ts-check

/**
 * I koden under bruker jeg const på alle verdier som ikke endres underveis (muteres)
 * Bare variable som skal oppdateres defineres med let
 * Får da varsel om jeg ved et uhell endrer på en const
 */

/**
 *
 * vs-chat:
 *   dersom discord sliter ...
 * Skriv her
 * placeHolder skal være placeholder
 * fant det ut i console
 * Ser ut som om discord sliter for mye nå
 * hva betyr linje 54?
 */

const $ = id => document.getElementById(id);
const n = elm => Number(elm.value);
const v = elm => elm.value;

function setup() {
  const selAntallMidd = $("antallmidd");
  const inpAntallPers = $("antallpers");
  const inpNavn = $("navn");
  const inpAdresse = $("adresse");
  const btnLagre = $("lagre");
  const btnBekreft = $("bekreft");
  const divBilde = $("bilde");
  const divBekreft = $("bekreft");
  const divPris = $("pris");
  const divAvslutning = $("avslutning");

  btnLagre.addEventListener("click", lagreBestilling);
  btnBekreft.addEventListener("click", bekreft);
  let pris;

  function lagreBestilling() {
    const antallMiddager = v(selAntallMidd);
    const antall = n(inpAntallPers);
    if (antall < 1 || antall > 25) {
      inpAntallPers.value = "";
      inpAntallPers.placeholder = "antall mellom 1..25";
      return; // hopper ut fordi det var feil antall
    }
    // kommer her dersom antall i orden
    // skal vise et bilde avhengig av valg

    divBilde.style.backgroundImage = `url("../media/${antallMiddager}Middager.png")`;

    // beregn pris
    const antallM = antallMiddager === "to" ? 2 : 3;
    
    if (antall > 4) {
      pris = antall * 70 * antallM;
    } else {
      pris = antall * 80 * antallM;
    }
    divPris.innerHTML = `Prisen blir ${pris} for ${antallMiddager} middager for ${antall} personer.`;
  }

  // bekreft knappen burde ikke virke før  lagre knappen er trykka
  // men hopper over dette pga tid ...
  // ville brukt css classe som skjulte knappen/ eller disabled egenskapen

  //hva betyr linje 54?
  // const variable = (betingelse) ? truevalue : falsevalue;
  //    betingelse: a === 3, b > 4, osv - samme som if (betingelse)
  // tilsvarende kode som l. 54:
  //   if (antallMiddager === "to") { antallM = 2} else {antallM = 3};
  //   jeg har teksten "to" eller "tre", men trenger tallverdier
  // Eksempel:
  //   const pris = ((antall > 4) ? 70 : 80) * antall * antallM;
  // tilsvarer linje 56..60, verdien av parantesen blir 70 eller 80

  function bekreft() {
    const antallMiddager = v(selAntallMidd);
    const antall = n(inpAntallPers);
    const navn = v(inpNavn);
    const adresse = v(inpAdresse);
    divAvslutning.innerHTML = 
    `Hei ${navn}!<br>
    Du har bestilt ${antallMiddager} middager for ${antall} personer.
     <p> 
     Varene leveres til din adresse : ${adresse}.
     <br>Prisen blir ${pris}.
    `;
  }
}
