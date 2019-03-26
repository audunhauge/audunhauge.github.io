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
3. Spill av lydfilen Oversetting.mp3 og velg riktig oversettelse:
- Hei, mitt navn er Tom
- Jeg er Tom
- Kjenner du Tom? *
- Når kommer Tom?`;
let linjer = file.split('\n');
console.log(linjer, linjer.length);


function setup() {
    let divQuiz = document.getElementById("quiz");
    let divScore = document.getElementById("score");
    let qtekst = "";
    let i = 0;
    let max = linjer.length;
    for (let linje of linjer) {
        
        let checked = 'checked';
        if ( "123456789".includes(linje.charAt(0))
        ) { 
            i++;
            if (qtekst !== "") {
                qtekst += "</ul></div>";
                checked = '';
            } 
            let [nr,tekst] = linje.split('. ');  // kan begrense til en split, men tid...

            // sjekk om vi har en lydfil og legg til avspiller
            if (tekst.includes("mp3")) {
                tekst = tekst.replace(/(\w+\.mp3)/g, (m,f) => {
                    return `<figure>
                        <figcaption>${m}</figcaption>
                        <audio
                            controls
                            src="${m}">
                                Your browser does not support the
                                <code>audio</code> element.
                        </audio>
                    </figure>`
                });
            }

            qtekst += ` <input data-nr="${i}" style="z-index:${max-i};" type="radio" name="r" id="r${i}" ${checked}>
                        <div class="question">
                          <h4>${tekst}</h4>
                          <ul>`;
        } else {
            let [minus,tekst] = linje.split("- ");  
            let rett = tekst.includes("*");
            let melding = rett ? "Riktig" : "Galt";
            let klass = rett ? "riktig" : "";
            tekst = tekst.replace("*","");
            qtekst += `<li>
            <label for="">${tekst}</label>
            <input class="${klass}" type="checkbox">
            <label class="${klass}" for="">${melding}</label>
            </li>`;
        }
    }
    qtekst += "</ul></div>"
    // legger til knapp for vurdering
    qtekst += ` <input type="radio" name="r" id="r${i+1}">
    <div class="question"><button>Beregn score</button></div>`;
    // vis på skjermen
    divQuiz.innerHTML = qtekst;

    let btnBeregn = document.querySelector("button");
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
        // en bedre løsning som unngår negativ score på en quiz,
        // men følger oppskriften
        // let poeng = Math.max(0, antallRette - feilValgt/3) ;
        let poeng = antallRette - feilValgt;
        divScore.innerHTML = `Du fikk ${poeng.toFixed(2)} av ${total}
        <p>
         Du har ${antallRette} riktige valg (av ${total}).
         <br>Du har ${feilValgt} feil valg.
         <br>Prosentscore er ${(100*poeng/total).toFixed(2)}`;
      }


}