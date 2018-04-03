// @flow

function setup() {
  
  let selVind = document.getElementById("vind");
  let divPropell = document.getElementById("propell");
  let divTre = document.getElementById("tre");
  let divInfo = document.getElementById("info");
  let inpVindstyrke = document.getElementById("vindstyrke");
  let outPower = document.getElementById("power");
  let outWt = document.getElementById("wt");

  let btnBeregn = document.getElementById("beregn");

  selVind.addEventListener("change", vindEndring);
  inpVindstyrke.addEventListener("change", beregnVind);
  btnBeregn.addEventListener("click", beregnWatt);

  let lyd = document.querySelector("audio");
  lyd.pause();

  let lydeffekt = {
    stille: () => lyd.pause(),
    bris: () => lyd.play(),
    kuling: () => lyd.play()
  };

  let info = {
    stille: "det er stille, 0-2m/s",
    bris: "3.4 - 5.4 m/s",
    kuling: "Trær svaier 10.8 -13.8 m/s"
  };

  vindEndring();

  // OPPGAVE 1

  function vindEndring(_) {
    let vind = selVind.value;
    divPropell.className = vind;
    divTre.className = vind;
    divInfo.innerHTML = info[vind];
    lydeffekt[vind]();
  }

  // OPPGAVE 2

  function beregnVind() {
    let styrke = inpVindstyrke.valueAsNumber;
    let grenser = [0, 2.5, 3.4, 5.5, 8, 10.8, 13.9, 15, 100];
    let powerList = [0, 2, 10, 60, 150, 400, 500, 0, 0];
    let vindNavn = "stille,bris,bris,bris,kuling,kuling,kuling".split(",");
    let power, vind;
    // jeg bruker array.findIndex til samme jobben i vind2watt
    // løkka under kan da skrives som
    //   let idx = grenser.findIndex(e => e > +styrke) - 1;
    //   power = powerList[idx] || 0;
    //   vind = vindNavn[idx] || "kuling";
    for (let i = 0; i < grenser.length; i++) {
      let g = grenser[i];
      if (g > styrke) {
        power = powerList[i - 1] || 0;
        vind = vindNavn[i - 1] || "kuling";
        break;
      }
    }
    outPower.value = power;
    selVind.value = vind;
    vindEndring();
    if (power === 0) {
      divPropell.className = "stille";
      // ingen vind - eller over 15m/s
    }
  }

  // OPPGAVE 3

  function beregnWatt() {
    let vindstyrker = Array.from(document.querySelectorAll("input.vind")).map(
      e => e.valueAsNumber || 0
    );
    // henter inn vindstyrke for periodene.
    outWt.value = powerprod(vindstyrker);
  }

  // vis resultat av tester
  Test.summary("#test");
}

/**  rene funksjoner - uten side-effekter */

let powerprod = vindstyrker => {
  let produksjon = vindstyrker.map(e => vind2watt(e) * 6);
  return produksjon.reduce((s, p) => s + p, 0); // summer produksjonen
};

let vind2watt = fart => {
  let grenser = [0, 2.5, 3.4, 5.5, 8, 10.8, 13.9, 15, 100];
  let powerList = [0, 2, 10, 60, 150, 400, 500, 0, 0];
  let idx = grenser.findIndex(e => e > +fart) - 1;
  return powerList[idx] || 0;
};

/** Tester - sjekker at vind2watt virker */


expect(vind2watt,2).to.be(0);
expect(vind2watt,3).to.be(2);
expect(vind2watt,4).to.be(10);
expect(vind2watt,5.5).to.be(60);
expect(vind2watt,7.99).to.be(60);
expect(vind2watt,8).to.be(150);
expect(powerprod,[0,0,0,0]).to.be(0);
expect(powerprod,[3,3,3,3]).to.be(2*4*6);
expect(powerprod,[3,4,6,8]).to.be(2*6+10*6+60*6+150*6);
