// @ts-check


class Bestilling {
    constructor(voksne, barn, forestilling) {
        this.voksne = voksne;
        this.barn = barn;
        this.forestilling = forestilling;
    }
}


function setup() {

    let bestillingsListe = [];

    let inpVoksne = document.getElementById("voksne");
    let inpBarn = document.getElementById("barn");
    let selForestilling = document.getElementById("forestilling");
    let btnLagre = document.getElementById("lagre");
    let divOversikt = document.getElementById("oversikt");

    btnLagre.addEventListener("click", lagreData);

    function lagreData() {
        let voksne = inpVoksne.valueAsNumber;
        let barn = inpBarn.valueAsNumber;
        let forestilling = selForestilling.value;
        let antall = voksne + barn;

        if (antall > 0 && barn >= 0 && voksne >= 0 && forestilling !== "") {
            document.getElementById("reg").classList.add("godkjent");
        } else {
            alert("Du må fylle ut med gyldige verdier");
            document.getElementById("reg").classList.remove("godkjent");
            return;
        }


        
        let antall = Number(voksne) + Number(barn);
        let totalsum = Number(voksne) * 316 + Number(barn) * 120;
        let rabatt = false;
        if (antall > 4) {
            totalsum *= 0.8;   // gir 20% rabatt
            rabatt = true;
        }

        let bestilling = new Bestilling(voksne, barn, forestilling);
        bestillingsListe[0] = bestilling;
        visListe();

    function visListe(totalsum,rabatt) {
        let innhold = "";   
        let b = bestillingsListe[0];
        let antall = Number(b.voksne) + Number(b.barn);
        let melding = "";
        if (rabatt === true) {
            melding = "inkl rabatt på 20%";
        }
        innhold += `Du har kjøpt ${antall} billetter til ${b.forestilling}.
        ${b.voksne} voksne, ${b.barn} barn.
        Totalprisen er ${totalsum}${melding}`;
        
        //innhold += "</ul>";
        divOversikt.innerHTML = innhold;
    }

 
}