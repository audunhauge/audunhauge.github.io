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
    const grenser = [
       [1.6, 0],
       [3.4, 2]
    ];
    for (let [g,w] of grenser) {
        if (fart < g) return w;
    }
    for (let i=0; i<grenser.length; i++) {
        let linje = grenser[i];
        let g = linje[0];
        let w = linje[1];
        if (fart < g) return w;
    }
    return 0;
}
expect(watt,1.2).to.be(0);
expect(watt,3).to.be(2);
expect(watt,4).to.be(10);
expect(watt,5.5).to.be(60);
expect(watt,7.99).to.be(60);
expect(watt,8).to.be(150);

