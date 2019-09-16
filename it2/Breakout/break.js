// @ts-check

class Sprite {
    x; y; w; h; div;
    constructor(div, x, y, w, h) {
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
    overlap(b) {
        let a = this;
        return a.x > b.x - a.w &&
            a.x < b.x + b.w &&
            a.y > b.y - a.h &&
            a.y < b.y + b.h
    }
}

class Movable extends Sprite {
    vx; vy;
    constructor(div, x, y, w, h, vx, vy) {
        super(div, x, y, w, h);
        this.vx = vx;
        this.vy = vy;
    }
    move() {
        this.x += this.vx;
        this.y += this.vy;
    }
}

class Breakable extends Sprite {
    dead = false;
    constructor(div, x, y, w, h) {
        super(div, x, y, w, h);
    }
    breakme() {
        this.dead = true;
        this.div.classList.add("hidden");
    }
    overlap(b) {
        if (this.dead) return false;
        return super.overlap(b);
    }

}


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


function $(element) {
    return document.getElementById(element);
}

function setup() {
    let divBrett = $("brett");
    let divStatus = $("status");
    let divScore = $("score");
    let ball, plate;

    let anime;
    let poeng = 0;
    let baller = 7;

    const brikkeListe = [];

    function lagBall() {
        let div = document.createElement("div");
        div.className = "ball";
        divBrett.appendChild(div);
        ball = new Movable(div, 200, 400, 10, 10, 5, -5);
        ball.draw();
    }

    function lagPlate() {
        let div = document.createElement("div");
        div.className = "plate";
        divBrett.appendChild(div);
        plate = new Movable(div, 150, 450, 150, 10, 0, 0);
        plate.draw();
    }

    function lagBrikker() {
        for (let j = 0; j < 12; j += 1) {
            for (let i = 0; i < 30; i += 1) {
                let div = document.createElement("div");
                div.className = "brikke";
                let x = i * 30;
                let y = j * 16;
                div.style.left = x + "px";
                div.style.top = y + "px";
                divBrett.appendChild(div);
                let brikke = new Breakable(div, x, y, 26, 12);
                brikke.draw();
                brikkeListe.push(brikke);
            }
        }
    }

    function animate() {
        plate.vx *= 0.85;
        if (Keys.has(" ")) {
            if (ball.vx === 0 && ball.vy === 0) {
                ball.vx = Math.random() * 8 + 2;
                ball.vy = -Math.random() * 8 + -5;
            }
        }
        if (Keys.has("a") || Keys.has("ArrowLeft")) {
            plate.vx = -10;
        }
        if (Keys.has("d") || Keys.has("ArrowRight")) {
            plate.vx = 10;
        }
        if (ball.y < 0) {
            ball.vy = Math.abs(ball.vy);
        }
        if (ball.x > 890) {
            ball.vx = -Math.abs(ball.vx);
        }

        if (ball.y > 490) {
            ball.vx = ball.vy = 0;
            ball.x = plate.x + plate.w / 2 - ball.w / 2;
            ball.y = plate.y - ball.h;
            poeng -= 20;
            baller -= 1;
            if (baller < 1) {
                clearInterval(anime);
                divStatus.innerHTML = "Game over";
            } else {
                divStatus.innerHTML = `You 
                have 
                ${baller} 
                left`;
            }
        }

        if (ball.x < 0) {
            ball.vx = Math.abs(ball.vx);
        }

        if (ball.overlap(plate)) {
            ball.vy = -Math.abs(ball.vy);
        }

        for (let brikke of brikkeListe) {
            if (brikke.overlap(ball)) {
                brikke.breakme();
                ball.vy = -ball.vy;
                poeng += 1;
                divScore.innerHTML = String(poeng);
                break;
            }
        }


        plate.move();
        plate.draw();

        ball.move();
        ball.draw();
    }

    lagBrikker();
    lagPlate();
    lagBall();
    startSpill();

    function startSpill() {
        anime = setInterval(animate, 50);
    }
}
