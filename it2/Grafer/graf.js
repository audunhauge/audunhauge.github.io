// @ts-check

const temperaturListe = [];

function setup() {
    let inpTemp = document.getElementById('temp');

    let canvas = document.getElementById('bilde');
    let ctx = canvas.getContext('2d');
    
    inpTemp.focus();

    inpTemp.addEventListener("keypress", sjekkInput);

    function sjekkInput(e) {
        if (e.key === "Enter") {
            let temp = Number(inpTemp.value);
            if (Number.isFinite(temp)) {
                temperaturListe.push(temp);
                inpTemp.value = "";
                inpTemp.focus();
                tegnGraf();
            }
        }
    }

    function tegnGraf() {
        ctx.clearRect(0, 0, 500, 500);
        ctx.beginPath();
        ctx.font = '16px serif';
        ctx.fillStyle = 'green';
        ctx.strokeStyle = "blue";
        let antall = temperaturListe.length;
        if (antall > 1) {
            let temp = temperaturListe[0];
            let diff = 480 / (antall - 1);
            let y = 500 - (temp + 20) * 500 / 60;
            ctx.moveTo(10, y);
            for (let i = 1; i < antall; i++) {
                let temp = temperaturListe[i];
                let y = 500 - (temp + 20) * 500 / 60;
                ctx.lineTo(10 + i * diff, y);
            }
            ctx.stroke();
            ctx.beginPath();
            ctx.strokeStyle = "green";
            ctx.fillStyle = 'white';
            for (let i = 0; i < antall; i++) {
                let temp = temperaturListe[i];
                let y = 500 - (temp + 20) * 500 / 60;
                let x = 10 + i * diff;
                ctx.moveTo(x, y);
                ctx.arc(x, y, 3, 0, Math.PI * 2, true);
            }
            ctx.stroke();
            ctx.fill();
            ctx.beginPath();
            for (let i = 0; i < antall; i++) {
                let temp = temperaturListe[i];
                if (temp < 0 ) {
                    ctx.fillStyle = 'red';
                } else {
                    ctx.fillStyle = 'green';
                }
                let y = 500 - (temp + 20) * 500 / 60;
                let x = 10 + i * diff;
                if (x > 460) {
                    ctx.fillText(String(temp), x - 20, y);
                } else {
                    ctx.fillText(String(temp), x, y);
                }
            }
            ctx.fill();
        } else {
            ctx.fillRect(10, 10, 30, 30);
        }
    }


}

/*
ctx.fillStyle = 'green';
ctx.fillRect(100, 10, 15, 10);
ctx.fillStyle = 'blue';
ctx.beginPath();
ctx.moveTo(75, 50);
ctx.lineTo(100, 75);
ctx.lineTo(100, 25);
ctx.fill();
ctx.fillStyle = 'red';
ctx.beginPath();
ctx.arc(175, 75, 20, 0, Math.PI * 2, true); // Outer circle
ctx.fill();
*/