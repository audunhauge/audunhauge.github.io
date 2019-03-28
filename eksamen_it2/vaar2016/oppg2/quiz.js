// @ts-check

/**
 * Burde egenlig lese filen med spørsmål
 * med fetch() ...
 * let url = "sporsmaal.json";
   fetch(url).then(r => r.json())
  .then(data => behandle(data))
  .catch(e => console.log("Dette virka ikke."))
 * men dette fungerer bare dersom siden leveres av en webserver
 * Siden jeg tester på filsystemet så "faker" jeg dette med en 
 * variable med resultatet av å ha lest filen.
 */
let file = 
`1. Hva betyr ordet Where?
- Hvor *
- Vi er
- Var
- Hvorfor
2. Hvilke(t) ord kan legges til her?  How are…
- you *
- John doing?
- things *
- the house
- the wife
3. Spill av lydfilen «Oversetting.mp3» og velg riktig oversettelse:
- Hei, mitt navn er Tom
- Jeg er Tom
- Kjenner du Tom? *
- Når kommer Tom?`;
let linjer = file.split('\n');
console.log(linjer, linjer.length);

/*
STØTTE FOR FLERE SPRÅK:
For å støtte flere språk vil jeg legge til en 
< select > og bruke valgt verdi til å lese riktig
fil med spørsmål - enkelt å implementere med denne løsningen
  flytter 
    let linjer = file.split('\n');
    console.log(linjer, linjer.length);
  inn i eventlistener for change på select,
  lager en Map av språkfiler
    let spraak = new Map()
    spraak.set("engelsk", fil1);
    spraak.set("tysk", fil2);
  slår opp i spraak med verdi fra select
  let file = spraak.get(valgt)
  -- nå kommer linjer = file.split ...
*/

function setup() {
    let divQuiz = document.getElementById("quiz");
    let divScore = document.getElementById("score");
    let btnBeregn = document.getElementById("beregn");
    let qtekst = "";
    let i = 0;
    for (let linje of linjer) {
        i++;
        if ( "123456789".includes(linje.charAt(0))
        ) {
            let checked = "checked";
            if (qtekst !== "") {
                qtekst += "</ul></div>";
                checked = "";
            }
            let [nr,tekst] = linje.split('. ');  // kan begrense til ett klipp, men tid...
            qtekst += ` 
                        <div class="question">
                          <h4>${tekst}</h4>
                          <ul>`;
        } else {
            let [minus,tekst] = linje.split("- ");  
            let klasse = "";
            let melding = "Galt";
            if (tekst.includes("*")) {
                tekst = tekst.replace("*","");
                klasse = "riktig";
                melding = "Riktig";
            }
            qtekst += `<li>
            <label for="">${tekst}</label>
            <input class="${klasse}" type="checkbox">
            <label class="${klasse}" for="">${melding}</label>
            </li>`;
            // det må være et alternativ
            // legg till alternativet
        }
    }
    qtekst += "</ul></div>";
    // vis på skjermen
    
    divQuiz.innerHTML = qtekst;

    btnBeregn.addEventListener("click", poeng);

    function poeng() {
        // merk : alle input.riktig er checkbox -
        // men ikke alle input:checked (en er radio)
        let fasit = Array.from(document.querySelectorAll("input.riktig"));
        let riktigValgt = Array.from(document.querySelectorAll("input.riktig:checked"));
        let alleValgt = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'));
        let total = fasit.length;
        let antallRette = riktigValgt.length;
        let feilValgt = alleValgt.length - riktigValgt.length;
        let poeng = antallRette - feilValgt ;
        divScore.innerHTML = `Du fikk ${poeng.toFixed(2)} av ${total}
        <p>
         Du har ${antallRette} riktige valg (av ${total}).
         <br>Du har ${feilValgt} feil valg.
         <br>Prosentscore er ${(100*poeng/total).toFixed(2)}`;
      }

}