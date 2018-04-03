// @ts-check

/**
 * Bruker en klasse til å lage byer.
 * Det blir lett å legge til nye byer - og jeg får
 * vist kjennskap til klasser.
 * Får ikke vist arv i dette eksemplet, men kan tenke meg
 * f.eks  class StorBy extends By { }
 * som tegner storbyer som et polygon istedenfor en sirkel
 * Har nå berørt målene 
 *   hensikten med objektorientert utvikling 
 *   og begrepene klasse, objekt og arv
 *   programmere med enkle og indekserte variabler 
 *   eller andre kolleksjoner av variabler
 */
class By {

    constructor(navn, x, y) {
        this.navn = navn;
        this.x = x;
        this.y = y;
        this.merke = null;
    }

    tegn(div, idx, clikcHandler) {
        let x = this.x;
        let y = this.y;
        let merke = document.createElement('div');
        merke.className = "by";
        merke.style.left = `${x}px`;
        merke.style.top = `${y}px`;
        div.appendChild(merke);
        this.merke = merke;
        merke.dataset.idx = idx;   // lagrer idx for byen i merket
        merke.addEventListener("click", clikcHandler);
    }

    visinfo(e) {
        let divInfo = document.getElementById("info");
        divInfo.classList.add("show");
        divInfo.innerHTML = '<h4>'+this.navn+'</h4>';
        let vid = document.createElement('video');
        vid.src = this.navn + ".mp4";
        vid.controls = true;
        divInfo.appendChild(vid);
    }


}

// lagrer byene i en array
// lett å legge til flere da jeg bruker en klasse-definisjon
// som "stanser ut" instanser (lager objekter)
// hver by har også to funksjoner tegn,visinfo som
// gjør det enkelt å tegne/vise info for en ny by
var byer = [];
byer.push(new By("Halden", 340, 590));
byer.push(new By("Fredrikstad", 160, 510));

function setup() {
    let divMerker = document.getElementById("merker");
    let divInfo = document.getElementById("info");
    let divKart = document.getElementById("kart");

    // klikk på divInfo skjuler den igjen
    // $FlowFixMe
    divInfo.addEventListener("click", hideMe);
  

    // tegner en sirkel over alle byene
    // legger til klikkMeg som eventlistener
    // div-merket lagrer index for byen slik at vi kan hente den
    // ut i klikkMeg (this.dataset.idx)
    byer.forEach((by, idx) => {
        by.tegn(divMerker, idx, klikkMeg);
    });

    function klikkMeg(e) {
        divKart.classList.add("hidden");
        let byIdx = this.dataset.idx;
        let by = byer[byIdx];
        // dette er instansen av klassen By som er 
        // kobla til dette merket
        by.visinfo();
    }

    function hideMe(e) {
        this.classList.remove("show");
        divKart.classList.remove("hidden");

    }



}