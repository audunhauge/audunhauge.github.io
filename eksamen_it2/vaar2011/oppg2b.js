// @ts-check
function setup() {

    let ingenValgt = true;
    let klikkTeller = 0;

    const treVolum = {
        furu: [12, 16, 20, 33, 44, 56],
        gran: [13, 17, 25, 31, 48, 66],
        lauv: [6, 3, 4, 5, 6, 7]
    }

    const aarsTall = [1915, 1940, 1950, 1980, 1990, 2000];

    let divSoyler = document.getElementById("soyler");
    let divOppsummering = document.getElementById("oppsummering");
    let inpTre = document.getElementById("treslag");
    inpTre.addEventListener("change", visVerdier);

    function visVerdier(e) {
        divOppsummering.innerHTML = "";  // fjerner forrige oppsummering
        let tre = inpTre.value;
        let soyler = tegnSoyler(treVolum[tre],aarsTall, klikkMeg);
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
            let [a,b] = valgte; // trenger årstall fra søylene
            let oppsum = lagOppsummering(valgte);
            let okmink = oppsum.diff >= 0 ? "økning" : "nedgang";
            divOppsummering.innerHTML = `
            Fra ${a.dataset.aar} til ${b.dataset.aar} er
            endringen på ${oppsum.diff} kubikkmeter.
            <br>Det tilsvarer en ${okmink} på ${(oppsum.prosent*100).toFixed(1)} %`;
        }
    }

    Test.summary("#test");
}



/**
 * Lager en oppsumering av forskjell i volum for to år
 * @param {Array} valgte 
 * @returns { {diff:number, prosent:number} }
 */
function lagOppsummering(valgte) {
    let [a, b] = valgte;
    let diff = b.dataset.volum - a.dataset.volum;
    let prosent = Math.abs(diff) / a.dataset.volum;
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
    {dataset:{volum:9}},
    {dataset:{volum:12}}
]).to.have("prosent").approx(0.33,0.01);
expect(lagOppsummering, [
    {dataset:{volum:8}},
    {dataset:{volum:10}}
]).to.have("prosent").eq(0.25);



/**
* Tegner søyler for tallverdier
* @param {Array} verdier inneholder tall som bestemmer bredden til hver søyle
* @param {Array} aarsTall ledetekst (årstall) for søylene
* @param {EventHandlerNonNull} noenKlikkerMeg event-handler for klikk på søylen
* @returns {Array} array med søyle-diver
*/
function tegnSoyler(verdier, aarsTall, noenKlikkerMeg) {
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
        s.innerHTML =  v + " m<sup>3</sup>";
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
expect(tegnSoyler, [1, 2, 3]).to.have("length").eq(3);