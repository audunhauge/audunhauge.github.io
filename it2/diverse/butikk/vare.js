
/**
 * Denne klassen definerer en Vare
 * En vare har egenskapene navn og pris
 * Dersom det finnes et bilde med samme navn (+.png)
 * Da brukes dette bildet i visningen som lages av knapp
 */


class Vare {
  constructor(navn, pris) {
    this.navn = navn;
    this.pris = pris;
  }

  /**
   *  Lager en knapp for en vare, denne knappen vil aktivere
   *  eventListener. Dersom det finnes et bilde, da
   *  brukes dette som innhold for knappen.
   *  Dersom bilde mangler, da brukes notfound.png
   *  Dersom notfound.png ikke finnes, da brukes tekst  
   *  @param {function} eventListener
   */
  knapp(eventListener) {
    let reloads = 0;  // slik at vi ikke går i spinn
    // dersom notfound.png også er notfound 
    let s = document.createElement('div');
    let f = document.createElement('figure');
    let fc = document.createElement('figcaption');
    fc.innerHTML = this.navn + ' ' + this.pris + '&nbsp;kr';
    let p = document.createElement('img');
    p.src = 'bilder/' + this.navn + '.png';
    p.onerror = noSuchImage;    // bytter ut med default bilde dersom ikke funnet
    f.appendChild(p);
    f.appendChild(fc);
    f.id = this.navn;
    f.vare = this;
    f.addEventListener('click', eventListener);
    s.classList.add("salg");
    s.appendChild(f);
    return s;	
	
    /**
     *  Bytter ut manglende bilde med notfound.png
     *  Tester reloads slik at vi ikke får evig løkke
     *  Dersom notfound.png også mangler
     *  _this_ er her img-elementet som feilet
     */
    function noSuchImage(e) {
      this.title = "bilde mangler";
      if (reloads < 1) {
        this.src = "bilder/notfound.png";
        // vare ikke funnet bilde
      } else if (reloads === 1) {
        this.src = "";  // ikke vis noe bilde
        // fordi notfound.png mangler
        fc.innerHTML = '<i>bilde mangler</i><br>' + fc.innerHTML;
      }
      reloads++;
    }
  }

  /**
   *  Lager en varelinje for en vare
   *  @param {int} antall - antallet av varen
   *  @param {function} eventListener - kjøres ved klikk på linja
   */
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
