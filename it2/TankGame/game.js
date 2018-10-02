'use strict';

// vi trenger socket som global variabel
let socket = io.connect('/');
let world = {};  // tom verden
   

function setup() {
    const MAXSKUDD = 20;
    let poeng = 0;
    let gameState = 'waiting';
   

    let divBoard = document.getElementById("board");
    let divMelding = document.getElementById("melding");
    let frmRegistrer = document.getElementById("registrer");
    
    let antallSpillere = 0;
    
    // knapp for start av spillet
    let btnStart = document.createElement("button");
    btnStart.className = "startbutton hidden";
    btnStart.innerHTML = "Start Spillet";
    btnStart.id = "start";
    
    
    
    // sjekk om denne brukeren er registrert
    let playerInfo = localStorage.getItem('player');

    // vi skal legge en tanks ut på skjermen
    // første versjon er bare en div med class="tank"
    let tank1 = new Tank("t1","intro1");
    // legg tanken ut på stagen (på board)
    divBoard.appendChild(tank1.div);  

    let tank2 = new Tank("t2", "intro2");
    // legg tanken ut på stagen (på board)
    divBoard.appendChild(tank2.div); 
    
    // lag en ny spiller
    let player = new Player("noname",12,"red");
    
    // knapp for registrering av spiller
    let btnReg = document.createElement("button");
    btnReg.className = "startbutton";
    btnReg.id = "reg";

    // har vi data om spiller fra før ?
    if (playerInfo !== null) {
        let playerObject = JSON.parse(playerInfo);
        divMelding.innerHTML = `Hei ${playerObject.navn}<br>
        Det er <span id="antall">${antallSpillere}</span> spillere på nå.`;
        btnReg.innerHTML = "Rediger info";
        // btnStart.classList.remove("hidden");  
        player.navn = playerObject.navn;
        player.alder = playerObject.alder;  
        player.farge = playerObject.farge || "#0000ff";
        socket.emit('ready',  player);
    } else {
        btnReg.innerHTML = "Registrer deg";  
    }   
  
    btnStart.addEventListener("click",readyToPlay);
    btnReg.addEventListener("click",registrer);
    // legg knapper ut på stagen (på board)
    divBoard.appendChild(btnReg); 
    divBoard.appendChild(btnStart);      
    
    
    // bruker registrerer data
    function registrer(e) { 
      let inpNavn = document.getElementById("navn")
      let inpAlder = document.getElementById("alder");
      let inpFarge = document.getElementById("farge");
            
      // først skjuler vi spillebrettet
      divBoard.classList.remove("come_here");
      void divBoard.offsetWidth;
      divBoard.classList.add("go_away");
      // css klassen go_away animerer spillebrettet vekk
      frmRegistrer.classList.remove("go_away");
      void frmRegistrer.offsetWidth;
      frmRegistrer.classList.add("come_here");
      // animerer registrerings-skjema inn på stagen
      
      let btnLagre = document.getElementById("lagre");
      btnLagre.addEventListener("click", lagreInfo);

      // vis lagra data i skjema dersom vi har noe
      if (playerInfo !== null) {
        let playerObject = JSON.parse(playerInfo);
        inpNavn.value = playerObject.navn;
        inpAlder.value = playerObject.alder || 12;
        inpFarge.value = playerObject.farge || "#0000ff";
      }
      
      // lagre data fra skjema i localStorage
      function lagreInfo(e) {
        let navn = capAll(inpNavn.value);
        let alder = inpAlder.valueAsNumber;
        let farge = inpFarge.value;
        
        playerInfo = JSON.stringify({navn,alder,farge});
        player.navn = navn;
        player.alder = alder; 
        player.farge = farge;
        
        localStorage.setItem("player", playerInfo );
        divBoard.classList.remove("go_away");
        void divBoard.offsetWidth;  // trigger reflow
        divBoard.classList.add("come_here");
        frmRegistrer.classList.remove("come_here");
        void frmRegistrer.offsetWidth;
        frmRegistrer.classList.add("go_away");
        socket.emit('ready',  player);
      }
    }
    
    // klargjør spillet
    function readyToPlay() {
      // fjern animeringen
      tank1.div.classList.remove("intro1");
      tank2.div.classList.remove("intro2");

      // set farge på spillerens tank
      tank1.div.style.backgroundColor = player.farge;

      tank1.div.classList.add("active");
      tank2.div.classList.add("active");
      btnReg.className = "hidden";
      btnStart.className = "hidden";
      divMelding.className = "hidden";
      gameState = 'ready';
      socket.emit('start', player);
    }
        
    
    socket.on('stats', function(data) {
        antallSpillere = data.antallSpillere;
        document.getElementById('antall').innerHTML = "" + antallSpillere;
        if (gameState === 'waiting' && antallSpillere > 1) {
          btnStart.classList.remove("hidden");
        }
    });

    socket.on('startgame', function(data) {
      world = data;      
      if (gameState === 'waiting') {
        readyToPlay();
      } else if (gameState === 'ready') {
        let myself = player.navn;
        let tankcount = 2;
        let tankList = [tank1,tank2];
        tank1.owner = myself;
        gameState = 'playing';
        for (let otherPlayer of Object.keys(world)) {
          if (otherPlayer !== myself) {
            if (tankcount > 2) {
              // make a new tank
               let t34 = new Tank("t"+tankcount, "active");
               // legg tanken ut på stagen (på board)
               t34.div.style.backgroundColor = world[otherPlayer].farge;
               divBoard.appendChild(t34.div); 
               t34.owner = otherPlayer;
               tankList.push(t34);
            } else {
               tank2.owner = otherPlayer;
               tank2.div.style.backgroundColor = world[otherPlayer].farge;
            }
            tankcount++;
          }
        }
        playTheGame(divBoard, tankList, player);
      }
    }); 
}

/**
 *  @param {string} s
 *  @returns {string} Capitalized
 */
function cap(s) {
  return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();
}

/**
 *  @param {string} s
 *  @returns {string} Capitalized Names
 */
function capAll(s) {
  return ((s.split(' ')).map(cap)).join(' ');
}