// @ts-check

class Bil {
    constructor(w, h, x, y) {
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
        this.div = document.createElement("div");
        this.div.className = "bil";
    }
    move(dx, dy) {
       this.x += dx;
       this.y += dy;
       this.div.style.left = this.x + "px";
       this.div.style.top = this.y + "px";
    }
}

function setup() {
    let divMain = document.getElementById("main");
    let bil = new Bil(80, 30, 400, 400);
    divMain.appendChild(bil.div);

    document.addEventListener("keydown", styrBil);

    function styrBil(e) {
        switch (e.key) {
            case "a":
                driveLeft();
                break;
            case "s":
                driveDown();
                break;
            case "w":
                driveUp();
                break;
            case "d":
                driveRight();
                break;

        }
    }

    function driveDown() {
        let carDriving = [
            { transform: ' rotate(-90deg) translateX(0)' },
            { transform: ' rotate(-90deg) translateX(-30px)' },
        ];
        bil.div.animate(carDriving, carTiming);
        bil.move(0,30);
    }
    function driveLeft() {
        let carDriving = [
            { transform: ' translateX(0px)' },
            { transform: ' translateX(-30px)' },
        ];
        bil.div.animate(carDriving, carTiming);
        bil.move(-30,0);
    }
    function driveRight() {
        let carDriving = [
            { transform: ' translateX(0px)' },
            { transform: ' translateX(30px)' },
        ];
        bil.div.animate(carDriving, carTiming);
        bil.move(30,0);
    }
    function driveUp() {
        let carDriving = [
            { transform: ' rotate(-90deg) translateX(0)' },
            { transform: ' rotate(-90deg) translateX(30px)' },
        ];
        bil.div.animate(carDriving, carTiming);
        bil.move(0,30);
    }


    let carTiming = {
        fill: "forwards",
        duration: 300,
        iterations: 1
    }


}