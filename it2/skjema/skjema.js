function setup() {
    let inpFornavn = document.getElementById("fornavn");
    let inpEtternavn = document.getElementById("etternavn");
    let inpAlder = document.getElementById("alder");
    let inpEpost = document.getElementById("epost");
    let inpFarge = document.getElementById("farge");
    let inpDato = document.getElementById("dato");

    let btnLagre = document.getElementById("lagre");
    btnLagre.addEventListener("click", lagreData);

    function lagreData(event) {
        let fornavn = inpFornavn.value;
        let etternavn = inpEtternavn.value;
        let alder = inpAlder.valueAsNumber;
        let epost = inpEpost.value;
        let farge = inpFarge.value;
        let dato = inpDato.value;
        
        // kommer vi inn på senere
        let person = { fornavn, etternavn, alder,epost,farge,dato };
        let spillerData = JSON.stringify(person);
        localStorage.setItem("spiller", spillerData);
        location = "floppy.html";
    }


}