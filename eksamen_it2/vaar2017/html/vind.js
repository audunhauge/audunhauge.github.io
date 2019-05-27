// @ts-check

function setup() {
    Test.summary("#tester");
}

// Funksjonene under er "rene" (pure functions)
// slik at det er lett å lage gode tester


/**
 * Konverter vindfart til watt
 * Bruker en tabell over grenser (fra oppgaven)
* @param {number} fart vindfart i m/s
* @returns {number} produsert watt for gitt vindstyrke
 */
function watt(fart) {
    let grenser = [0, 2.5, 3.4, 5.5, 8, 10.8, 13.9, 15, 100];
    let powerList = [0, 2, 10, 60, 150, 400, 500, 0, 0];
    let idx = grenser.findIndex(e => e > +fart) - 1;
    return powerList[idx] || 0;
}

let w = Math.random()*1000;

expect(watt,w).is.a("Number");
expect(watt,w).is.lt(501);
expect(watt,w).is.gt(-1);

expect(watt,1.2).to.be(0);
expect(watt,3).to.be(2);
expect(watt,4).to.be(10);
expect(watt,5.5).to.be(60);
expect(watt,7.99).to.be(60);
expect(watt,8).to.be(150);
expect(watt,14.99).to.be(500);
expect(watt,15).to.be(0);
expect(watt,200).to.be(0);
