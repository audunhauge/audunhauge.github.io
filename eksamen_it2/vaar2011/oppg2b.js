function setup() {


    Test.summary();


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
expect(tegnSoyler,[]).to.have("length").eq(0);
expect(tegnSoyler, [1, 2, 3]).to.have("2.innerHTML").eq("3");