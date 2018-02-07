/* global zz */

class Lag {
  constructor(navn) {
    this.navn = navn;
    this.kamper = 0;
    this.heime = 0;
    this.burte = 0;
    this.tap = 0;
    this.uavgjort = 0;
    this.mf = 0;     // mål for laget
    this.mm = 0;     // mål mot laget
    this.poeng = 0;
  }
}

// MERK!!!  VIKTIG INFO
// alle kommentarar lyt lesast med stemmen til Sølve Grjotmaal
// dermed "heimesiger, burtesiger ..."


function setup() {
  
  let lagnavn = "molde,vard,moss,brann,viking,djerv,sarpsborg";
  let navneListe = lagnavn.split(',');
  
  let lagListe = {};
  
  // fyller lagListe med lag fra lagnavn, alle verdier er 0
  // lagListe === { molde:{ navn:molde,kamper:0 ...}, ...}
  navneListe.forEach( navn => lagListe[navn] = new Lag(navn));
  
  // lager skjema for kampregistrering
  let frm = document.createElement('form');
  
  let inp = zz.lagInput("Heime","select",{ valg:lagnavn, valgt:navneListe[0]});
  frm.appendChild(inp);
  
  inp = zz.lagInput("HeimeMaal","number",{ min:0, max:50 });
  frm.appendChild(inp);
  
  inp = zz.lagInput("Burte","select",{ valg:lagnavn, valgt:navneListe[1]});
  frm.appendChild(inp);
  
  inp = zz.lagInput("BurteMaal","number",{ min:0, max:50 });
  frm.appendChild(inp);

  let btnRegistrer = zz.lagInput("Registrer","button");
  frm.appendChild(btnRegistrer);

  let btnRandom = zz.lagInput("Slump","button");
  frm.appendChild(btnRandom);
  
    
  zz("skjema").appendChild(frm); 
  
  btnRegistrer.addEventListener("click", registrerKamp);
  btnRandom.addEventListener("click", slumpKamp);
  
  visTabell();
  
  function registrerKamp(e) {
    let heime = zz("heime").value;
    let heimeMaal = zz("heimemaal").valueAsNumber || 0;
    let burte = zz("burte").value;
    let burteMaal = zz("burtemaal").valueAsNumber || 0;
    lagreKamp( heime, burte, heimeMaal, burteMaal);
  }
  
  function slumpKamp(e) {
    navneListe.sort( (a,b) => lagListe[a].kamper - lagListe[b].kamper );
    // lag med få kamper først i tabellen
    // logikken under forutsetter flere enn 4 lag
    let [ heime, burte] = zz.pick(2,navneListe.slice(0,4));
    // dette gjør at lag med få kamper blir valgt først 
    let heimeMaal = poisson(2.3);  // litt flere mål for hjemmelaget
    let burteMaal = poisson(1.5);
    zz("heime").value = heime;
    zz("burte").value = burte;
    zz("heimemaal").value = heimeMaal;
    zz("burtemaal").value = burteMaal;
    lagreKamp( heime, burte, heimeMaal, burteMaal);
  }
  
  
  function visTabell() {
    navneListe.sort( (a,b) => lagListe[b].poeng - lagListe[a].poeng );
    // lagListe er nå sortert etter poeng for hvert lag
    // merk at navneListe bare er navn på lagene
    zz("tabell").innerHTML = zz.table(
      navneListe.length,
      9,
      {
        caption:"Liga",
        cols:"Navn,Kamper,Heime,Burte,Uavgjort,Tap,MF,MM,Poeng".split(","),
        colnames:"navn,kamper,heime,burte,uavgjort,tap,mf,mm,poeng",
        rownames:navneListe.join(','),
        // bruker navneListe og ikke lagnavn da navneliste blir sortert 
        // etter poeng for hvert lag
        data:lagListe
      }
    );
  }
  
  
  function lagreKamp( heime, burte, heimeMaal, burteMaal) {
    // ignorer ugyldig kamp
    if (heime === burte) return;
    
    let H = lagListe[heime];
    let B = lagListe[burte];
    
    B.kamper ++;
    H.kamper ++;
    H.mf += heimeMaal;
    H.mm += burteMaal;
    B.mf += burteMaal;
    B.mm += heimeMaal;

    
    if (heimeMaal > burteMaal) {
      // heimesiger
      H.heime ++;
      H.poeng += 3;
      B.tap ++;
    } else if (burteMaal > heimeMaal) {
      B.burte ++;
      B.poeng += 3;
      H.tap ++;
    } else {
      // det vart uavgjort
      H.uavgjort ++;
      B.uavgjort ++;
      H.poeng ++;
      B.poeng ++;  
    }
    visTabell();
  } 
}

// hjelpefunksjoner som ikke er genrelle nok til å plasseres i util.js


/**
 * Generate a random variable based on a poisson distribution with mean m 
 * Merk at denne har en forventa kjøretid proporsjonal med m, O(m)
 * For m < 100, og få kjøringer er det ikke et problem
 * Trenger du mange verdier så bruk heller Cornish Fisher
 * @param {int} m
 * @returns {int} random possion distributed variable
 */
function poisson(mean) {
  // maksverdi satt til 500 for å
  // garantere kjøretid ikke for lang
  var L = Math.exp(-mean);
  var p = 1.0;
  var k = 0;
  do {
    k++;
    p *= Math.random();
  } while (p > L && k < 500);
  return k-1;
}