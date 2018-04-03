// @flow

function setup() {
  let telling = new ValgTelling(); // avgitte stemmer
  // Alle klasser er definert i Passord.js
  // Burde ha en fil pr klasse (med samme navn som klassen) men forenkler
  // og har en fil med alle klasser - navnet er Passord.js  - en levning av tanken "en klasse pr fil"
  // Siste versjon av chrome støtter Moduler, kan da laste klassefilene som vist under
  //        let {ValgTelling, PassordListe} = import("./Passord.js");
  // Ulempen er at da må filene serves (kan ikke testes rett fra filsystemet)

  // data fra tidligere valg
  // trengs for å vise endring i prosentpoeng
  let partiene = (
    "raudt:3.7,sv:5.0,a:23.0,sp:4.2,mdg:3.8" +
    ",krf:2.8,v:6.7,h:28.2,frp:15.6,pir:4.3"
  ).split(",");

  let divLogin = document.getElementById("login");
  let divVotering = document.getElementById("votering");
  let divResultat = document.getElementById("resultat");
  let divMelding = document.getElementById("melding");
  let btnLogin = document.getElementById("dologin");
  let btnVis = document.getElementById("vis");
  let btnVoter = document.getElementById("stem");
  let btnBekreftelse = document.getElementById("bekreftelse");
  let tabel = document.querySelector("#compare > tbody");

  btnLogin.addEventListener("click", sjekkLogin);
  btnVoter.addEventListener("click", stemmer);
  btnBekreftelse.addEventListener("click", avgjort);
  btnVis.addEventListener("click", visResultat);

  let parti; // brukerens valg - er i scope for stemmer() og avgjort()

  let divBekreft = document.getElementById("bekreft");
  let divAvgjort = document.getElementById("avgjort");

  function sjekkLogin(e) {
    divResultat.classList.add("hidden");
    divMelding.classList.remove("fade");

    void divMelding.offsetLeft;
    // denne er med for å trigge en reflow
    // slik at animasjonen kjøres på nytt neste gang

    let plain = document.getElementById("pwd").value;
    plist.test(plain).then(valid => {
      if (valid) {
        // godkjent passord - merk at godkjente passord er brukt opp
        divLogin.classList.add("hidden");
        divVotering.classList.remove("hidden");
      } else {
        divMelding.innerHTML = "Ugyldig passord - prøv igjen.";
        divMelding.classList.add("fade");
      }
    });
  }

  function stemmer(e) {
    divBekreft.classList.remove("hidden");
    parti = document.getElementById("valg").value;
    document.getElementById("valgt").innerHTML = parti;
  }

  /**
   * Viser hva du valgte - forsvinner etter ~ 1s
   * Går tilbake til innlogging
   * eller til oppsummering
   * Det var nevnt en knapp for å vise resultat
   * Jeg har droppa den og viser resultat med en gang alle har stemt
   */
  function avgjort() {
    btnVis.disabled = false;
    telling.velg(parti);
    console.dir(stemmer);
    divAvgjort.classList.remove("hidden");
    document.getElementById("dittParti").innerHTML = parti;
    if (plist.liste.length === 0) {
      // stemming over
      setTimeout(_ => {
        visResultat();
      }, 1000);
    } else // flere kan stemme
      setTimeout(_ => {
        divVotering.classList.add("hidden");
        divLogin.classList.remove("hidden");
        divBekreft.classList.add("hidden");
        divAvgjort.classList.add("hidden");
        divMelding.innerHTML = "";
      }, 1200);
  }

  function visResultat() {
    divVotering.classList.add("hidden");
    divBekreft.classList.add("hidden");
    divAvgjort.classList.add("hidden");
    divMelding.innerHTML = "";
    divResultat.classList.remove("hidden");
    let slik = telling.resultat();
    tabel.innerHTML = "";
    document.getElementById("results").innerHTML = `Alle stemmer avgitt.
      Resultatene ble <ul>${slik}</ul>
      `;

    telling.sammenlikning(tabel, partiene);
  }
}

// denne koden som genererer passord tenker vi kjøres
// separat fra prosessen som logger inn.
// da kan lista med "plaintexst" passord slettes
// og vi beholder bare sha256 digest verdiene
// Jeg kunne lagra disse i localStorage for å simulere
// dette - men det tar for lang tid å sette opp

let plist = new PassordListe();
for (let i = 1; i < 11; i++) {
  let s = "" + i;
  let plain = "Passord" + ("000" + s).slice(-3);
  console.log(plain);
  plist.add(plain);
}
