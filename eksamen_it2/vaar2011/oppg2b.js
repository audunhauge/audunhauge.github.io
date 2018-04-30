function setup() {

    let ingenValgt = true;
    let klikkTeller = 0;

    const treVolum = {
        furu: [12, 16, 20, 33, 44, 56],
        gran: [13, 17, 25, 31, 48, 66],
        lauv: [2, 3, 4, 5, 6, 7]
    }

    let divSoyler = document.getElementById("soyler");
    let divOppsummering = document.getElementById("oppsummering");
    let inpTre = document.getElementById("treslag");
    inpTre.addEventListener("change", visVerdier);

    function visVerdier(e) {
        let tre = inpTre.value;
        let soyler = tegnSoyler(treVolum[tre], klikkMeg);
        divSoyler.innerHTML = "";
        for (let s of soyler) {
            divSoyler.appendChild(s);
        }
    }

    function klikkMeg(e) {
        e.target.classList.add("valgt");
        e.target.dataset.tall = klikkTeller;
        klikkTeller++;
        let soyler = Array.from(document.querySelectorAll("#soyler > div"));
        let gamle = soyler.filter(e => +e.dataset.tall === klikkTeller - 3);
        gamle.forEach(e => e.classList.remove("valgt"));
        let valgte = soyler.filter(e => e.classList.contains("valgt"));
        if (valgte.length === 2) {
            let oppsum = lagOppsummering(valgte);
            divOppsummering.innerHTML = `
            Endringen er på ${oppsum.diff}
            <br>Det tilsvarer ${(oppsum.prosent*100).toFixed(1)}`;
        }
    }

    Test.summary();

}

/**
 * Lager en oppsumering av forskjell i volum for to år
 * @param {Array} valgte 
 */
function lagOppsummering(valgte) {
    let [a, b] = valgte;
    let diff = b.dataset.volum - a.dataset.volum;
    let prosent = diff / a.dataset.volum;
    return { diff, prosent };
}

expect(lagOppsummering, [
    {dataset:{volum:12}},
    {dataset:{volum:12}}
]).to.have("diff").eq(0);
expect(lagOppsummering, [
    {dataset:{volum:12}},
    {dataset:{volum:22}}
]).to.have("diff").eq(10);
expect(lagOppsummering, [
    {dataset:{volum:1}},
    {dataset:{volum:2}}
]).to.have("prosent").eq(1);
expect(lagOppsummering, [
    {dataset:{volum:8}},
    {dataset:{volum:10}}
]).to.have("prosent").eq(0.25);


/**
* Tegner søyler for tallverdier
* @param {Array} verdier inneholder tall som vi skal lage søyler av
* @returns {Array} array med søyle-diver
*/
function tegnSoyler(verdier, noenKlikkerMeg) {
    const aarsTall = [1915, 1940, 1950, 1980, 1990, 2000];
    let ret = [];
    //for (let v of verdier) {
    for (let i = 0; i < verdier.length; i++) {
        let v = verdier[i];
        let aar = aarsTall[i];
        let s = document.createElement("div");
        s.addEventListener("click", noenKlikkerMeg);
        s.className = "soyle";
        s.dataset.aar = aar;
        s.dataset.volum = v;
        s.innerHTML = aar + " " + v + " m<sup>3</sup>";
        s.style.width = (v * 3 + 140) + "px";
        ret.push(s);
    }
    return ret;
}

expect(tegnSoyler, []).to.have("length").eq(0);
expect(tegnSoyler, [1, 2]).to.have("length").eq(2);
expect(tegnSoyler, [1, 2]).to.have("0.className").eq("soyle");
expect(tegnSoyler, [1, 2]).to.have("0.style.width").eq("143px");
expect(tegnSoyler, [1, 2]).to.have("1.style.width").eq("146px");
