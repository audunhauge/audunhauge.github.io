/* global zz */
function setup() {
  
  // lager skjema
  let form = document.createElement('form');
  
  // lager input for antall sjømil
  let inpMil = zz.lagInput("mil","number",{ledetekst:"Sjømil", min:0, max:200});
  
  // lager input for fart (knop, dvs sjømil pr time)
  let inpKnop = zz.lagInput("knop","number",{ledetekst:"Fart i knop", min:0});

  // lager knapp for å kjøre beregning
  let btnBeregn = zz.lagInput("beregn","button",{ledetekst:"Beregn"});
  
  // lager lyttefunksjon for knappen
  btnBeregn.addEventListener("click", beregnTid);
  
  
  form.appendChild(inpMil);
  form.appendChild(inpKnop);
  form.appendChild(btnBeregn);

 
  
  zz("skjema").appendChild(form);
  
  function beregnTid(e) {
    let mil = zz("mil").valueAsNumber || 0;
    let knop = zz("knop").valueAsNumber || 0;
    if (mil === 0 || knop === 0) {
      // ugyldige data
      // enkel sjekk - bør forbedres
      return;
    }
    
    let tid = mil/knop;
    let min = (tid % 1) * 60;    // (tid % 1) gir desimaldelen av tid
    let sek = (min % 1) * 60;  
    let strSek = sek.toFixed(0);
    if (strSek === "60") {
      // fix for 60 sekunder
      // dersom sek = 59.995
      min ++;
      sek = 0;
    }
    
    
    let f = (t, entall, flertall) => { 
      let _t = Math.floor(t);
      return (_t >= 1) ? ( " " + _t.toFixed(0) + " " + (( _t === 1) ? entall : flertall )) : (""); 
    }
    // tar seg av problemet med 1 timer 1 minutter og 1 sekunder
     
    let strTid = "" + f(tid,'time','timer') + f(min,'minutt','minutter') + f(sek,'sekund','sekunder'); 
    
    if (strTid === "") strTid = "Urimelig tid";
                   
    zz("tidvis").innerHTML = strTid;       
         
  }
  
  
}