// @flow

function setup() {
  // vis test-data på sida
  document.getElementById("test").innerHTML =
    "<h1>Test-data</h1>" + testData.join("");

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

const testData = []; // vises på websida

assert(vind2watt(2) === 0, "vind2watt 2 = 0");
assert(vind2watt(3) === 2, "vind2watt 3 = 2");
assert(vind2watt(4) === 10, "vind2watt 4 = 10");
assert(vind2watt(5.5) === 60, "vind2watt 5.5 = 60");
assert(vind2watt(7.99) === 60, "vind2watt 7.99 = 60");
assert(vind2watt(8) === 150, "vind2watt 8 = 150");

/** sjekker at powerprod virker */
assert(powerprod([0, 0, 0, 0]) === 0, "powerprod ingen vind");
assert(powerprod([3, 3, 3, 3]) === 2 * 4 * 6, "powerprod 3m/s");
assert(
  powerprod([3, 4, 6, 8]) === 2 * 6 + 10 * 6 + 60 * 6 + 150 * 6,
  "powerprod 3,4,6,8m/s"
);
assert(
  powerprod([6, 8, 11, 14]) === 60 * 6 + 150 * 6 + 400 * 6 + 500 * 6,
  "powerprod 6,8,11,14m/s"
);
assert(powerprod([1, 2, 2, 24]) === 0, "powerprod 1,2,2,24m/s");

function assert(test, msg) {
  if (test) {
    testData.push(`<div><span class="ok">PASSED</span> ${msg}</div>`);
    console.log("%cPASSED", "color:green", msg);
  } else {
    testData.push(`<div><span class="nope">FAILED</span> ${msg}</div>`);
    console.log("%cFAILED", "color:red", msg);
  }
}
