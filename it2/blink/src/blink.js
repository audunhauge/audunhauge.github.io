// @flow


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
    div: any;
    x: number;
    y: number;
    w: number;
    h: number;
    rot: number;

    constructor(div, x, y, w, h) {
        this.div = div;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.rot = 0;
    }

    render() {
        if (!this.div) return;
        this.div.style.left = this.x + "px";
        this.div.style.top = this.y + "px";
        this.div.style.transform = "rotate(" + this.rot + "deg)";
    }

    static overlap(a: Sprite, b: Sprite) {
        return (a.x < b.x + b.w &&
            a.x > b.x - a.w &&
            a.y < b.y + b.h &&
            a.y > b.y - a.h
        )
    }
}

/**
 *  en Movable er en Sprite som kan bevege seg
 *  konstrueres som en sprite, men må ta med rot og velocity
 *  En movable p har p.flytt() og p.roter() som metoder
 */
class Movable extends Sprite {
    vx: number;
    vy: number;
    alive: boolean;
    constructor(div, x, y, w, h, rot, velocity) {
        super(div, x, y, w, h);   // konstruer spriten først
        this.rot = rot;
        let vinkel = this.rot * Math.PI / 180
        this.vx = velocity * Math.cos(vinkel);
        this.vy = velocity * Math.sin(vinkel);
        this.alive = true;
    }

    flytt() {
        if (!this.alive) return;
        this.x += this.vx;
        this.y += this.vy;
        this.render();
    }

    roter(delta) {
        if (!this.alive) return;
        this.rot += delta;
        let angle = this.rot;
        let velocity = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        let vinkel = angle * Math.PI / 180
        this.vx = velocity * Math.cos(vinkel);
        this.vy = velocity * Math.sin(vinkel);
        this.render();
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
        this.x = xpos;
        this.y = ypos
        this.vy = vy;
        this.vx = vx;
        this.alive = true;
    }
    /**
     * Sjekk om blinken har kommet utenfor brettet
     */
    bounce(box: Sprite) {
        if (!Sprite.overlap(this, box)) {
            this.respawn();
        }
    }
}

class Tank extends Movable {
    hitpoints: number;
    constructor(div, x, y, w, h, rot, velocity) {
        super(div, x, y, w, h, rot, velocity);
        this.hitpoints = 100;
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
                { backgroundColor: "red" },
                { backgroundColor: "green" },

            ], {
                    // timing options
                    duration: 250,
                    iterations: 1
                });
        }
    }

    bounce(box: Sprite, wall: Sprite) {
        if (!Sprite.overlap(this, wall)) {
            this.x = Math.max(wall.x - this.w, Math.min(this.x, wall.w + wall.x));
            this.y = Math.max(wall.y - this.h, Math.min(this.y, wall.h + wall.y));
        }
    }
}



function setup() {

    let antallBlinker = 5;

    let keys = {};   // registrerer alle keys som er trykket ned
    let manyBlinks = [];

    let box = new Sprite(null, 0, 0, 800, 600);  // rammen rundt spillet
    let wall = new Sprite(null, 50, 50, 700, 500);  // vegg rundt tanksen


    let divTank = document.getElementById("tank");
    let divSkudd = document.getElementById("skudd");


    // her lager vi alle blinkene
    for (let i = 0; i < antallBlinker; i++) {
        let divBlink = document.createElement('div');
        divBlink.className = "sprite blink";
        let blinkSprite = new Blink(divBlink, 0, 0, 30, 30, 0, 2);
        blinkSprite.respawn();  // plasser tilfeldig langs kant
        let divMain = document.getElementById("main");
        if (divMain !== null) {
            divMain.appendChild(divBlink);
        }
        manyBlinks.push(blinkSprite);
    }





    let tank = new Tank(divTank, 250, 250, 50, 50, 0, 2);
    let skudd = new Movable(divSkudd, 260, 260, 10, 10, 0, 20);


    tank.render();

    setInterval(gameEngine, 40);

    window.addEventListener("keydown", registrerKey);
    window.addEventListener("keyup", cancelKey);

    function registrerKey(keyEvent) {
        event.preventDefault();
        keys[keyEvent.keyCode] = 1;  // marker at denne key er aktiv
    }

    function cancelKey(keyEvent) {
        event.preventDefault();
        keys[keyEvent.keyCode] = 0;   // bruker slapp opp denne key-en
    }



    function gameEngine(e) {
        for (let blink of manyBlinks) {
            blink.flytt();
            blink.bounce(box);
        }
        skudd.flytt();
        tank.flytt();
        tank.bounce(box, wall);
        styrSpillet();
        kollisjonSkudd();
        kollisjonTanks();
    }

    function kollisjonSkudd() {
        for (let blink: Blink of manyBlinks) {
            if (!blink.alive || !skudd.alive) return;
            if (Sprite.overlap(blink, skudd)) {
                blink.alive = false;
                skudd.alive = false;
                skudd.div.classList.add("hidden");
                setTimeout(() => blink.respawn(), 1000);
            }
        }
    }

    function kollisjonTanks() {
        for (let blink of manyBlinks) {
            if (!blink.alive || !tank.alive) return;
            if (Sprite.overlap(blink, tank)) {
                blink.alive = false;
                tank.takeDamage();
                setTimeout(() => blink.respawn(), 1000);
            }
        }
    }


    function skyt() {
        let angle = tank.rot;
        let vinkel = angle * Math.PI / 180
        let vx = 20 * Math.cos(vinkel);
        let vy = 20 * Math.sin(vinkel);
        skudd.vx = vx;
        skudd.vy = vy;
        skudd.x = tank.x + 10;
        skudd.y = tank.y + 10;
        skudd.alive = true;
        skudd.div.classList.remove("hidden");
    }

    function styrSpillet() {
        if (keys[39] === 1) {
            tank.roter(3);
        }
        if (keys[37] === 1) {
            tank.roter(-3);
        }
        if (keys[32] === 1) {
            skyt();
        }
    }

}
//*/