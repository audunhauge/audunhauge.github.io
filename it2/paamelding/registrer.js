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


        
        let totalsum = voksne * 316 + barn * 120;
        let rabatt = false;
        if (antall > 4) {
            totalsum *= 0.8;   // gir 20% rabatt
            rabatt = true;
        }

        let bestilling = new Bestilling(voksne, barn, forestilling);
        bestillingsListe[0] = bestilling;
        visListe();

        function visListe() {
            let innhold = "";
            let rabtext = rabatt ? `, inklusivt grupperabatt på 20 prosent` : "";
            let personer = [ voksne, barn];
            let text = "voksne,barn".split(",");
            let melding = text.map((e,i)=> personer[i] + " " + e).filter((e,i) => personer[i]).join(" og ");
            innhold += `Du har bestillt ${antall} biletter til ${forestilling}, ${melding}.
            Totalprisen er kr ${totalsum.toFixed(2)}${rabtext}.`;
            divOversikt.innerHTML = innhold;
        }
    }

 
}