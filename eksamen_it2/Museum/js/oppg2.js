// @ts-check

// lager en klasse for å vise kompetanse på det feltet

class Arrangement {
  constructor(dato, tid, tittel, informasjon) {
    this.dato = dato;
    this.tittel = tittel;
    this.tid = tid;
    this.informasjon = informasjon;
  }

  /**
   * Lager overskrift for alle arrangement
   */
  static overskrift() {
    let div = document.createElement("div");
    div.className = "heading";
    div.innerHTML = `
    <div>Velg</div>
    <div>Dato</div>
    <div>Tid</div>
    <div>Arrangement</div>
    <div>Informasjon</div>
    `;
    return div;
  }

  /**
   * Lager en linje for ett arrangement
   * radio-knapp har value gitt av tittel
   */
  render() {
    let div = document.createElement("div");
    div.innerHTML = `
    <div><input type="radio" name="valgt" value="${this.tittel}"></div>
    <div>${this.dato}</div>
    <div>${this.tid}</div>
    <div>${this.tittel}</div>
    <div>${this.informasjon} </div>
    `;
    return div;
  }
}

// lager en array med alle arrangement
// denne er global (simulerer lagring)
// skal selvsagt leses fra database
let arrangementListe = [];
arrangementListe.push(
  new Arrangement(
    "1.juni",
    "11:00",
    "Trondheim kammermusikkfestival : Fabelaktig formiddag",
    "Dette er festivaldagen for barn og familiar. En billett gjelder for alt, og du kan velge mellom en rekke ulike forestillinger."
  )
);
arrangementListe.push(
  new Arrangement(
    "4.juni",
    "14:30",
    "Spill opp!",
    "Mastereksamen NTNU fløyte  v/Matthias Lauga"
  )
);
arrangementListe.push(
  new Arrangement(
    "6.juni",
    "13:00",
    "Onsdagskonsert",
    "Barokke treblåserensembler"
  )
);
arrangementListe.push(
  new Arrangement(
    "9.juni",
    "14:00",
    "Juiogat: Joik for folk",
    "En vandring i samisk musikkhistorie ved Lena Jansen"
  )
);

function setup() {

  const MAXANTALL = 30;

  Test.summary("#kvittering");

  // referanse til inputs for antall barn/voksen - må sjekke gyldige verdier
  let alleInputs = Array.from(document.querySelectorAll("#antall input"));

   // ref til html-elementer i appen
  let btnBestill = document.querySelector("#antall button");
  let inpVoksne = document.getElementById("voksen");
  let inpBarn = document.getElementById("barn");
  let divKvittering = document.getElementById("kvittering");
  btnBestill.addEventListener("click", bestilling);
  let frmVelg = document.getElementById("velg");

  // bruker static function på klassen, kan brukes uten instans
  frmVelg.appendChild(Arrangement.overskrift());

  // bruker array funksjonen forEach til å iterere gjennom arrangement
  // klassefunksjonen render() tegner opp linje for arrangement
  arrangementListe.forEach(e => frmVelg.appendChild(e.render()));

  let riktig = true; // sjekk på riktige verdier

  function bestilling(e) {
     // fjerner feilmelding fra alle inputs
    alleInputs.forEach(inp => inp.className = "");
    let inpValgt = document.querySelector("#velg input:checked");

    if (inpValgt) {
      // sjekker at minst en av voksen/barn er gyldig
      let arrangement = inpValgt.value;
      let voksen = Number(inpVoksne.value) || 0;
      let barn = Number(inpBarn.value) || 0;
      if (voksen || barn) {
        // minst en er !== 0
        // sjekker at antall er rimelig
        riktig = true;
        alleInputs.forEach(inp => { let v = Number(inp.value) || 0; if (v > MAXANTALL || v < 0) { riktig = false; inp.classList.add("feil");} });
        if (riktig) {
          divKvittering.innerHTML = visKvittering(arrangement, voksen, barn);
        } else {
          divKvittering.innerHTML = "Antall må være mellom 0 og " + MAXANTALL;
        }

      }
    } else {
      // feilmelding: du må velge et arr ... TODO
    }
  }
}

function visKvittering(arrangement, voksen, barn) {
  let n = voksen + barn;
  let rabatt = "";
  let personer = voksen > 0 && barn > 0 ? `, ${voksen} voksne og ${barn} barn` : "";
  let total = voksen * 100 + barn * 50;
  if (n >= 5) {
    rabatt = ", inklusiv grupperabatt på 20 prosent";
    total *= 0.8;
  }
  return `Du har bestillt ${n} billetter til ${arrangement} ${personer}. Totalprisen er kr ${total} ${rabatt}.`;
}

// automatiske tester
// inngår som en del av testplanen for prosjektet

expect(visKvittering,"hei",0,0).to.be("Du har bestillt 0 billetter til hei . Totalprisen er kr 0 .");
expect(visKvittering,"hei",1,0).to.be("Du har bestillt 1 billetter til hei . Totalprisen er kr 100 .");
expect(visKvittering,"hei",1,1).to.be("Du har bestillt 2 billetter til hei , 1 voksne og 1 barn. Totalprisen er kr 150 .");
expect(visKvittering,"hei",3,3).to.be("Du har bestillt 6 billetter til hei , 3 voksne og 3 barn. Totalprisen er kr 360 , inklusiv grupperabatt på 20 prosent.");

/**
 * I denne løsningen har jeg vist kjennskap til / evne til å bruke:
 *   klasser med klassefunksjoner og static funksjon
 *   bruk av array og array-funksjoner (forEach)
 *   array som inneholder sammensatte typer (en klasse-instans)
 *   funksjoner med parameter
 *   funksjoner styrt av hendelser
 *   betingelser
 *   løkker (foreach)
 */