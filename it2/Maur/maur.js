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
    x;
    y;
    w;
    h;
    r;
    div;
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

    spawn() {
        this.x = Math.random() * 5;
        this.y = Math.random() * 5;
        this.v = 2 + Math.random() * 5;
        this.r = Math.random() * Math.PI * 2;
        this.alive = true;
        this.render();
        this.div.style.opacity = 1;
    }

    die() {
        this.alive = false;
        this.div.style.opacity = 0;
    }

    flock(friend) {
        if (friend.x > 700) return;
        let dx = this.x - friend.x;
        let dy = this.y - friend.y;
        let d = Math.sqrt(dx*dx+dy*dy);
        if (d < 160 && d > 10) {
            this.r = ((2*this.r + friend.r/d) / (2+1/d));
            this.v = ((2*this.v + friend.v/d) / (2+1/d));
        }
    }

    flee(enemy) {
        let dx = this.x - enemy.x - enemy.w/2;
        let dy = this.y - enemy.y - enemy.h/2;
        if (Math.sqrt(dx*dx + dy*dy) < 100) {
            this.r = Math.atan2(dy,dx);
        }
    }

    flytt() {
        let vx = this.v * Math.cos(this.r);
        let vy = this.v * Math.sin(this.r);
        vx = this.v * Math.cos(this.r);
        vy = this.v * Math.sin(this.r);
        if (this.x > 1000) vx = -Math.abs(vx);
        if (this.x < 0) vx = Math.abs(vx);
        if (this.y > 800) vy = -Math.abs(vy);
        if (this.y < 0) vy = Math.abs(vy);
        this.r = Math.atan2(vy, vx);
       
        this.x += vx;
        this.y += vy;
        this.r += this.turn * 0.1;
        if (Math.random() > 0.9) {
            this.turn = Math.random() - 0.5;
        }
    }
}

class Finger extends Sprite {
    constructor(div, x, y, w, h) {
        super(div, x, y, w, h);
    }
}



const alleMaur = [];

function setup() {
    let divGame = document.getElementById("game");
    let divFing = document.getElementById("fing");

    let fing = new Finger(divFing, 250, 250, 40, 40);

    setInterval(animate, 40);

    function animate() {
        if (alleMaur.length < 400) {
            let div = document.createElement("div");
            div.className = "maur";
            divGame.appendChild(div);
            let x = Math.random() * 500;
            let y = Math.random() * 500;
            let v = 2 + Math.random() * 5;
            let m = new Maur(div, x, y, 20, 20, v);
            alleMaur.push(m);
        }
        for (let i=0; i < alleMaur.length; i++) {
            let m = alleMaur[i];
            if (!m.alive) continue;
            for (let j=i+1; j < alleMaur.length; j++) {
                let n = alleMaur[j];
                if (!n.alive) continue;
                n.flock(m);
            }
        }
        for (let maur of alleMaur) {
            if (maur.alive) {
                maur.flee(fing);
                maur.flytt();
                maur.render();
                if (maur.overlap(fing)) {
                    maur.die();
                }
            } else {
                if (Math.random() > 0.99) maur.spawn();
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