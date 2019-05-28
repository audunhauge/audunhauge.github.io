// @ts-check

const $ = e => document.getElementById(e);
const new$ = e => document.createElement(e);

// sortert hytteliste
let hytter = "Gjendebu,Gjendesheim,Glitterheim,Leirvassbu,Memurubu,Olavsbu,Spiterstulen".split(",");

const avstander = {
    Gjendebu:{Leirvassbu:19, Memurubu:10,Olavsbu:16,Spiterstulen:24},
    Gjendesheim:{Glitterheim:22,Memurubu:14},
    Glitterheim:{Memurubu:14,Spiterstulen:17},
    Leirvassbu:{Olavsbu:11,Spiterstulen:15},
    Memurubu:{},   // resten tomme da avstanden er lagra tidligere i tabellen
    Olavsbu:{},
    Spiterstulen:{},
}

/**
 * Returnerer avstand mellom to hytter
 * NaN dersom ingen direkte rute
 * @param {string} a Navn på hytte
 * @param {string} b Navn på hytte
 * @returns {number} Km mellom a og b
 */
function avstand(a, b) {
  // sorterer slik at avstand alltid beregnes fra start til stop hvor start<stop
  let [start, stop] = [a, b].sort();
  return avstander[start][stop] || NaN;
}

const makeOptions = arr =>
  ["..velg..", ...arr].map(e => `<option>${e}</option>`).join("");

/**
 *  Lager en klasse bare for å vise kjennskap til ... (læreplanmål)
 *  Løsningen blir ikke bedre/enklere med denne klassen
 *  Ikke lett å finne bruk for arv her - så lar det være
 *  (Hytte extends Hus -- men det blir for sært)
 *  Viser bruk av enkel getter (kan også lage private fields med chrome > 74)
 */
class Hytte {
  naboer = [];
  get nedTrekk() {
    return makeOptions(this.naboer);
  }
}

// lager en ny hytteliste med denne klassen
let hytteListe = {};
hytter.forEach(e => (hytteListe[e] = new Hytte()));

// finner naboer
hytter.forEach(a => {
  hytter.forEach(b => {
    if (avstand(a, b)) {
      // det er en sti mellom disse to
      hytteListe[a].naboer.push(b);
    }
  });
});

function setup() {
  let divMain = $("main");
  let info = new$("div");
  let velger = new$("select");
  let btnAngre = new$("button");
  let chkOneWay = new$("input");
  let lblOneWay = new$("label");
  btnAngre.innerHTML = "Angre siste valg";
  let sti = []; // starter med tom sti


  // Minimalt arbeid med layout og utseende
  // Lager element med kode - kjappere med html, men vil vise metoden

  divMain.appendChild(info);
  divMain.appendChild(velger);
  divMain.appendChild(btnAngre);
  divMain.appendChild(chkOneWay);
  divMain.appendChild(lblOneWay);
  lblOneWay.innerHTML = "Ingen sløyfer i turen"
  chkOneWay.type = "checkbox";
  // dersom denne markeres vil neste valg begrenses slik at vi ikke får sløyfer

  velger.innerHTML = makeOptions(hytter);
  velger.addEventListener("change", leggTilHytte);
  btnAngre.addEventListener("click", angre);

  info.innerHTML = "velg startsted fra nedtrekk";

  function angre(e) {
    // dropper siste hytte
    if (sti.length) {
      sti.pop();
      leggTilHytte(null);
    }
  }

  function leggTilHytte(e) {
    let oneWay = chkOneWay.checked;
    let hytte = velger.value;
    if (hytte !== "..velg..") {
      sti.push(hytte);
    }
    if (sti.length) {
      // slik at angre-knappen skal virke - må sikre at hytte === siste i sti
      hytte = sti[sti.length - 1];
    }
    if (sti.length === 0) {
      velger.innerHTML = makeOptions(hytter);
      info.innerHTML = "velg startsted fra nedtrekk";
      return;   // unngå overskriving av velger og info
    } 
    if (sti.length === 1) {
      info.innerHTML = `Du starter fra ${hytte}, velg neste trinn`;
    } else {
      let distanser = sti.slice(0, -1).map((e, i) => avstand(e, sti[i + 1]));
      let total = distanser.reduce((s, v) => s + v, 0);
      info.innerHTML =
        "Start på " + sti.join(" til ") + `. Det er tilsammen ${total}km.`;
    }
    if (oneWay) {
        // fjern besøkte hytter fra nabolista
        let ubrukte = hytteListe[hytte].naboer.filter(e => ! sti.includes(e));
        velger.innerHTML = makeOptions(ubrukte);
    } else {
        // bruker getter fra klassen til å lage nedtrekk
        // igjen en litt knudrete løsning for å vise bruk av klasser/instans/getter
        velger.innerHTML = hytteListe[hytte].nedTrekk;
    }
  }
}
