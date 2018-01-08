// @ts-check

function setup() {
   /* små bilder bruker kan klikke på */
   let divPeter = document.querySelector("#ex > div");
   let divRoma = document.querySelector("#ex div:nth-child(2)");
   let divNuYok = document.querySelector("#ex div:nth-child(3)");

   /* div med små bilder */
   let divEx = document.getElementById("ex");

   /* min-apper for hver beskrevet oppgave */
   let divStorPeter = document.getElementById("storpeter");
   let divStorNuYok = document.getElementById("nuyok");
   let divStorRoma = document.getElementById("roma");

    /*  vise stort bilde av petersburg */
    divPeter.addEventListener("click", visStorPeter);
    divStorPeter.addEventListener("click", visLillePeter);

    function visStorPeter(e) {
       divEx.classList.add("hidden");
       divStorPeter.classList.remove("hidden");
    }

    function visLillePeter(e) {
       divEx.classList.remove("hidden");
       divStorPeter.classList.add("hidden");
    }

    /* vise video av roma */
    divRoma.addEventListener("click", visFilm);
    divStorRoma.addEventListener("click", visLilleRoma);

    function visFilm(e) {
       divEx.classList.add("hidden");
       divStorRoma.classList.remove("hidden");
       let vid = document.querySelector("video");
       vid.play();
    }

    function visLilleRoma(e) {
        let vid = document.querySelector("video");
        vid.pause();
       divEx.classList.remove("hidden");
       divStorRoma.classList.add("hidden");
    }
    
}