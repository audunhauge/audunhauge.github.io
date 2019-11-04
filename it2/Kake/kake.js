// @ts-check


class Matvare {
    constructor(navn,kcal) {
        this.navn = navn;
        this.kcal = kcal;
    }
}

const matvareListe = [ ];

const farger = "red,green,blue,yellow,orange,teal,pink".split(",");


function setup() {
    const canvas = document.getElementById("diagram");
    const ctx = canvas.getContext('2d');
    let inpMat = document.getElementById("mat");
    let inpKcal = document.getElementById("kcal");
    inpKcal.addEventListener("keydown", sjekkVerdier);
    inpMat.addEventListener("keydown", sjekkVerdier);

    function sjekkVerdier(e) {
        if (e.key === "Enter") {
            let navn = inpMat.value;
            let kcal = Number(inpKcal.value);
            if (navn.length > 0 && kcal > 0) {
                let matvare = new Matvare(navn,kcal);
                matvareListe.push(matvare);
                tegnKakeDiagram();
            }
        }
    }

    function tegnKakeDiagram() {
        let fargeIndex = 0;
        let farge = farger[fargeIndex];
        ctx.beginPath();
        ctx.fillStyle = farge;
        ctx.clearRect(0,0,500,500);
        //ctx.fillRect(10, 10, 30, 30);
        ctx.arc(250, 250, 230, 0, Math.PI * 2, true);
        ctx.fill();

    }
}