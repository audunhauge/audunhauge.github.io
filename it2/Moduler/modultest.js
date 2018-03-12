import { sum, π, Point } from './math.js';
console.log(sum(1, 2));

class Vector extends Point {
    constructor(x, y) {
        super(x, y);
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}

function setup() {
    let divMain = document.getElementById("main");
    divMain.innerHTML = `π=${π}`;
    let p = new Point(1, 2);
    let q = new Point(3, 4);
    let v = new Vector(3,4);
    p.add(q);
    divMain.innerHTML += '<p>' + p.toString() + '<p>' + v.length();
}

setup();