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
  const btnBeregn = g("beregn");

  btnLagre.addEventListener("click", lagreBestilling);
  btnBeregn.addEventListener("click", beregnForbruk);

  function lagreBestilling() {
    const ukenr = n(inpUkenr);
    const antallm = n(inpAntallm);
    const barn = n(inpBarn);
    const ungdom = n(inpUngdom);
    const voksne = n(inpVoksne);
    const b = new Bestilling(ukenr,antallm,barn,ungdom,voksne);
    bestillingTabell.push(b);
    divVisning.innerHTML = "";  // begynner med blanke ark
    let innhold = "<table><tr> <th>Ukenr</th> <th>AntallMidgr</th> <th>Barn</th> <th>Ungdm</th> <th>Voksne</th> </tr>";  // dette er visningen av tabellen
    for (let b of bestillingTabell) {
      innhold += `<tr>
                      <td>${b.ukenr}</td> 
                      <td>${b.antallm}</td>
                      <td>${b.barn}</td>
                      <td>${b.ungdom}</td>
                      <td>${b.voksne}</td>
                  </tr>`;
    }
    innhold +="</table>"
    divVisning.innerHTML = innhold;
  }

  // skal beregne forbruk for uke 26
  function beregnForbruk() {
    regnUtForbruk(26);
  }

  /**
   * Regner ut forbruk for en vilkårlig uke
   * @param {number} ukenr 
   */
  function regnUtForbruk(ukenr) {
    const valgtUke = [];  // alle bestillinger for valgt uke
    for (let b of bestillingTabell) {
      if (b.ukenr === ukenr) {
        valgtUke.push(b);
      }
    }
    if (valgtUke.length > 0 ) {
      // beregn forbruk for disse bestillingene
      /**
       * Pseudocode
       * for hver bestilling
       *   plukk ut antallm, barn,voksne,ungdom
       *   regn ut barn* krabbe(barn)   -- krabbe(barn) er forbruk barn av krabbe
       *   regn ut ungdom* krabbe(ungdom)  
       *   regn ut voksne* krabbe(voksne)  
       *   regn ut barn*   torsk(barn)   
       *   regn ut ungdom* torsk(ungdom)  
       *   regn ut voksne* torsk(voksne)  
       *   dersom antallm er 3
       *      regn ut barn*   laks(barn)   
       *      regn ut ungdom* laks(ungdom)  
       *      regn ut voksne* laks(voksne)  
       *   forbruk er antallm * summen av tallene over
       */
      let krabbeForbruk = 0;
      let toskForbruk = 0;
      let laksForbruk = 0;
      for (let b of bestillingTabell) {
        const {antallm,barn,ungdom,voksne} = b;
        krabbeForbruk += antallm*(300*barn + ungdom*500 + voksne*600);  
        toskForbruk += antallm*(200*barn +  300*ungdom + 350 * voksne); 
        if (antallm === 3) {
          laksForbruk += toskForbruk;  // samme verdiene i tabellen 
        } 
      }
      divVisning.innerHTML = `krabbe:${krabbeForbruk} laks:${laksForbruk} torsk:${toskForbruk}`;
    }
  }

}