// @ts-check

function setup() {
    let inpAlder = document.getElementById("alder");
    let inpAntall = document.getElementById("antall");
    let btnLagre = document.getElementById("lagre");
    let divOversikt = document.getElementById("oversikt");

    btnLagre.addEventListener("click", lagre);

    function lagre(e) {
        let antall = inpAntall.valueAsNumber || 0;
        let alder = inpAlder.valueAsNumber || 0;
        if (antall > 7 || antall < 1) {
            alert("Maks en uke, antall dager < 8, min 1 dag.");
            return;
        }
        if (alder < 1 || alder > 130) {
            alert("Ugyldig alder");
            return;
        }
        let maks = 1000;
        let pris = 200;
        let rabatt = 0;
        if (alder < 13) {
            maks = 500;
            pris = 100;
        }
        let total = antall * pris;
        if (total > maks) {
            rabatt = total - maks;
            total = maks;
        }
        let melding = `Du må betale ${total} kr for kortet.`;
        if (rabatt > 0) {
            melding += "Du får rabatt på " + rabatt + " kr."
        }
        divOversikt.innerHTML = melding;

    }

}

// tegner diagram med uml
/*
@startuml
:start;

partition Oppstart {
	:lag koblinger til skjema<
    :lag eventlistener;
}
partition Event-loop {
    :vent på lagring (knapp);
    :les antall|
    note right: antall = antall dager
    :les alder|
    : max = 1000;
    if (gyldig) then (ja)
      if (alder > 16) then (ja)
        :pris = 200;
      else (nei)
        :pris = 100;
        :max = 500;
      endif
      : total = pris*antall;
      : rabatt = 0;
      if (total > max) then (ja)
        :rabatt = total - max;
        :total = max;
      endif
      :skriv pris|
      if (rabatt > 0) then (ja)
        :skriv rabatt|
      endif
    else (nei)
      :alert ugyldig;
      note right: sjekker alder og antall dager
    endif
}

:end;
@enduml

*/