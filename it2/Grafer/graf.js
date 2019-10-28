// @ts-check

const temperaturData = [];

function setup() {
    let divMain = document.getElementById("main");
    let cnvBilde = document.getElementById("bilde");
    let inpTemp = document.getElementById("temp");
    let btnTegn = document.getElementById("tegn");

    addEventListener("keydown", sjekkInput);

    btnTegn.addEventListener("click", tegnGraf);
    const ctx = cnvBilde.getContext('2d');




    function sjekkInput(e) {
        if (e.key === "Enter") {
            let temp = Number(inpTemp.value);
            if (Number.isFinite(temp)) {
                temperaturData.push(temp);
                inpTemp.value = "";
                inpTemp.focus();
            }
        }
    }

    function sirkel(x,y) {
        
    }

    function tegnGraf() {
        
        ctx.clearRect(0, 0, 500, 500);
        ctx.beginPath();
        ctx.strokeStyle = "blue";
        if (temperaturData.length > 1) {
            let diff = 480 / (temperaturData.length - 1)
            let temp = temperaturData[0];
            let y = 500 - (temp + 20) * 500 / 60
            ctx.moveTo(10, y);
            for (let i = 1; i < temperaturData.length; i++) {
                let temp = temperaturData[i];
                let y = 500 - (temp + 20) * 500 / 60
                ctx.lineTo(10 + diff * i, y);
            }
            ctx.stroke();
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

}