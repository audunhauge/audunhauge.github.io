// @ts-check
function setup() {
  let inpSnitt = document.getElementById("snitt");
  let inpGrense = document.getElementById("grense");
  let inpTillegg = document.getElementById("tillegg");
  let divResultat = document.getElementById("resultat");
  let btnBeregn = document.getElementById("beregn");

  btnBeregn.addEventListener("click", beregn);

  function beregn() {
      let snitt = inpSnitt.valueAsNumber  || 0;
      let grense = inpGrense.valueAsNumber || 0;
      let tillegg = inpTillegg.valueAsNumber || 0;
      let poeng = snitt * 10 + tillegg;

      let ikke = poeng < grense ? 'ikke' : '';
      divResultat.innerHTML = `
      Du har ${poeng}. Det er ${ikke} nok til å komme inn.
      `;
  }
}