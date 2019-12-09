// @ts-check

// funksjoner du sikkert trenger på eksamen

// denne gir en alert dersom du skriver navn på id feil
const g = id => {
    let elm = document.getElementById(id);
    if (elm == null || elm == undefined) {
        alert(`Stavefeil? finner ikke ${id}`)
    }
 }

 // bruk denne for å hente value fra en inpNavn osv
 // slipper rød strek under .value
 const get = element => element.value;


 // en funksjon som lager en nedtrekksliste
/**
 * @param {Object}  tabell      Inneholder verdier som skal brukes i nedtrekk
 * @param {string} valgtNokkel  Nøkkel fra første nedtrekk 
 *                              - fyller ut den andre med verdier fra tabell
 * @returns {string}            Innhold til en select, 
 *                              bruk sel.innerHTML = lagNedTrekk(..)
 */

function lagNedtrekk(valgtNokkel, tabell) {
    let s = '';
    if (tabell[valgtNokkel]) {
        let verdier = tabell[valgtNokkel];
        for (let v of verdier) {
            s += `<option>${v}</option>`;
        }
    }
    return s;
}



 function setup() {
     let inpNavn = g("navn");
     let inpAlder = g("alder");
     let selVelger = document.getElementById("velger");
     let btnKlikkMeg = document.getElementById("klikkmeg");

     btnKlikkMeg.addEventListener("click",gjoerNoe);

     function gjoerNoe() {
         let navn = get(inpNavn);
         let alder = get(inpAlder);
     }

     let tabell = {
         armer : [ "biceps","fransk"],
         skuldre: [ "stående", "side"]
     }
     selVelger.innerHTML = lagNedtrekk("armer",tabell);
 }