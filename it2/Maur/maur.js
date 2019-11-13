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
    constructor(div,x,y) {
        this.div = div;
        this.x = x;
        this.y = y;
        this.r = 0;
    }
    render() {
        this.div.style.transform = `translate(${this.x}px,${this.y}px) rotate(${this.r}rad)`;
    }
}

class Maur extends Sprite {
    constructor(div, x, y, v) {
        super(div,x,y);
        this.v = v;
        this.turn = Math.random() - 0.5;
        this.r = Math.random() * Math.PI * 2;
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
        this.r = Math.atan2(vy,vx);
        this.r += this.turn * 0.1;
        if (Math.random() > 0.9) {
            this.turn = Math.random() - 0.5;
        }
    }
}

class Finger extends Sprite {
    constructor(div,x,y) {
        super(div,x,y);
    }
}



const alleMaur = [];

function setup() {
    let divGame = document.getElementById("game");
    let divFing = document.getElementById("fing");

    let fing = new Finger(divFing,250,250);

    setInterval(animate, 40);

    function animate() {
        if (alleMaur.length < 10) {
            let div = document.createElement("div");
            div.className = "maur";
            divGame.appendChild(div);
            let x = Math.random() * 500;
            let y = Math.random() * 500;
            let v = 2 + Math.random() * 5;
            let m = new Maur(div,x,y,v);
            alleMaur.push(m);
        }
        for (let maur of alleMaur) {
            maur.flytt();
            maur.render();
        }
        if (Keys.has("ArrowDown")) {
            fing.y += 10; 
        }
        fing.render();
    }
}