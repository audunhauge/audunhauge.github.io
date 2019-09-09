// @ts-check

class Sprite {
    div;
    x;
    y;
    w;
    h;
    constructor(div,x,y,w,h) {
        this.div = div;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw() {
        this.div.style.top = this.y + "px";
        this.div.style.left = this.x + "px";
    }
}

class Movable extends Sprite {
    vx;
    vy;
    constructor(div,x,y,w,h,vx,vy) {
        super(div,x,y,w,h);
        this.vx = vx;
        this.vy = vy;
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;
    }
}

function $(element) {
    return document.getElementById(element);
}

function setup() {
    let divBrett = $("brett");
    let divInfo = $("info");
    let divScore = $("score");
    let ball, plate;

    const keys = new Set();

    function saveKey(e) {
        let k = e.key;
        keys.add(k);
    }

    function dropKey(e) {
        let k = e.key;
        keys.delete(k);
    }

    function lagBall() {
        let div = document.createElement("div");
        div.className = "ball";
        divBrett.appendChild(div);
        ball = new Movable(div, 100, 400,10,10,2,2);
    }

    function lagPlate() {
        let div = document.createElement("div");
        div.className = "plate";
        divBrett.appendChild(div);
        plate = new Movable(div,100,450,150,10,0,0)
    }

    function lagBrikker() {
        for (let j = 0; j < 12; j += 1) {
            for (let i = 0; i < 30; i += 1) {
                let div = document.createElement("div");
                div.className = "brikke";
                div.style.left = (i * 30) + "px";
                div.style.top = (j * 16) + "px";
                divBrett.appendChild(div);
            }
        }
    }

    function animate() {
        plate.vx *= 0.95;
        if (keys.has("s")) {
            plate.vx = 5;
        }
        if (keys.has("a")) {
            plate.vx = -5;
        }
        ball.move();
        plate.move();
        ball.draw();
        plate.draw();

    }

    lagBrikker();
    lagPlate();
    lagBall();
    startSpill();

    function startSpill() {
        addEventListener("keydown", saveKey);
        addEventListener("keyup", dropKey);
        setInterval(animate, 50);
    }

   

}