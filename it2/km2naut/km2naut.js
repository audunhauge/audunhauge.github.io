// flow

/*
        <label>Kilometer <input id="km" type="number"> </label>
        <label><button id="k2n" type="button" > &#x2199; </button></label>
        <p>
        <label>Nautiske mil <input id="naut" type="number"> </label>
        <label><button id="n2k" type="button" > &#x2196; </button></label>
*/

function setup() {
    let inpKm = document.getElementById("km");
    let inpNaut = document.getElementById("naut");
   
    let btnK2n = document.getElementById("k2n");
    btnK2n.addEventListener("click", k2n);

    let btnN2k = document.getElementById("n2k");
    btnN2k.addEventListener("click", n2k);

    function k2n(event) {
        let km = inpKm.valueAsNumber;
        let naut = km/1.852;
        inpNaut.value = naut.toFixed(2);      
    } 

    function n2k(event) {
        let naut = inpNaut.valueAsNumber;
        let km = naut*1.852;
        inpKm.value = km.toFixed(2);      
    } 
}