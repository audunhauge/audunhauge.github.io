// @ts-check

function setup() {
    let divSpacex = document.getElementById("spacex");
    let divInfo = document.getElementById("info");
    let divDrivstoff = document.getElementById("drivstoff");
    let drivstoff = 64;
    let h = window.innerHeight - 200 - 120;
    let py = -200;
    let fart = +2;
    let teller = 0;
    const MILLI = 100;

    divDrivstoff.style.height = drivstoff + "px";

    let ani = setInterval(animasjon, MILLI);

    document.addEventListener("keydown", startMotor);

    function startMotor(e) {
        let k = e.key;
        switch (k) {
            case " ":
                if (drivstoff > 0) {
                    fart = fart - 4;
                    drivstoff -= 4;
                    divDrivstoff.style.height = drivstoff + "px";
                }
                break;
        }
    }

    function animasjon() {
        teller++;
        py = py + fart;
        fart = fart + 1;
        divSpacex.style.top = py + "px";
        if (py > h) {
            clearInterval(ani);
            console.log(fart);
            if (fart < 8) {
                let msg = "Du har landa";
                let poeng = drivstoff;
                divInfo.innerHTML = `
               ${msg}. Du har ${poeng} poeng.
               Du brukte ${teller*MILLI/1000} s.
             `;

            } else {
                divInfo.innerHTML = "Du har krasja";
            }
        }
    }

}