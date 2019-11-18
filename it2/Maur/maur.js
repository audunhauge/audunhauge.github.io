// @ts-check

class Keys {
    static keys = new Set();
    static za = document.addEventListener("keydown", Keys.mark)
    static zb = document.addEventListener("keyup", Keys.unmark);
    static mark(e) { Keys.keys.add(e.key); }
    static unmark(e) { Keys.keys.delete(e.key); }
    static any() { return Keys.keys.size > 0; }
    static many() { return Keys.keys.size > 1; }
    static has(a) { return Keys.keys.has(a); }
}

class Sprite {
    constructor(div, x, y, w, h) {
        this.div = div;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.r = 0;
    }
    render() {
        this.div.style.transform = `translate(${this.x}px,${this.y}px) rotate(${this.r}rad)`;
    }

    overlap(andre) {
        let a = this;
        let b = andre;
        return a.x > b.x - a.w &&
            a.x < b.x + b.w &&
            a.y > b.y - a.h &&
            a.y < b.y + b.h;
    }
}

class Maur extends Sprite {
    constructor(div, x, y, w, h, v) {
        super(div, x, y, w, h);
        this.v = v;
        this.turn = Math.random() - 0.5;
        this.r = Math.random() * Math.PI * 2;
        this.alive = true;
    }

    die() {
        this.alive = false;
        this.div.style.opacity = 0;
    }

    flytt() {
        let vx = this.v * Math.cos(this.r);
        let vy = this.v * Math.sin(this.r);
        this.x += vx;
        this.y += vy;
        if (this.x > 500) vx = -Math.abs(vx);
        if (this.x < 0) vx = Math.abs(vx);
        if (this.y > 500) vy = -Math.abs(vy);
        if (this.y < 0) vy = Math.abs(vy);
        this.r = Math.atan2(vy, vx);
        this.r += this.turn * 0.1;
        if (Math.random() > 0.9) {
            this.turn = Math.random() - 0.5;
        }
    }
}

class Finger extends Sprite {
    constructor(div, x, y, w, h) {
        super(div, x, y);
    }
}



const alleMaur = [];

function setup() {
    let divGame = document.getElementById("game");
    let divFing = document.getElementById("fing");

    let fing = new Finger(divFing, 250, 250, 40, 40);

    setInterval(animate, 80);

    function animate() {
        if (alleMaur.length < 1000) {
            let div = document.createElement("div");
            div.className = "maur";
            divGame.appendChild(div);
            let x = Math.random() * 500;
            let y = Math.random() * 500;
            let v = 2 + Math.random() * 5;
            let m = new Maur(div, x, y, 20, 5, v);
            alleMaur.push(m);
        }
        for (let maur of alleMaur) {
            if (maur.alive) {
                maur.flytt();
                maur.render();
                if (maur.overlap(fing)) {
                    maur.die();
                }
            }
        }
        if (Keys.has("ArrowDown")) {
            fing.y += 10;
        }
        if (Keys.has("ArrowUp")) {
            fing.y -= 10;
        }
        if (Keys.has("ArrowLeft")) {
            fing.x -= 10;
        }
        if (Keys.has("ArrowRight")) {
            fing.x += 10;
        }
        fing.render();
    }
}