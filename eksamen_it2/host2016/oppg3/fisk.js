// @ts-check

const bestillingTabell = [ ];



const g = (id) => document.getElementById(id);
const v = (element)  => element.value;
const n = (element) => Number(element.value);

function setup() {
  const inpUkenr = g("ukenr");
  const inpAntallm = g("antallm");
  const inpBarn = g("barn");
  const inpUngdom = g("ungdom");
  const inpVoksne = g("voksne");
  const btnLagre = g("lagre");

  btnLagre.addEventListener("click", lagreBestilling);

}