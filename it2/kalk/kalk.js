// @ts-check

function setup() {
    let divTallene = document.getElementById("tallene");
    let tallKnapper = Array.from(divTallene.querySelectorAll("div.tall"));
    for (let i=0; i<tallKnapper.length; i++) {
        let knapp = tallKnapper[9-i];
        knapp.innerHTML = String(i);
    }
}