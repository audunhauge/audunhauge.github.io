"use strict";

class Vareliste {
  constructor() {
	  this.liste = [ ];
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
    displayDiv.innerHTML = '<h2>Vårens nye tilbud</h2><p>';
    for (let i = 0; i < this.liste.length; i++) {
      let v = this.liste[i];
      displayDiv.appendChild(v.knapp(eventListener));
    }
  }
}