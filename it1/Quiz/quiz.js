// @ts-check

function setup() {
  let divScore = document.getElementById("score");
  let btnBeregn = document.querySelector("button");
  btnBeregn.addEventListener("click", poeng);

  /**
   * Beregner poeng - +1 poeng for hvert riktig valg, -1/3 for feil
   * Minuspoeng er nødvendig for å unngå: kryss på alle => full score
   */
  function poeng() {
    // merk : alle input.riktig er checkbox -
    // men ikke alle input:checked (en er radio)
    let fasit = Array.from(document.querySelectorAll("input.riktig"));
    let riktigValgt = Array.from(document.querySelectorAll("input.riktig:checked"));
    let alleValgt = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'));
    let total = fasit.length;
    let antallRette = riktigValgt.length;
    let feilValgt = alleValgt.length - riktigValgt.length;
    let poeng = Math.max(0, antallRette - feilValgt/3) ;
    divScore.innerHTML = `Du fikk ${poeng.toFixed(2)} av ${total}
    <p>
     Du har ${antallRette} riktige valg (av ${total}).
     <br>Du har ${feilValgt} feil valg.
     <br>Prosentscore er ${(100*poeng/total).toFixed(2)}`;
  }
}
