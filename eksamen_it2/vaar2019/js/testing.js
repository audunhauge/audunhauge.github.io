// @ts-check

function setup() {
    Test.summary("#tester");
}

// Funksjonene under er "rene" (pure functions)
// slik at det er lett å lage gode tester

/**
 * 
 * @param {Array} arr en tabell med tall
 * @returns {Number} snitt av tallverdiene i tabellen
 */
function gjennomsnitt(arr) {
    let sum = 0;
    if (arr.length === 0) return sum;
    for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
    }
    return sum / arr.length;
}

// Skal nå teste funksjonen gjennomsnitt

let arr = Array(20).fill(0).map(e => 1000 * Math.random() - 500);
// array med 20 tilfeldige tall
let min = Math.min(...arr);
let max = Math.max(...arr);

expect(gjennomsnitt, arr).is.a("Number");
expect(gjennomsnitt, arr).is.lt(max + 1);
expect(gjennomsnitt, arr).is.gt(min - 1);

expect(gjennomsnitt, [1, 2, 3]).to.be(2);
expect(gjennomsnitt, [-1, 0, 1]).to.be(0);
expect(gjennomsnitt, []).to.be(0);

let a = Math.random();
let b = Math.random();
let c = (a + b) / 2;
expect(gjennomsnitt, [a, b]).message(" Hardly ever fail ", "red").to.be(c);
expect(gjennomsnitt, [0.1, 0.2]).message(" SHOULD ALWAYS FAIL ", "green").to.be(0.15);  // feiler p.g.a avrunding
expect(gjennomsnitt, [0.1, 0.2]).to.approx(0.15);


// en funksjon som lager en nedtrekksliste
/**
 * @param {Object}  tabell      Inneholder verdier som skal brukes i nedtrekk
 * @param {string} valgtNokkel  Nøkkel fra første nedtrekk - fyller ut den andre med verdier fra tabell
 * @returns {string}            Innhold til en select, bruk innerHTML = return
 */

function lagNedtrekk(valgtNokkel, tabell) {
    let s = '';
    if (tabell[valgtNokkel]) {
        let verdier = tabell[valgtNokkel];
        for (let v of verdier) {
            s += `<option>${v}</option>`;
        }
    }
    return s;
}

let tabell = {
    norge: ["Oslo", "Bergen"],
    sverige: ["Karlstad", "Malmø"]
}


let ned = lagNedtrekk("norge", tabell);

expect(tabell,"tabell").is.a("Object");
expect(tabell,"tabell").to.have("norge").is.a("Array");
expect(tabell,"tabell").to.have("sverige").is.a("Array");
expect(ned,"Nedtrekk").is.a("String");
expect(ned.substr(1,4),"Nedtrekk").eq("opti");
expect(ned.length).to.be(44);
