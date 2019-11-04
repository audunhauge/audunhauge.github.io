// @ts-check


class Matvare {
    constructor(navn, kcal) {
        this.navn = navn;
        this.kcal = kcal;
    }
}

const matvareListe = [];

const farger = "red,green,blue,yellow,orange,teal,gray,white,pink".split(",");
const fargtall = farger.length;


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
                let matvare = new Matvare(navn, kcal);
                matvareListe.push(matvare);
                tegnKakeDiagram();
                inpKcal.value = "";
                inpMat.value = "";
                inpMat.focus();
                return;
            }
            if (e.target.id === "mat") {
                // trykket enter i mat - flytt til kcal
                // slipper å bruke tab
                inpKcal.focus();
            }

        }
    }

    function totalSum(arr) {
        let sum = 0;
        for (let matvare of arr) {
            sum += matvare.kcal;
        }
        return sum;
    }

    function tegnKakeDiagram() {
        let total = totalSum(matvareListe);
        let start = 0;
        let fargeIndex = 0;
        ctx.clearRect(0, 0, 500, 500);
        for (let matvare of matvareListe) {
            ctx.beginPath();
            ctx.moveTo(250, 250);
            let farge = farger[fargeIndex % fargtall];
            ctx.fillStyle = farge;
            let grader = Math.PI * 2 * matvare.kcal / total;
            ctx.arc(250, 250, 230, start, start + grader, false);
            ctx.fill();
            fargeIndex++;
            start += grader;
        }
        // tegn en sirkel rundt kaka
        ctx.beginPath();
        ctx.arc(250, 250, 230, 0, 2 * Math.PI, false);
        ctx.stroke();
    }
}