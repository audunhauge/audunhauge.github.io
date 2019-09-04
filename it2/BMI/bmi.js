// @ts-check

function setup() {
    let inpHoyde = document.getElementById("hoyde");
    let inpVekt = document.getElementById("vekt");
    let inpNavn = document.getElementById("navn");
    let btnBeregn = document.getElementById("beregn");
    let lblBmi = document.getElementById("bmi");
    let imgHippo = document.getElementById("hippo");
    let imgSpurv = document.getElementById("spurv");
    let imgSlange = document.getElementById("slange");
    let divNavn = document.getElementById("navneliste");

    btnBeregn.addEventListener("click", beregnBMI);

    let navneListe = [ ];

    function beregnBMI() {
        // @ts-ignore
        let navn = inpNavn.value;
        // @ts-ignore
        let hoyde = inpHoyde.valueAsNumber;
        // @ts-ignore
        let vekt = inpVekt.valueAsNumber;
        
        let bmi = vekt / (hoyde ** 2);
        lblBmi.innerHTML = bmi.toFixed(2);

        if (bmi > 25) {
            imgHippo.className = "vismeg";
        } else {
            imgHippo.className = "";
        }

        if (bmi < 18) {
            imgSpurv.className = "vismeg";
        } else {
            imgSpurv.className = "";
        }

        if (bmi >= 18 && bmi <= 25) {
            imgSlange.className = "vismeg";
        } else {
            imgSlange.className = "";
        }

        navneListe.push(navn);

        divNavn.innerHTML = navneListe.join(",");



    }


}