// @ts-check

function setup() {
    let divSpacex = document.getElementById("spacex");
    let divInfo = document.getElementById("info");
    let divLeft = document.getElementById("left");
    let divRight = document.getElementById("right");
    let divDrivstoff = document.getElementById("drivstoff");
    let drivstoff = 64;
    let h = window.innerHeight - 200 - 120;
    let py = -200;
    let fart = +2;
    let teller = 0;
    const MILLI = 100;

    let foldmotor1, foldmotor2;
    let legsUp = true;  // legs folded up
    {
        let carTiming = {
            fill: "forwards",
            duration: 1000,
            iterations: 1
        }
        foldmotor1 = divLeft.animate([
            { transform: ' rotate(0)' },
            { transform: ' rotate(-130deg)' },
        ], carTiming);
        foldmotor1.pause();
        foldmotor2 = divRight.animate([
            { transform: ' rotate(0)' },
            { transform: ' rotate(130deg)' },
        ], carTiming);
        foldmotor2.pause();
    }

    function glide(dy) {
        let carDriving = [
            { transform: ' translateY(0)' },
            { transform: ` translateY(${dy}px)` },
        ];
        let carTiming = {

            duration: MILLI - 2,
            iterations: 1
        }
        return divSpacex.animate(carDriving, carTiming);
    }

    divDrivstoff.style.height = drivstoff + "px";

    let ani = setInterval(animasjon, MILLI);

    document.addEventListener("keydown", startMotor);

    let impuls = 0;   // settes til 4 når motoren brukes

    function startMotor(e) {
        let k = e.key;
        switch (k) {
            case " ":
                if (drivstoff > 0 && impuls === 0) {
                    // merk at motoren startes ikke nå
                    // det skjer på neste frame
                    impuls = 4;
                    drivstoff -= impuls;
                    divDrivstoff.style.height = drivstoff + "px";
                }
                break;
        }
    }

    function animasjon() {
        teller++;
        fart = fart + 1 - impuls;
        py = py + fart;
        impuls = 0;
        let gli = glide(fart);
        gli.onfinish = () => divSpacex.style.top = py + "px";
        if (py > h - 100 && legsUp) {
            foldmotor1.play();
            foldmotor2.play();
            legsUp = false;   // only fold down once
        }
        if (py > h) {
            clearInterval(ani);
            console.log(fart);
            if (fart < 8) {
                let msg = "Du har landa";
                let poeng = drivstoff;
                divInfo.innerHTML = `
               ${msg}. Du har ${poeng} poeng.
               Du brukte ${teller * MILLI / 1000} s.
             `;

            } else {
                divInfo.innerHTML = "Du har krasja";
                let finale = drivstoff > 0 ?
                    { transform: ` scale(2) rotate(90deg)`, opacity: "0" } :
                    { transform: ` scale(1) rotate(90deg) translateX(100px)`, opacity: "1" };
                let explode = divSpacex.animate(
                    [
                        { transform: ` scale(1) rotate(0)`, opacity: "1" },
                        finale
                    ], {
                        fill: "forwards",
                        duration: 1000,
                        iterations: 1
                    }
                );
            }
        }
    }
}


