// @ts-check


let endringer;

function setup() {
    let inpMil = document.getElementById("mil");
    let inpForbruk = document.getElementById("forbruk");
    let btnBeregn = document.getElementById("beregn");
    let spanResultat = document.getElementById("resultat");

    btnBeregn.addEventListener("click", visResultat);

    function visResultat() {
        let mil = inpMil.value;
        let forbruk = inpForbruk.value;
        let liter = mil * forbruk;
        spanResultat.innerHTML = liter.toFixed(2);
    }

    endringer = visResultat;
}