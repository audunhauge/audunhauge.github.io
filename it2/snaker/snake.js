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

class Ting {
    constructor(div, x, y) {
        this.x = x;
        this.y = y;
        this.div = div;
    }
    render() {
        this.div.style.transform = `translate( ${this.x * 10}px, ${this.y * 10}px)`;
    }
}
const ruter = [];

const mat = [];


function setup() {
    let divBrett = document.getElementById("brett");
    for (let i = 0; i < 60; i++) {
        const indre = [];
        for (let j = 0; j < 60; j++) {
            indre.push(0);
        }
        ruter.push(indre);
    }

    /**
     * Legge inn tall i ruter som symboliserer mat
     * 1 = banan
     */
    function plasserUtMat() {
        for (let i = 0; i < 5; i++) {
            const x = Math.trunc(Math.random() * 60);
            const y = Math.trunc(Math.random() * 60);
            ruter[x][y] = 1;
            const div = document.createElement("div");
            div.className = "gul ting";
            divBrett.append(div);
            const banan = new Ting(div, x, y);
            banan.render();
            mat.push(banan);
        }
        for (let i = 0; i < 5; i++) {
            let ledig = false;
            let x; let y;
            while (!ledig) {
                x = Math.trunc(Math.random() * 60);
                y = Math.trunc(Math.random() * 60);
                ledig = ruter[x][y] === 0;
            }
            ruter[x][y] = 1;
            const div = document.createElement("div");
            div.className = "roed ting";
            divBrett.append(div);
            const banan = new Ting(div, x, y);
            banan.render();
            mat.push(banan);
        }
    }

    /**
     * Finne banan med gitt (x,y)
     * @param {Number} x 
     * @param {Number} y 
     */
    function finnBanan(x, y) {
        for (let i = 0; i < mat.length; i++) {
            const banan = mat[i];
            if (banan.x === x && banan.y === y) {
                banan.div.classList.add("hidden");
            }
        }

    }

    /**
     * Sjekk om Snake står oppå en matbit, spis den dersom true
     */
    function spisMaten() {
        const x = snake.x;
        const y = snake.y;
        if (ruter[x][y] === 1) {
            finnBanan(x, y);
        }

    }

    plasserUtMat();

    let div = document.getElementById("ball");
    let snake = new Ting(div, 30, 40);
    snake.render();


    setInterval(animate, 60);

    function animate() {
        spisMaten();
        if (Keys.has("ArrowRight")) {
            if (snake.x < 59) {
                snake.x += 1;
            }
        }
        if (Keys.has("ArrowLeft")) {
            if (snake.x > 0) {
                snake.x -= 1;
            }
        }
        if (Keys.has("ArrowDown")) {
            if (snake.y < 59) {
                snake.y += 1;
            }
        }
        if (Keys.has("ArrowUp")) {
            if (snake.y > 0) {
                snake.y -= 1;
            }
        }
        if (Keys.any()) snake.render();

        //requestAnimationFrame(animate);
    }

    //animate();



}