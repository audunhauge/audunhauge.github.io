// @ts-check

class Brikke {
    constructor(klasse, x, y) {
        this.klasse = klasse;
        this.x = x;
        this.y = y;
        this.grid = [0, 1, 0,1, 1, 1,0, 0, 0];
    }

    render() {
        let idx = 0;
        for (let i=0; i < 9; i++) {
            let v = this.grid[i];
            if (v !== 0) {
                const b = brikkene[idx];
                idx++;
                const dx = i % 3;
                const dy = Math.trunc(i / 3);
                const px = (this.x + dx) * 20;
                const py = (this.y + dy) * 20;
                b.style.transform = `translate(${px}px,${py}px)`;
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

const $ = (id) => document.getElementById(id);

function setup() {
    const divBrett = $("brett");
    brikkene = document.querySelectorAll(".brikke");
    const klasser = "szjltoi".split("");


    const index = Math.trunc(Math.random() * klasser.length);
    const klasse = klasser[index];
    const brikke = new Brikke(klasse,0,0);
    brikke.render();

    setInterval(fallNedover, 1000);
    setInterval(styrBrikken, 20);

    function fallNedover() {

    }

    function styrBrikken() {

    }


}