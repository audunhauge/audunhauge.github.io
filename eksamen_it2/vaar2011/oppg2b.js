// @ts-check
function setup() {

    const aar = [1915,1950,1970,1980,1990,2000];

    const treVolum = {
        furu: [20, 31, 53, 89, 102, 117],
        gran: [23, 39, 72, 89, 92, 99],
        lauvtre: [4, 6, 8, 12, 15, 18],
    }

    let divSoyler = document.getElementById("soyler");
    let inpTreslag = document.querySelector("#tre");
    let inpAar1 = document.querySelector("#aar1");
    let inpAar2 = document.querySelector("#aar2");
    let btnBeregn = document.getElementById("beregn");

    inpTreslag.addEventListener("change", visSoyler);
    btnBeregn.addEventListener("click", beregn);

    function beregn(e) {
       let tre = inpTreslag.value || "";
       let a = Number(inpAar1.value) || 0;
       let b = Number(inpAar2.value) || 0;
       let ordnet = [a,b].sort((a,b) => a-b);  // sorterer årstallene
       let [A,B] = ordnet;  // A <= B
       if (A === B || A*B === 0 || tre === "") {
           alert("velg to forskjellige årstall og et treslag");
           return;
       }
       let idxA = aar.indexOf(A);
       let idxB = aar.indexOf(B);
       let v1 = treVolum[tre][idxA];
       let v2 = treVolum[tre][idxB];
       let {diff,prosent} = okning(v1,v2);
       document.getElementById("resultat").innerHTML = `
          Økningen er på ${diff}, tilsvarer ${(100*prosent).toFixed(2)} %
       `;

    }


    function visSoyler(e) {
        divSoyler.innerHTML = "";
        let tre = inpTreslag.value;
        let soylene = tegnSoyler(treVolum[tre] || []);
        soylene.forEach(s => divSoyler.appendChild(s));
    }

    Test.summary();
}

/**
 * Funksjonene under er "pure", dvs verdien de gir tilbake er bare
 * avhengig av parametrene som sendes til funksjonene - og de har
 * ingen effekt på omgivelsene (side effects).
 * Slike funksjoner er lettere å teste enn funksjoner som ikke oppfyller
 * disse betingelsene.
 */


/**
 * Beregner differanse og økning for to tall
 * @param {number} a 
 * @param {number} b 
 * @returns {diff,prosent} differanse og prosentvis økning (pfaktor)
 */
function okning(a,b) {
   let diff = b-a;
   let prosent = diff/a;
   return {diff,prosent};
}

/**
* Tegner søyler for tallverdier
* @param {Array} verdier inneholder tall som vi skal lage søyler av
* @returns {Array} array med søyle-diver
*/
function tegnSoyler(verdier) {
    let ret = [];
    for (let v of verdier) {
        let s = document.createElement("div");
        s.className = "soyle";
        s.style.width = (22 + 2 * v) + "px";
        s.innerHTML = v;
        ret.push(s);
    }
    return ret;
}

expect(tegnSoyler, [1, 2, 3]).to.have("length").eq(3);
expect(tegnSoyler, [1, 2, 3]).to.have("0.style.width").eq("24px");
expect(tegnSoyler, [1, 2, 3]).to.have("2.className").eq("soyle");
expect(tegnSoyler, []).to.have("length").eq(0);
expect(tegnSoyler, [1, 2, 3]).to.have("2.innerHTML").eq("3");

expect(okning,1,2).to.have("diff").eq(1);
expect(okning,1,2).to.have("prosent").eq(1);
expect(okning,100,150).to.have("diff").eq(50);
expect(okning,100,150).to.have("prosent").eq(0.5);