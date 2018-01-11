// @ts-check

function setup() {
  /* små bilder bruker kan klikke på */
  let divPeter = document.querySelector("#ex > div");
  let divRoma = document.querySelector("#ex div:nth-child(2)");
  let divNuYok = document.querySelector("#ex div:nth-child(3)");

  /* div med små bilder */
  let divEx = document.getElementById("ex");

  /******* mini-apper for hver beskrevet oppgave *********/

  /**  vis stor peter */
  let divStorPeter = document.getElementById("storpeter");

  /** vis quiz om newyork */
  let divStorNuYok = document.getElementById("nuyok");
  let btnNewTilbake = divStorNuYok.querySelector("button");

  /** spill av video om roma */
  let divStorRoma = document.getElementById("roma");
  let btnRomaTilbake = divStorRoma.querySelector("button");

  /********  quiz om bilde av new york ***********/
  divNuYok.addEventListener("click", quiz);
  btnNewTilbake.addEventListener("click", visLilleYork);

  function quiz(e) {
    divEx.classList.add("hidden");
    divStorNuYok.classList.remove("hidden");
  }

  function visLilleYork(e) {
    divEx.classList.remove("hidden");
    divStorNuYok.classList.add("hidden");
  }

  let selQuiz = divStorNuYok.querySelector("select");
  selQuiz.addEventListener("change", sjekk);

  function sjekk(e) {
    let spanRett = divStorNuYok.querySelector("div:nth-of-type(1)");
    let spanGalt = divStorNuYok.querySelector("div:nth-of-type(2)");
    spanGalt.classList.add("hidden");
    spanRett.classList.add("hidden");
    // legger på en delay før vurdering vises
    // slik at en får inntrykk av av svaret blir vurdert
    // spesielt viktig dersom en velger gale svar etterhverandre
    setTimeout(() => {
      let v = selQuiz.value;
      if (v === "1") {
        spanRett.classList.remove("hidden");
      }
      // ikke else - dersom ingen av 0,1 da vises ingen melding
      // skjer dersom navn ikke valgt
      if (v === "0") {
        spanGalt.classList.remove("hidden");
      }
    }, 400);
  }

  /*************  vise stort bilde av petersburg ************/
  divPeter.addEventListener("click", visStorPeter);
  divStorPeter.addEventListener("click", visLillePeter);
  // ikke egen knapp - da det ikke finnes andre interaktive elementer
  // før eller siden klikker alle på skjermen ....

  function visStorPeter(e) {
    divEx.classList.add("hidden");
    divStorPeter.classList.remove("hidden");
  }

  function visLillePeter(e) {
    divEx.classList.remove("hidden");
    divStorPeter.classList.add("hidden");
  }

  /************* vise video av roma ********** */
  divRoma.addEventListener("click", visFilm);
  btnRomaTilbake.addEventListener("click", visLilleRoma);

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
