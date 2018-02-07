/* global R */
function setup() {
 
  let towns = {
    a:{ x:259, y:155, n:"askim" },
    b:{ x:145, y:444, n:"fredrikstad" },
    c:{ x:340, y:528, n:"halden" },
    d:{ x:48 , y:265, n:"moss" },
    e:{ x:460, y:248, n:"orje" }
  };
   
 
  let localdist = (a,b) => {
    let d = (b.x-a.x)*(b.x-a.x) + (b.y-a.y)*(b.y-a.y);
    return Math.sqrt(d);
  }
  
  
  let scale = 58.8/localdist(towns.a,towns.b);
  
  function distance(a,b){
    return localdist(towns[a],towns[b])*scale;
  }
  
  // dist assumes you sort before lookup
  
  
  let longname = {
   "askim":"a",       
   "fredrikstad":"b",
   "halden":"c",
   "moss":"d",
   "orje":"e"    
  }
  
  // make some random towns
  let kart = zz("kart");
  let next = "fghijklmnopqrstuvwxyz1234567890".split('');
  for (let i of next) {
    let name = i + shuf("bkjhkyøasdtrygdfg".split('')).slice(0,5).join("");
    let x = roll(10,450);
    let y = roll(60,500);
    longname[name] = i;
    towns[i] = { x,y,n:name};
    let div = document.createElement("div");
    div.id = name;
    div.className = "merke";
    div.style.left = x+"px";
    div.style.top =  y+"px";
    kart.appendChild(div);
  }
  
  
  let ctxt = zz("overlay").getContext("2d"); 
  let img = zz("kartgif");
  
  
  setTimeout( () => ctxt.drawImage(img,0,0),1000);  // vent til bildet er lasta
  
  ctxt.fillStyle = "blue";
  ctxt.lineWidth = 5;
  ctxt.strokeStyle = "blue";
  ctxt.fillText("Venter på kart .... ", 50, 310);
  
  let trip = [];  // byer vi skal innom
  
  zz("kart").addEventListener("click",nyBy);
  
  // begrensningen er at den nye byen er
  // ulik den siste byen
  function nyBy(e) {
    let target = e.target;
    if (target.id === 'kart') return;
    // antar at vi har en by
    let by = target.id;
    if (longname[by] && R.last(trip) !== by) {
      // byen finnes, legg til i lista 
      trip.push(by);
      visRute(trip);
    }    
  }
   
  
  zz("simple").addEventListener("click", () => { 
    
      let uniq = R.uniq(trip);  // hver by bare en gang
      nytur(null);
      let short = uniq.map( e => longname[e] );
      let best = salesman(short,distance, stien);
      //console.log(best);
      trip = best.p.map( e => towns[e].n);
      //console.log(best, trip);
      setTimeout(() => visRute(trip), 300);
    });
     
  zz("nytur").addEventListener("click", nytur);
  
  function nytur(e) { 
    trip = [];
    ctxt.clearRect(0,0,599,735); 
    ctxt.drawImage(img,0,0);
    visRute(trip); 
  }
  
  function stien(trip) {
    // stien er kortnavn a,b,c
    ctxt.clearRect(0,0,599,735); 
    ctxt.drawImage(img,0,0);
    let segmenter = R.aperture(2,trip);
    segmenter.forEach((tup) => { 
      let [a,b] = tup;
      tegnRute(a,b); 
    } );
  }
  
  function visRute(trip) {
    ctxt.clearRect(0,0,599,735); 
    ctxt.drawImage(img,0,0);
    let segmenter = R.aperture(2,trip);
    // [halden,moss,orje] => [[halden,moss],[moss,orje]]
    let bitlengder = segmenter.map((tup) => { 
      let [a,b] = tup.map( e => longname[e] );
      tegnRute(a,b); 
      return distance(a,b); 
    } );
    // avstand-halden-moss, avstand-moss-orje
    let sti = bitlengder.reduce( (s,e,i) => s + (segmenter[i].join(' til ')) + " " + e.toFixed(1) + ' km<br>', "");
    let total = bitlengder.reduce( (a,b) => a+b, 0);
    zz("turliste").innerHTML = sti + "<p>" + `Det blir totalt ${total.toFixed(1)}km `;
  }
  
  
  function tegnRute(a,b) {
    let A = towns[a];
    let B = towns[b];
    //ctxt.clearRect(0,0,599,735);
    ctxt.beginPath();
      ctxt.moveTo(A.x+10, A.y+5);
      ctxt.lineTo(B.x+10, B.y+5);
      ctxt.stroke();
    ctxt.closePath();
  }
}

function combo(list) {
  // permutate all combos of chars
  if (list.length > 8) return [ [list] ];
  // refuse to work if long list
  // the size of returned array is n! * list
  let comb = [];
  if (list.length === 1) {
    return [list];
  }
  for (let f of list) {
    let others = R.difference(list,[f]);
    comb = comb.concat(prepend(f, combo(others) ) );
  }
  return comb;
}

function prepend(f,list) {
  return list.map( e => {e.unshift(f); return e; });
}