// @flow

class By {

    constructor(navn,x,y) {
        this.navn = navn;
        this.x = x;
        this.y = y;
        this.merke = null;
    }

    tegn(div) {
        let x = this.x;
        let y = this.y;
        let merke = document.createElement('div');
        merke.className = "by";
        merke.style.left = `${x}px`;
        merke.style.top = `${y}px`;
        div.appendChild(merke);
        this.merke = merke;
        merke.addEventListener("click", this.visinfo);
    }

    visinfo(e) {
       let divInfo = document.getElementById("info");
       divInfo.classList.add("show");
       divInfo.innerHTML = this.navn;
    }

   
}

// lagrer byene i en array
// lett å legge til flere
var byer = [ ];
byer.push(new By("Halden",340,590));
byer.push(new By("Fredrikstad",160,510));

function setup() {
  let divMerker = document.getElementById("merker");
  // $FlowFixMe
 
  // tegner en sirkel over alle byene
  for (let by of byer) {
      by.tegn(divMerker);
  }

}