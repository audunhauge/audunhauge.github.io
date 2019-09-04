// @ts-check

function $(id) {
    return document.getElementById(id);
}

function setup() {
    let inpEpost = $("epost");
    let inpFornavn = $("fornavn");
    let inpEtternavn = $("etternavn");
    let inpAlder = $("alder");
    let inpMobil = $("mobil");
    let btnRegistrer = $("registrer");

    btnRegistrer.addEventListener("click", registrer);

    function registrer() {
        // @ts-ignore
        let epost = inpEpost.value;
        // @ts-ignore
        let fornavn = inpFornavn.value;
        console.log(epost, fornavn);
    }

    

}