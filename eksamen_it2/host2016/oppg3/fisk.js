// @ts-check


// tar i bruk en klasse bare for å illustrere kjennskap til klasser,objekter og arv.
// arv kommer ikke inn her - passer ikke til oppgaven
class Bestilling {
  constructor(ukenr,antallm,barn,ungdom,voksne) {
    this.ukenr = ukenr;
    this.antallm = antallm;
    this.barn = barn;
    this.ungdom = ungdom;
    this.voksne = voksne;
  }
}

const bestillingTabell = [ ];



const g = (id) => document.getElementById(id);
const v = (element)  => element.value;
const n = (element) => Number(element.value) || 0;

function setup() {
  const divVisning = g("visning")
  const inpUkenr = g("ukenr");
  const inpAntallm = g("antallm");
  const inpBarn = g("barn");
  const inpUngdom = g("ungdom");
  const inpVoksne = g("voksne");
  const btnLagre = g("lagre");

  btnLagre.addEventListener("click", lagreBestilling);

  function lagreBestilling() {
    const ukenr = n(inpUkenr);
    const antallm = n(inpAntallm);
    const barn = n(inpBarn);
    const ungdom = n(inpUngdom);
    const voksne = n(inpVoksne);
    const b = new Bestilling(ukenr,antallm,barn,ungdom,voksne);
    bestillingTabell.push(b);
    divVisning.innerHTML = "";  // begynner med blanke ark
    let innhold = "";  // dette er visningen av tabellen
    for (let b of bestillingTabell) {
      innhold += `${b.ukenr} ${b.antallm} ${b.barn} ${b.ungdom} ${b.voksne}<br>`;
    }
  }

}