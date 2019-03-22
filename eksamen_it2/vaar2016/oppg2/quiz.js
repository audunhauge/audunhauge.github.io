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
<input type="radio" name="r" id="r2">
<div class="question">
            <h4>Hvilke land er med i Norden</h4>
            <ul>
                <li>
                    <label for="">Holland</label>
                    <input type="checkbox">
                    <label class="riktig" for="">Riktig</label>
                </li>
*/

function setup() {
    let divQuiz = document.getElementById("quiz");
    let qtekst = "";
    let i = 0;
    for (let linje of linjer) {
        i++;
        if ( "123456789".includes(linje.charAt(0))
        ) {
            if (qtekst !== "") {
                qtekst += "</ul></div>";
            }
            let [nr,tekst] = linje.split('. ');  // kan begrense til ett klipp, men tid...
            qtekst += ` <input type="radio" name="r" id="r${i}">
                        <div class="question">
                          <h4>${tekst}</h4>
                          <ul>`;
        } else {
            let [minus,tekst] = linje.split("- ");  
            qtekst += `<li>
            <label for="">${tekst}</label>
            <input type="checkbox">
            <label class="riktig" for="">Riktig</label>
            </li>`;
            // det må være et alternativ
            // legg till alternativet
        }
    }
    qtekst += "</ul></div>";
    // vis på skjermen
    divQuiz.innerHTML = qtekst;

}