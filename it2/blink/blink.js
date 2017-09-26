

/**
 * Sprite - Et element som skal vises på skjermen, gitt plassering,w,h og rotasjon
 * Rotasjon kan settes etterpå:  
 *   let p = new Sprite(myDiv,10,10,10,10);
 *   p.rot = (20); p.render();
 * Merk at p.render() må kjøres manuelt etter endring
 * Du kan lage et fake element uten div,
 *   let box = new Sprite(null,0,0,800,600);
 *   Kan være nyttig til å sjekke kollisjoner - vises ikke på skjermen
 * Sprite.overlap(a,b) sjekker om to Sprites overlapper
 * Dette er en statisk funksjon som brukes på samme måte som
 *  Math.sin(), du kan ikke skrive p.overlap()
 */
class Sprite {

    constructor(div, x, y, w, h) {
        this.div = div;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.rot = 0;
        this.radius = (w + h) / 4;
    }

    render() {
        if (!this.div) return;
        this.div.style.left = this.x - this.radius + "px";
        this.div.style.top = this.y - this.radius + "px";
        this.div.style.transform = "rotate(" + this.rot + "deg)";
    }

    static overlap(a, b) {
        return a.x < b.x + b.w && a.x > b.x - a.w && a.y < b.y + b.h && a.y > b.y - a.h;
    }
}

/**
 *  en Movable er en Sprite som kan bevege seg
 *  konstrueres som en sprite, men må ta med rot og velocity
 *  En movable p har p.flytt() og p.roter() som metoder
 */
class Movable extends Sprite {
    // previous position
    constructor(div, x, y, w, h, rot, velocity) {
        super(div, x, y, w, h); // konstruer spriten først
        this.px = x;
        this.py = y;
        this.rot = rot;
        let vinkel = this.rot * Math.PI / 180;
        this.x += velocity * Math.cos(vinkel);
        this.y += velocity * Math.sin(vinkel);
        this.alive = true;
    }

    static get damping() {
        return 1.0;
    }

    accelerate(delta) {
        if (!this.alive) return;
        this.x += this.ax * delta * delta;
        this.y += this.ay * delta * delta;
        this.ax = 0;
        this.ay = 0;
    }

    inertia(delta) {
        if (!this.alive) return;
        let x = this.x * 2 - this.px;
        let y = this.y * 2 - this.py;
        this.px = this.x;
        this.py = this.y;
        this.x = x;
        this.y = y;
    }

    roter(delta) {
        if (!this.alive) return;
        let vx = this.x - this.px;
        let vy = this.y - this.py;
        this.rot = (this.rot + delta) % 360;
        let angle = this.rot;
        let velocity = Math.sqrt(vx * vx + vy * vy);
        let vinkel = angle * Math.PI / 180;
        this.x = this.px + velocity * Math.cos(vinkel);
        this.y = this.py + velocity * Math.sin(vinkel);
        this.render();
    }

    edge(box) {
        let damping = Movable.damping;
        let radius = this.radius;
        let x = this.x;
        let y = this.y;

        if (x - radius < 0) {
            let vx = (this.px - this.x) * damping;
            this.x = radius;
            this.px = this.x - vx;
        } else if (x + radius > box.w) {
            let vx = (this.px - this.x) * damping;
            this.x = box.w - radius;
            this.px = this.x - vx;
        }
        if (y - radius < 0) {
            let vy = (this.py - this.y) * damping;
            this.y = radius;
            this.py = this.y - vy;
        } else if (y + radius > box.h) {
            let vy = (this.py - this.y) * damping;
            this.y = box.h - radius;
            this.py = this.y - vy;
        }
    }

    static physics(bodies) {

        function collide(bodies, preserve_impulse = true) {
            let damping = Movable.damping;
            for (let i = 0, l = bodies.length; i < l; i++) {
                let body1 = bodies[i];
                if (!body1.alive) continue;
                for (let j = i + 1; j < l; j++) {
                    let body2 = bodies[j];
                    if (!body2.alive) continue;
                    let x = body1.x - body2.x;
                    let y = body1.y - body2.y;
                    let slength = x * x + y * y;
                    let length = Math.sqrt(slength);
                    let target = body1.radius + body2.radius;

                    if (length < target) {
                        let v1x = body1.x - body1.px;
                        let v1y = body1.y - body1.py;
                        let v2x = body2.x - body2.px;
                        let v2y = body2.y - body2.py;

                        let factor = (length - target) / length;
                        body1.x -= x * factor * 0.5;
                        body1.y -= y * factor * 0.5;
                        body2.x += x * factor * 0.5;
                        body2.y += y * factor * 0.5;

                        if (preserve_impulse) {
                            let f1 = damping * (x * v1x + y * v1y) / slength;
                            let f2 = damping * (x * v2x + y * v2y) / slength;

                            v1x += f2 * x - f1 * x;
                            v2x += f1 * x - f2 * x;
                            v1y += f2 * y - f1 * y;
                            v2y += f1 * y - f2 * y;

                            body1.px = body1.x - v1x;
                            body1.py = body1.y - v1y;
                            body2.px = body2.x - v2x;
                            body2.py = body2.y - v2y;
                        }
                    }
                }
            }
        }

        collide(bodies);
    }
}

