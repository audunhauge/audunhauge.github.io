// @ts-check

const brikkeListe = {
    "s": [0, 1, 1, 1, 1, 0, 0, 0, 0],
    "z": [1, 1, 0, 0, 1, 1, 0, 0, 0],
    "l": [0, 1, 0, 0, 1, 0, 0, 1, 1],
    "j": [0, 1, 0, 0, 1, 0, 1, 1, 0],
    "t": [0, 1, 0, 1, 1, 1, 0, 0, 0],
    "o": [0, 1, 1, 0, 1, 1, 0, 0, 0],
    "i": [1, 0, 1, 0, 0, 0, 1, 0, 1],
}
const klasser = "szjltoi".split("");

class Brikke {
    klasse; x; y;
    constructor(klasse, x, y) {
        this.x = x;
        this.y = y;
        this.type(klasse);
    }

    type(klass = null) {
        if (klass === null) {
            const index = Math.trunc(Math.random() * klasser.length);
            klass = klasser[index];
        }
        this.klasse = klass;
        this.grid = brikkeListe[this.klasse].slice();
    }

    render() {
        let idx = 0;
        for (let i = 0; i < 9; i++) {
            let v = this.grid[i];
            if (v !== 0) {
                const b = brikkene[idx];
                idx++;
                const dx = i % 3;
                const dy = Math.trunc(i / 3);
                const px = (this.x + dx) * 20;
                const py = (this.y + dy) * 20;
                b.style.transform = `translate(${px}px,${py}px)`;
                b.className = "brikke " + this.klasse;
            }
        }

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

let brikkene;

const brett = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const $ = (id) => document.getElementById(id);

function setup() {
    let fart = 500;
    const divBrett = $("brett");
    brikkene = document.querySelectorAll(".brikke");


    const brikke = new Brikke("l", 0, 0);
    brikke.render();

    let nedover = setInterval(fallNedover, fart);
    setInterval(styrBrikken, 50);

    function sjekkLedig() {
        let y = brikke.y + 3;
        let sjekk;
        const x = brikke.x;
        const mitterst = brikke.grid.slice(3,6);
        sjekk = brikke.grid.slice(6,9);
        // den raden vi må sjekke er den første ikke tomme
        // raden sett nedenfra
        if (! sjekk.some(e => e === 1)) {
            y--;
            sjekk = mitterst;
        }
        if (brett[y]) {
            const nesteRad = brett[y].slice(x, x+3);
            return nesteRad.every((e,i) => e === 0 || sjekk[i] === 0);
        }
        return false;
    }

    function fallNedover() {
        if (sjekkLedig()) {
            brikke.y++;
            brikke.render();
        } else {
            for (let i = 0; i < 4; i++) {
                const d = document.createElement("div");
                d.className = "brikke " + brikke.klasse;
                d.style.transform = brikkene[i].style.transform;
                divBrett.append(d);
            }
            for (let i = 0; i < 9; i++) {
                if (brikke.grid[i] === 1) {
                    const dx = i % 3;
                    const dy = Math.trunc(i / 3);
                    brett[brikke.y + dy][brikke.x + dx] = 1;
                }

            }
            brikke.type();
            brikke.y = 0;
            brikke.x = Math.trunc(Math.random()*8);
            brikke.render;
            clearInterval(nedover);
            nedover = setInterval(fallNedover, fart);
        }
    }

    function styrBrikken() {
        if (Keys.has("d") && brikke.x < 9) {
            brikke.x++;
            brikke.render();
        }
        if (Keys.has("a") && brikke.x > 0) {
            brikke.x--;
            brikke.render();
        }
        if (Keys.has(" ") && nedover) {
            clearInterval(nedover);
            nedover = setInterval(fallNedover, 20);
        }
    }


}