export function sum(a, b) { return a + b; }
export function mult(a, b) { return a * b; }
export const π = Math.PI
export class Point {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    add(p) {
        this.x += p.x;
        this.y += p.y;
    }

    toString() {
        return `(${this.x},${this.y})`;
    }
}