class Blink extends Movable {
    /**
     *  Legger til egenskaper som er spesifikk for Blink
     */
    respawn() {
        let xpos, ypos, vx, vy;
        if (Math.random() > 0.5) {
            // plasser oppe/nede
            xpos = Math.floor(Math.random() * 700) + 10;
            vx = Math.floor(Math.random() * 4) - 2;
            if (Math.random() > 0.5) {
                // plasser oppe               
                ypos = 10;
                vy = Math.floor(Math.random() * 4) + 1;
            } else {
                // plasser nede
                ypos = 550;
                vy = -Math.floor(Math.random() * 4) - 1;
            }
        } else {
            // plasser høyre/venstre
            ypos = Math.floor(Math.random() * 500) + 10;
            vy = Math.floor(Math.random() * 4) - 2;
            if (Math.random() > 0.5) {
                // plasser høyre
                xpos = 730;
                vx = -Math.floor(Math.random() * 4) - 1;
            } else {
                // plasser venstre
                xpos = 10;
                vx = Math.floor(Math.random() * 4) + 1;
            }
        }
        this.px = xpos;
        this.py = ypos;
        this.y = ypos + vy;
        this.x = xpos + vx;
        this.alive = true;
    }

}

class Tank extends Movable {
    constructor(div, x, y, w, h, rot, velocity) {
        super(div, x, y, w, h, rot, velocity);
        this.hitpoints = 100;
        this.reload = 0;
    }

    skyt(skudd) {
        this.reload = 15; // tanks kan ikke snu/skyte på xx frames
        let angle = this.rot;
        let vinkel = angle * Math.PI / 180;
        let vx = 20 * Math.cos(vinkel);
        let vy = 20 * Math.sin(vinkel);
        skudd.x = this.x;
        skudd.y = this.y;
        skudd.px = skudd.x - vx;
        skudd.py = skudd.y - vy;

        skudd.alive = true;
        skudd.div.classList.remove("hidden");
    }

    takeDamage() {
        this.hitpoints -= 7;
        let p = Math.floor(this.hitpoints / 10);
        this.div.classList.remove(..."h0,h1,h2,h3,h4,h5,h6,h7,h8,h9".split(','));
        this.div.classList.add("h" + p);
        if (this.hitpoints < 0) {
            this.alive = false;
        } else {
            this.div.animate([
            // keyframes
            { backgroundColor: "red" }, { backgroundColor: "green" }], {
                // timing options
                duration: 250,
                iterations: 1
            });
        }
    }

}

function setup() {

    let antallBlinker = 5;

    let keys = {}; // registrerer alle keys som er trykket ned
    let manyBlinks = [];

    let box = new Sprite(null, 0, 0, 800, 600); // rammen rundt spillet
    let wall = new Sprite(null, 50, 50, 700, 500); // vegg rundt tanksen


    let divTank = document.getElementById("tank");
    let divSkudd = document.getElementById("skudd");

    // her lager vi alle blinkene
    for (let i = 0; i < antallBlinker; i++) {
        let divBlink = document.createElement('div');
        divBlink.className = "sprite blink";
        let blinkSprite = new Blink(divBlink, 0, 0, 30, 30, 0, 2);
        blinkSprite.respawn(); // plasser tilfeldig langs kant
        let divMain = document.getElementById("main");
        if (divMain !== null) {
            divMain.appendChild(divBlink);
        }
        manyBlinks.push(blinkSprite);
    }

    let tank = new Tank(divTank, 250, 250, 26, 26, 0, 2);
    let skudd = new Movable(divSkudd, 260, 260, 10, 10, 0, 20);
    skudd.alive = false;

    tank.render();

    setInterval(gameEngine, 40);

    window.addEventListener("keydown", registrerKey);
    window.addEventListener("keyup", cancelKey);

    function registrerKey(keyEvent) {
        event.preventDefault();
        keys[keyEvent.keyCode] = 1; // marker at denne key er aktiv
    }

    function cancelKey(keyEvent) {
        event.preventDefault();
        keys[keyEvent.keyCode] = 0; // bruker slapp opp denne key-en
    }

    function gameEngine(e) {
        for (let blink of manyBlinks) {
            blink.inertia(1);
            blink.edge(box);
            blink.render();
        }
        skudd.render();
        skudd.inertia(1);
        tank.inertia(1);
        tank.edge(box);
        tank.render();
        styrSpillet();
        tank.reload--;
        kollisjonSkudd();
        kollisjonTanks();
        Movable.physics(manyBlinks);
    }

    function kollisjonSkudd() {
        for (let blink of manyBlinks) {
            if (!blink.alive || !skudd.alive) return;
            let dx = blink.x - skudd.x;
            let dy = blink.y - skudd.y;
            let avstand = Math.sqrt(dx * dx + dy * dy);
            if (avstand < blink.radius + skudd.radius) {
                // if (Sprite.overlap(blink, skudd)) {
                blink.alive = false;
                skudd.alive = false;
                skudd.div.classList.add("hidden");
                setTimeout(() => blink.respawn(), 1000);
            }
        }
    }

    function kollisjonTanks() {
        if (!tank.alive) return;
        for (let blink of manyBlinks) {
            if (!blink.alive) return;
            if (Sprite.overlap(blink, tank)) {
                blink.alive = false;
                tank.takeDamage();
                setTimeout(() => blink.respawn(), 1000);
            }
        }
    }

    function styrSpillet() {
        if (tank.reload > 0) return;
        if (keys[32] === 1) {
            tank.skyt(skudd);
        }
        if (keys[39] === 1) {
            tank.roter(3);
        }
        if (keys[37] === 1) {
            tank.roter(-3);
        }
    }
}
//*/