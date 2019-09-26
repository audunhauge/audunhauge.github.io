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

// både a og b må ha egenskaper (x,y,w,h)
// som gir posisjon (x,y) og bredde w og høyde h
function kollisjon(a, b) {
    return a.x > b.x - a.w &&
        a.x < b.x + b.w &&
        a.y > b.y - a.h &&
        a.y < b.y + b.h;
}

// setter opp spillet
function setup() {
   

}