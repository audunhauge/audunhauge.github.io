// @ts-check
function setup() {
    let imgBilde = document.getElementById("bilde");
    let divOppsummering = document.getElementById("oppsummering");
    let btnNeste = document.getElementById("neste");

    let index = 0;
    let bilder = "b1,b2,b3,b4".split(",");
    let poeng = [0, 0, 0, 0];  // poeng for hvert bilde

    btnNeste.addEventListener("click", nestBilde);


    function show() {
        if (index < bilder.length) {
            let bilde = "../../it1/Sepia/bilder/" + bilder[index] + ".jpg";
            imgBilde.src = bilde;
        } else {
            visOppsummering();
        }
    }

    function nestBilde() {
        let inpTerning = document.querySelector("input:checked");
        if (inpTerning) {  // bruker må velge
            poeng[index] = Number(inpTerning.value);
            index++;
            show();
            inpTerning.checked = false;  // fjerner valg
        }
    }

    function visOppsummering() {
        // må finne ut hvilket bilde du liker best
        // score er lagra i poeng
        let fav;
        let maxScore = Math.max(...poeng);
        for (let i =0; i< bilder.length; i++) {
            if (poeng[i] === maxScore) {
               fav = bilder[i];
               break;
            }
        }
        divOppsummering.innerHTML = "Din favoritt fikk " + maxScore;
        let bilde = "../../it1/Sepia/bilder/" + fav + ".jpg";
        imgBilde.src = bilde;
    }
}