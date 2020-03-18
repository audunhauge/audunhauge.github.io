// @ts-check

/**
 * Lager en klasse for å vise kjenskap til objektorientert prog.
 */
class Bestilling {
  constructor(ukenr, antallm, barn, ungdom, voksne) {
    this.ukenr = ukenr;
    this.antallm = antallm;
    this.barn = barn;
    this.ungdom = ungdom;
    this.voksne = voksne;
  }
}

// sparer en del tastetrykk med denne kortformen for getbyid
const g = id => document.getElementById(id);

const bestillingsTabell = [];

// trenger denne til å beregne forbruk
const forbruksTabell = {
    barn:   {torsk:200,sei:200,makrell:200,reker:250,krabbe:300,laks:200},
    ungdom: {torsk:300,sei:300,makrell:300,reker:500,krabbe:500,laks:300},
    voksne: {torsk:350,sei:350,makrell:350,reker:500,krabbe:600,laks:350},
}

/**
 * En funksjon som finner ukenr for gjeldende dato
 */
const week = () => {
  const now = new Date();
  const onejan = new Date(now.getFullYear(), 0, 1);
  return Math.ceil(((Number(now) - Number(onejan)) / 86400000 + onejan.getDay() + 1) / 7);
};

function setup() {
  const divMessage = g("message");
  const inpUkenr = g("ukenr");
  const inpAntall = g("antallm");
  const inpBarn = g("barn");
  const inpUngdom = g("ungdom");
  const inpVoksne = g("voksne");
  const btnLagre = g("lagre");
  const btnBeregn = g("beregn");
  const divVisning = g("visning");

  // alternative måte å hente ut verdiene på er å bruke querySelectorAll
  // gitt at alle feltene i skjema er input (NB! en er select)
  // let [ukenr,antall,barn,ungdom,voksne] = Array.from(document.querySelectorAll("input")).map(e => e.value || 0);
  // med denne løsningen trengs ikke id på input i html

  btnLagre.addEventListener("click", lagreBestilling);
  btnBeregn.addEventListener("click", beregnForbruk);

  function lagreBestilling() {
    // sjekker ikke input  - dårlig tid - men burde gjøre det
    const ukenr = Number(inpUkenr.value) || week();
    // sørger for at alle input har 0 som default
    // da en ofte øsnker å registrer 1 barn 1 voksen, dvs ingen ungdom
    // nå virker dette selv om bruker lar ungdom stå tom.
    const antall = Number(inpAntall.value) || 0;
    const barn = Number(inpBarn.value) || 0;
    const ungdom = Number(inpUngdom.value) || 0;
    const voksne = Number(inpVoksne.value) || 0;
    // krav at det er minst en person
    // sjekker også at alle tall er heltall mellom 0..25
    // antall middager gitt som 2 eller 3, trenger ikke test
    const godetall = [barn,ungdom,voksne].every(e => e >= 0 && e <= 25 && Number.isInteger(e));
    // every er en array funksjon som returnerer True dersom alle element oppfyller kravet
    if (barn + ungdom + voksne > 0 && godetall) {
        // lager en instanse av klassen Bestilling.
      const bestilling = new Bestilling(ukenr, antall, barn, ungdom, voksne);
      bestillingsTabell.push(bestilling);
      visBestillinger(bestillingsTabell);
      // auto-øker ukenr dersom det ser rimelig ut
      if (ukenr > 0 && ukenr < 53) {
        inpUkenr.value = String(ukenr % 52 + 1);
        // øker ukenr moduls 52 + 1, får da 1..52
      }
      divMessage.innerHTML = "";
    } else {
      divMessage.innerHTML = "Må ha minst en person, barn,ungdom,voksne 0..25";
    }
  }

  /**
   * Funksjonen viser en liste over alle registrerte bestillinger på skjermen
   * @param {Array} bestillinger liste over alle bestillinger
   */
  function visBestillinger(bestillinger) {
    let s =
      "<table><tr><th>Ukenr</th><th>Antall</th><th>Barn</th><th>Ungdom</th><th>Voksne</th></tr>";
    // noe kode
    for (let b of bestillinger) {
      s += `<tr>
                    <th>${b.ukenr}</th>
                    <td>${b.antallm}</td>
                    <td>${b.barn}</td>
                    <td>${b.ungdom}</td>
                    <td>${b.voksne}</td>
                </tr>`;
    }
    s += "</table>";
    divVisning.innerHTML = s;
  }

  function visFiskForbruk(forbruk, antall) {
      let s = [];
      for (let f in forbruk) {
        s.push(`${f} : ${forbruk[f] * antall}`);
      }
      return s.join("<br>");
  }

  function beregnForbruk() {
      divMessage.innerHTML = "";
      // må finne uke 26 dersom lagt inn
      const uke26 = bestillingsTabell.find(e => e.ukenr === 26);
      if (uke26) {
          let forbruk = '';
          // vi har funnet uka
          let {antallm,barn,ungdom,voksne} = uke26;
          // 2 middager => krabbe+torsk
          // 3 middager => krabbe+torsk+laks
          const fiskeforbruk = (antallm === 3) ? { krabbe:0, torsk:0, laks:0} : { krabbe:0, torsk:0};
          const fiskeliste = Object.keys(fiskeforbruk);
          const personer = {barn,ungdom,voksne};
          for (let fisk of fiskeliste) {  // fisk = krabbe,torsk,laks (laks dersom 3 midgr)
              for (let p in personer) {   // p = barn,ungdom,voksne
                  // henter ut forbruk for (p,fisk) * personer[p], personer[p] kan være 0
                  fiskeforbruk[fisk] += forbruksTabell[p][fisk] * personer[p];
              }
          }
          divMessage.innerHTML = "Forbruket er " + visFiskForbruk(fiskeforbruk,antallm);
      } else {
        divMessage.innerHTML = "Må registrere uke 26 først";
      }
  }
}
