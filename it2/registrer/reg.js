function setup() {
    let list = [];
    let inpNavn = document.getElementById("navn");
    let divVisListe = document.getElementById("visliste");

    //let btnLagre = document.getElementById("lagre");
    //btnLagre.addEventListener("click", lagreData);

    inpNavn.addEventListener("keydown", lagreData);

    function lagreData(event) {
        if (event.keyCode === 13) {
            let navn = inpNavn.value;
            if (navn === "") {
                event.preventDefault();
                return;
            }
            list.push(navn);
            list.sort();
            let uList = "<ol>";
            for (let n of list) {
                uList += "<li>" + n + "</li>";
            }
            uList += "</ol>";
            divVisListe.innerHTML = uList;
            inpNavn.value = "";
            event.preventDefault();
        }
    }


}