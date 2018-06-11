// @ts-check

function setup() {

    let frmSkjema = document.getElementById("skjema");
    let divTabell = document.getElementById("tabell");

    var forbruk = [
        ["Lettmelk", 92, 6.6, 3, 9.6],
        ["1 egg", 80, 6.9, 5.5, 0.7],
        ["Grovbrød", 103, 3.5, 1, 19.6],
        ["Smør", 36, 0.025, 4.1, 0.025],
        ["Gulost", 53, 4, 4.2, 0]
    ];

    let varer = "melk,egg,fisk,ost".split(",");
    for (let mat of varer) {
        let div = document.createElement("div");
        div.innerHTML = `<label> ${mat} <input type="number" id="${mat}"></label>`;
        frmSkjema.appendChild(div);
    }

    frmSkjema.addEventListener("change", tegnKake);

    function tegnKake(e) {
        let verdier = [];
        for (let mat of varer) {
            verdier.push(document.getElementById(mat).valueAsNumber || 0);
        }

        verdier = verdier.map((v, i) => v * forbruk[i][1]);

        let sum = verdier.reduce((s, v) => s + v, 0);

        let data = verdier.map(v => v * 360 / sum);

        divTabell.innerHTML = "Summen er " + sum + " kcal";


        var canvas = document.getElementById("diagram");
        var context = canvas.getContext("2d");
        // visk vekk alt fra canvas
        context.clearRect(0, 0, 300, 300);

        let colors = "red,green,yellow,blue,pink".split(",");
        let labels = varer;

        // for alle data (de matvarene som er valgt)
        for (let idx = 0; idx < data.length; idx++) {
            // tegner ett kakesegment for hvert datasett
            drawSegment(canvas, context, data, colors, labels, idx);
        }
    }

}

function drawSegment(canvas, context, data, colors, labels, i) {
    context.save();
    var centerX = Math.floor(canvas.width / 2);
    var centerY = Math.floor(canvas.height / 2);
    let radius = Math.floor(canvas.width / 2);
    var startingAngle = degreesToRadians(sumTo(data, i));
    var arcSize = degreesToRadians(data[i]);
    var endingAngle = startingAngle + arcSize;
    context.beginPath();
    context.moveTo(centerX, centerY);
    context.arc(centerX, centerY, radius,
        startingAngle, endingAngle, false);
    context.closePath();
    context.fillStyle = colors[i];
    context.fill();
    context.restore();
    drawSegmentLabel(canvas, context, data, labels, i);
}
function degreesToRadians(degrees) {
    return (degrees * Math.PI) / 180;
}
function sumTo(a, i) {
    var sum = 0;
    for (var j = 0; j < i; j++) {
        sum += a[j];
    }
    return sum;
}
function drawSegmentLabel(canvas, context, data, labels, i) {
    context.save();
    var x = Math.floor(canvas.width / 2);
    var y = Math.floor(canvas.height / 2);
    var angle = degreesToRadians(sumTo(data, i));
    context.translate(x, y);
    context.rotate(angle);
    var dx = Math.floor(canvas.width * 0.5) - 10;
    var dy = Math.floor(canvas.height * 0.05);
    context.textAlign = "right";
    var fontSize = Math.floor(canvas.height / 25);
    context.font = fontSize + "pt Helvetica";
    context.fillText(labels[i], dx, dy);
    context.restore();
}