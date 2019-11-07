// @ts-check


class Matvare {
    constructor(navn, kcal) {
        this.navn = navn;
        this.kcal = kcal;
    }
}

const matvareListe = [];

const farger = "red,green,blue,yellow,orange,teal,gray,white,pink".split(",");
const sisteFarge = "lightblue";
const fargtall = farger.length;


function setup() {
    const canvas = document.getElementById("diagram");
    // @ts-ignore
    const ctx = canvas.getContext('2d');
    let inpMat = document.getElementById("mat");
    let inpKcal = document.getElementById("kcal");
    let btnSlett = document.getElementById("slett");
    inpKcal.addEventListener("keydown", sjekkVerdier);
    inpMat.addEventListener("keydown", sjekkVerdier);
    btnSlett.addEventListener("click", slettSiste);

    function slettSiste(e) {
        matvareListe.pop();
        tegnKakeDiagram();
    }

    function sjekkVerdier(e) {
        if (e.key === "Enter") {
            // @ts-ignore
            let navn = inpMat.value;
            // @ts-ignore
            let kcal = Number(inpKcal.value);
            if (navn.length > 0 && kcal > 0) {
                let matvare = new Matvare(navn, kcal);
                matvareListe.push(matvare);
                tegnKakeDiagram();
                // @ts-ignore
                inpKcal.value = "";
                // @ts-ignore
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
        ctx.font = '16px serif';
        for (let i = 0; i < matvareListe.length - 1; i++) {
            let farge = farger[fargeIndex % fargtall];
            tegnKakeBit(i, farge);
        }
        tegnKakeBit(matvareListe.length - 1, sisteFarge);

        // tegn en sirkel rundt kaka
        ctx.beginPath();
        ctx.arc(250, 250, 230, 0, 2 * Math.PI, false);
        ctx.stroke();

        function tegnKakeBit(i, farge) {
            let matvare = matvareListe[i];
            ctx.beginPath();
            ctx.moveTo(250, 250);
            ctx.fillStyle = farge;
            let grader = Math.PI * 2 * matvare.kcal / total;
            ctx.arc(250, 250, 230, start, start + grader, false);
            ctx.fill();
            let tekst = matvare.navn;
            ctx.save();
            ctx.fillStyle = "black";
            ctx.translate(250, 250);
            ctx.rotate(start);
            ctx.fillText(tekst, 150, 20);
            ctx.restore();
            fargeIndex++;
            start += grader;
        }


    }


}