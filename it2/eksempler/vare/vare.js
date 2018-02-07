"use strict";

class Vare {
  constructor(navn, pris) {
    this.navn = navn;
    this.pris = pris;
  }
  
  /**
   * Lager en linje som skal vises i vareliste
   *  varenavn pris knapp
   *  @param {function} eventListener
   **/
  knapp( eventListener) {
    let s = document.createElement('div');
    let b = document.createElement('button');
    b.classList.add("button");
    b.id = this.navn;
    b.vare = this;
    b.innerHTML = 'Kjøp';
    b.addEventListener('click',eventListener);
    s.classList.add("kjop");
    s.innerHTML = '<div>' + this.navn 
                 + "</div><div>" 
                 + this.pris + "kr</div>"
    s.appendChild(b);
    return s;    
  }
  
  /**
   *  Lager en linje for hver vare som skal kjøpes: antall varenavn pris total
   *  Brukes til å vise en linje i handlekorg
   *  @param {int} antall - antall av varen
   *  @param {function} eventListener, kjøres når varen klikkes
   *  @return {div}
   **/
  linje(antall, eventListener) {
    let s = document.createElement('div');
    s.addEventListener("click", eventListener);
    s.vare = this;
    s.classList.add("kjop");
    s.innerHTML = '<div>' + antall + '</div><div>' + this.navn 
                 + '</div><div>'
                 + this.pris + 'kr</div><div>' + (antall * this.pris) + '</div>';
    return s;    
  }
}

class Vareliste {
  constructor() {
    this.liste = [];
  }
  
  tom() {
    this.liste = [];
  }
  
  add(vare) {
    this.liste.push(vare);
  }
  
  antall() {
    return this.liste.length;
  }
  
  vis(displayDiv, eventListener) {
    displayDiv.innerHTML = '';
    for (let i = 0; i < this.liste.length; i++) {
        let v = this.liste[i];
        displayDiv.appendChild( v.knapp(eventListener) );
    }
  }
}

class Handlekorg {
  constructor() {
    this.liste = {};
    this.totAntall = 0;
  }
  
  tom() {
    this.liste = {};
    this.totAntall = 0;
  }
  
  add(vare) {
    if (this.liste[vare.navn]) {
        this.liste[vare.navn].antall ++;  // antall av denne varen
    } else {
        this.liste[vare.navn] = { antall:1, vare:vare };
    }
    this.totAntall++;  // totalt antall varer
  }
  
  drop(vare) {
    if (this.liste[vare.navn]) {
        this.liste[vare.navn].antall --;  // antall av denne varen
        if (this.liste[vare.navn].antall === 0) {
            delete this.liste[vare.navn];
        }
        this.totAntall --;
    } 
  }
  
  antall() {
    return this.totAntall;
  }
  
  total() {
    let tot = 0;
    for (let varenavn in this.liste) {
        tot += this.liste[varenavn].antall * this.liste[varenavn].vare.pris;
    }
    return tot;
  }
  
  vis(displayDiv,eventListener) {
    displayDiv.innerHTML = '';
    for (let varenavn in this.liste) {
        let item = this.liste[varenavn];
        displayDiv.appendChild( item.vare.linje( item.antall, eventListener) );
    }
    let divTot = document.createElement('div');
    divTot.classList.add('total');
    divTot.innerHTML = 'Totalsum : '+ this.total() + ' kr <p>Antall varer : ' + this.antall() ;
    displayDiv.appendChild(divTot);
  }
}

function setup() {
    var vareliste = new Vareliste();
    var handlekorg = new Handlekorg();
    
    var divHandlekorg = document.querySelector("#handlekorg");
    var divVareliste = document.querySelector("#vareliste");
    var divDialog = document.querySelector("#dialog");
    vareliste.add(new Vare("bukse", 390));
    vareliste.add(new Vare("shorts", 39));
    vareliste.add(new Vare("slips", 90));
    vareliste.add(new Vare("jakke", 490));
    vareliste.add(new Vare("hatt", 1390));
    vareliste.add(new Vare("sko", 4390));
    vareliste.add(new Vare("bukse2", 390));
    vareliste.add(new Vare("shorts2", 39));
    vareliste.add(new Vare("slips2", 90));
    vareliste.add(new Vare("jakke2", 490));
    vareliste.add(new Vare("hatt2", 1390));
    vareliste.add(new Vare("sko2", 4390));
    
    divDialog.innerHTML = '<button class="button">Send bestilling</button>'
                        + '<button class="button">Tøm handlekorg</button>';
    
    vareliste.vis(divVareliste, vareKjop);
    function vareKjop(e) {
        handlekorg.add(this.vare);
        handlekorg.vis(divHandlekorg,fjernVare);
    }
    
    function fjernVare(e) {
        handlekorg.drop(this.vare);
        handlekorg.vis(divHandlekorg, fjernVare);
    }
}