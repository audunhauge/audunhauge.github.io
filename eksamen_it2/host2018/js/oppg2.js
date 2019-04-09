// @ts-check

// alle hytter har et bilde med navn.jpg
// de har også galleri med navn01.jpg .. navnNN.jpg
// siden dette ikke er på en server må vi lagre
// antall bilder for hver hytte (default = 2)
// dvs alle hytter må ha minst to galleribilder


function setup() {
    let divsInfo = Array.from(document.querySelectorAll(".info"));
    let divMeny = document.getElementById("meny");

    divMeny.addEventListener("click", visInfo);

    function visInfo(e) {
        let t = e.target;
        divsInfo.forEach(div => div.classList.remove("show"));
        if (t.classList.contains("tags")) {
            let id = t.id; // bo eller stua
            let divInf = document.getElementById(id + "info");
            divInf.classList.add("show");
            divInf.addEventListener("click", next);
            let hytte = hytter.get(id);
            divInf.innerHTML = hytte.vis();
            divInf.classList.add("nr01");

            function next(e) {
                // ved klikk på bakgrunn vises neste bilde
                // går i sirkel
                const ANTALL = 2;  // antall bilder
                divInf.className = "info show";
                let nr = Number(divInf.dataset.nr) % ANTALL + 1;
                let strNr = String(nr);
                divInf.dataset.nr = strNr;
                let klass = "nr" + "0".repeat(ANTALL - strNr.length) + strNr;
                divInf.classList.add(klass);
            }
        }
    }
}