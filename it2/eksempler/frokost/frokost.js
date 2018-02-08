"use strict";
function setup() {
  // denne funksjonen danner en closure
  // dvs at den lager en beholder for alle
  // lokale variable/funksjoner som er tilgjengelig
  // for alle indre funksjoner.
  // Dermed slipper vi å lage globale variable
  
  // data fra oppgaven
  var forbruk = [
    [ "Lettmelk",  92,  6.6,    3,    9.6    ],
    [ "1 egg",     80,  6.9,    5.5,  0.7    ],
    [ "Grovbrød", 103,  3.5,    1,    19.6   ],
    [ "Smør",      36,  0.025,  4.1,  0.025  ],
    [ "Gulost",    53,  4,      4.2,  0      ]
  ]
  
  // lager en assosiativ tabell slik at oppslag blir lett
  // kan nå slå opp slik: oppslag["melk"]["kcal"]
  var oppslag = {};
  var mat = "melk,egg,brod,smor,ost".split(',');
  var innhold = "kcal,protein,fett,karb".split(',');
  // merk at ingen variable definert med let er synlig utenfor {blokken}
  {
    let y = 0;                   // indeks i tabellen forbruk, radnummer
    for (let m of mat) {
      let x = 1;                 // indeks i forbruk, kolonnenummer
      oppslag[m] = {};           // må lage et indre object, oppslag == { {},{}, ... }
      for (let i of innhold) {
        oppslag[m][i] = forbruk[y][x];  // fyller verdier i de indre objectene
        x++;
      }
      y++;
    }
  }
  
  // lag en tabell: 5 rader, 6 kolonner, siste kolonne skal være antall enheter
  var tabell = zz.table(5,6,{ id:"forbruk", 
      data: forbruk,
      cols:("Matvare,Kcal,Protein (i gram),Fett (i gram),Karbohydrat (i gram),Antall").split(',')} );
  
  
  // etiketter for oppsummering
  // annen hver verdi er blank, blir erstattet av tallverdien
  // som beregnes i funksjonen beregn
  var oppsumEtiketter = [ "Kcal, ,Protein, ,Fett, ,Karb, ".split(',') ];
  
  // lager oppsumering av verdier (kcal ... karb)
  var oppsum = zz.table(1,8, { id:"summering", data:oppsumEtiketter });
  
  zz("#skjema").innerHTML = tabell + '<p>' + oppsum;
  
  // lager numerisk input for antall av hver matvare
  for (let i=0; i<forbruk.length; i++) {
    var inpAntall = document.createElement('input');
    var span = document.createElement('span');
    inpAntall.type = 'number';
    inpAntall.min = '0';
    inpAntall.max = '10';
    inpAntall.addEventListener('change', beregn);
    zz.tableRef("forbruk",6,i+1).appendChild(inpAntall)
    zz.tableRef("forbruk",6,i+1).appendChild(span);
    // det ekstra span-elementet brukes til å markere feil for input
    // må gjøre dette da css ikke støtter input:invalid:after
  }
  
  function beregn(e) {
    let memo = [ ];  // lagre verdier av antall
    let x = 1;  // 1..4 for kcal,fett ..
    // for hver type innhold
    for (let i of innhold) {
      let sum = 0;
      let y = 1; // 1..5 for melk,egg ...
      for (let m of mat) {
        let antall = memo[y] || zz.gridRef("forbruk",6,y).valueAsNumber || 0;
        if (antall > 0) {
          // ignorer negativt antall på matvarer
          sum += oppslag[m][i] * antall;
        }
        memo[y] = antall;   // sparer oss for gridRef
        // neste gang vi trenger antall finner vi det i memo
        y++;
      }
      zz.tableRef("summering",2*x,1).innerHTML = sum.toFixed(2);
      x++;
    }
    
    // beregn kcal for hver matvare
    // denne skrivemåten (med komma først) gjør det lettere å copypasta
    // nye linjer inn nederst uten at vi får feil p.g.a. manglende/ekstra komma
    let kcal = [ 
                   memo[1] * oppslag.melk.kcal
                ,  memo[2] * oppslag.egg.kcal
                ,  memo[3] * oppslag.brod.kcal
                ,  memo[4] * oppslag.smor.kcal
                ,  memo[5] * oppslag.ost.kcal
               ];
               
    // beregner totalt antall kcal.
    // den er beregna tidligere, men i en løkke,
    // dermed litt fomlete å hente ut
    // Nå fjerner vi også evt negative verdier
    let total = kcal.filter( (e) => e > 0 )  // bare positive verdier
                    .reduce((a,b) => a+b, 0 );  // summerer
    
    // normaliserer kcal verdiene slik at summen blir 360
    // filtrerer også vekk alle verdier som ikke er > 0
    let data = kcal.filter( (e) => e > 0 )
                   .map( (e) => 360 * e / total );
    // merk at vi ikke trenger å sjekke om total === 0
    // for da vil kcal.filter === [ ] og ingenting utføres
                   
    // filtrerer navn på matvarer på samme måte                   
    let labels = mat.filter( (e,i)  => kcal[i] > 0);
    
    // filtrerer fargene slik at hver matvare alltid får samme farge
    let colors = ["#FDB", "#7EF", "green","red","blue"].filter( (e,i)  => kcal[i] > 0);
    
    // tegn kakediagram
    
    var canvas = document.getElementById("diagram");
    var context = canvas.getContext("2d");
    // visk vekk alt fra canvas
    context.clearRect(0,0,500,500);   
    
    // for alle data (de matvarene som er valgt)
    for (let idx = 0; idx < data.length; idx++) {
       // tegner ett kakesegment for hvert datasett
       drawSegment(canvas, context, data, colors, labels, idx);
    }
  }
  
}
// hjelpefunksjoner for å tegne på canvas
// kopiert fra http://www.wickedlysmart.com/how-to-make-a-pie-chart-with-html5s-canvas/
// modifisert slik at ingen data er globale variable
function drawSegment(canvas, context, data, colors, labels, i) {
    context.save();
    var centerX = Math.floor(canvas.width / 2);
    var centerY = Math.floor(canvas.height / 2);
    let radius = Math.floor(canvas.width / 2);
    var startingAngle = degreesToRadians(sumTo(data, i));
    var arcSize = degreesToRadians(data[i]);
    var endingAngle = startingAngle + arcSize;
    context.beginPath();
    context.moveTo(centerX, centerY);
    context.arc(centerX, centerY, radius, 
                startingAngle, endingAngle, false);
    context.closePath();
    context.fillStyle = colors[i];
    context.fill();
    context.restore();
    drawSegmentLabel(canvas, context, data, labels, i);
}
function degreesToRadians(degrees) {
    return (degrees * Math.PI)/180;
}
function sumTo(a, i) {
    var sum = 0;
    for (var j = 0; j < i; j++) {
      sum += a[j];
    }
    return sum;
}
function drawSegmentLabel(canvas, context, data, labels, i) {
   context.save();
   var x = Math.floor(canvas.width / 2);
   var y = Math.floor(canvas.height / 2);
   var angle = degreesToRadians(sumTo(data, i));
   context.translate(x, y);
   context.rotate(angle);
   var dx = Math.floor(canvas.width * 0.5) - 10;
   var dy = Math.floor(canvas.height * 0.05);
   context.textAlign = "right";
   var fontSize = Math.floor(canvas.height / 25);
   context.font = fontSize + "pt Helvetica";
   context.fillText(labels[i], dx, dy);
   context.restore();
}