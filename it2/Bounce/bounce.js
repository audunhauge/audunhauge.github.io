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

function setup() {
    let poeng = 0;
    let divPoeng = document.getElementById("poeng");
    let divBox = document.getElementById("box");
    let divBounce = document.createElement("div");
    divBounce.id = "bounce";
    divBox.appendChild(divBounce);

    let bounce = { x: 100, y: 100, w: 20, h: 20 };

    let targets = [];

    function place(div, posisjon) {
        div.style.top = posisjon.y + "px";
        div.style.left = posisjon.x + "px";
    }

    function makeTarget() {
        // first drop dead targets
        targets = targets.filter(e => e.alive);
        // add a new target
        let target = document.createElement("div");
        target.className = "target";
        divBox.appendChild(target);
        let x = Math.random() * 500 + 200;
        let y = Math.random() * 300 + 100;
        target.style.top = y + "px";
        target.style.left = x + "px";
        targets.push({ alive: true, points: 1, x, y, w: 50, h: 50, target });
    }

    function kollisjon(a, b) {
        return a.x > b.x - a.w &&
            a.x < b.x + b.w &&
            a.y > b.y - a.h &&
            a.y < b.y + b.h;
    }

    setInterval(makeTarget, 500);

    function animation() {
        if (Keys.has("ArrowLeft")) {
            bounce.x -= 10;
            place(divBounce, bounce);
        }
        if (Keys.has("ArrowRight")) {
            bounce.x += 10;
            place(divBounce, bounce);
        }
        if (Keys.has("ArrowUp")) {
            bounce.y -= 10;
            place(divBounce, bounce);
        }
        if (Keys.has("ArrowDown")) {
            bounce.y += 10;
            place(divBounce, bounce);
        }
        targets.forEach(e => {
            e.points++;
            if (e.points > 100) {
                e.alive = false;
                e.target.classList.add("hidden");
            }
            if (e.alive) {
                if (kollisjon(bounce, e)) {
                    e.target.classList.add("hidden");
                    poeng += e.points;
                    divPoeng.innerHTML = String(poeng);
                    e.alive = false;
                }
            }
        })
    }

    setInterval(animation, 50);

}