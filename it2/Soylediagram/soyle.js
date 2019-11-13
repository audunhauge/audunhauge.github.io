// @ts-check

class Soyle {
    constructor(value, label = "", farge = "") {
        this.label = label;
        this.farge = farge;
        this.value = value;
    }
}

const data = [
    new Soyle(200, "ost", "red"),
    new Soyle(300, "egg", "green"),
    new Soyle(400),
];


function setup() {
    let divCanvas = document.getElementById("grafikk");
    // @ts-ignore
    let ctx = divCanvas.getContext("2d");
    tegnDiagram();

    function tegnDiagram() {

        ctx.clearRect(0, 0, 500, 500);
        ctx.font = '16px serif';
        for (let i = 0; i < data.length; i++) {
            let soyle = data[i];
            ctx.beginPath();
            ctx.fillStyle = soyle.farge || "lightblue";
            let x = 80 + i * 30;
            let h = soyle.value;
            let y = 500 - h;
            let w = 20;
            let tekst = soyle.label || soyle.value;
            ctx.fillRect(x, y, w, h);
            ctx.fill();
            ctx.save();
            ctx.fillStyle = "black";
            ctx.translate(x + 10, y);
            ctx.rotate(-Math.PI / 4);
            ctx.fillText(tekst, 0, 0);
            ctx.restore();
        }
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 500);
        ctx.stroke();

        for (let i = 0; i < 6; i++) {
            ctx.beginPath();
            let x = 0;
            let y = 100 * i;
            ctx.moveTo(x, y);
            ctx.lineTo(x + 5, y);
            ctx.stroke();
            ctx.beginPath()
            ctx.fillStyle = "black";
            ctx.fillText(String((5 - i) * 100), x + 5, y + 5);
        }
    }

}