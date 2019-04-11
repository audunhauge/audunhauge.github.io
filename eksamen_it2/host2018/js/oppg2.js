// @ts-check

// alle hytter har et bilde med navn.jpg
// de har også galleri med navn01.jpg .. navnNN.jpg
// siden dette ikke er på en server må vi lagre
// antall bilder for hver hytte (default = 2)
// dvs alle hytter må ha minst to galleribilder
// FORDI: browser-js kan ikke lese en mappe og finne ut antall bilder 
// på en server kan vi finne antall bilder pr hytte ved å lese mappen
// (nodejs på server)


function setup() {
    // lager koblinger til html (dom)
    let divsInfo = Array.from(document.querySelectorAll(".info"));
    let divMeny = document.getElementById("meny");

    // alle klikk på menybildet sjekkes
    divMeny.addEventListener("click", visInfo);

    function visInfo(e) {
        let t = e.target;
        divsInfo.forEach(div => div.classList.remove("show"));
        // alle klikk skjuler info 
        // klikk på andre ting enn granbo eller granstua ignoreres
        // bare de to div-ene har class=tags
        if (t.classList.contains("tags")) {
            let id = t.id; // Granbo eller Granstua
            let divInf = document.getElementById(id + "info");
            divInf.classList.add("show");
            
            // klikk i info-div viser neste bilde
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