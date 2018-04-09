// @flow

function setup() {
  let aktiv = false;
  let party;  // det partiet som er aktivt (vises,spilles)
  let divHovedside = document.querySelector("#hovedside");
  let piano = document.querySelector("audio");
  let video = document.querySelector("video");
  divHovedside.addEventListener("click", visPresentasjon, true);
  document.addEventListener("click", skjulPresentasjon);

  let partyCode = {
      start: {
        mdg: () => { piano.play(); },
        sp: () => { video.play(); }
      },
      stop: {
        mdg: () => { piano.pause(); } ,
        sp: () => { video.pause(); }
      }
  }

  function visPresentasjon(e) {
    if (e.target.dataset && e.target.dataset.parti) {
      // klikk på et partilogo
      let id = party = e.target.dataset.parti;
      let divParti = document.getElementById(id);
      if (divParti === undefined) {
        console.log("Finner ikke div for ",id);
        return;
      }
      divParti.classList.add("show");
      if (partyCode.start[party]) {
        partyCode.start[party]();   // oppstartskode for visning dette partiet
      }
    }
  }

  function skjulPresentasjon(e) {
    // denne blir trigga av samme klikk som starter presentasjonen
    // ved neste klikk skal presentasjonen stoppes
    if (aktiv) {
      let partiene = Array.from(document.querySelectorAll("#partiene > div"));
      partiene.forEach(e => e.classList.remove("show"));
      aktiv = false;
      if (partyCode.stop[party]) {
        partyCode.stop[party]();   // take-down kode for partiets promo
      }
      party = null;
    } else {
      aktiv = true;
    }
  }
}

