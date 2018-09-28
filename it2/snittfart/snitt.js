// @flow

const AVGVELOCITY = 2.5 * Math.sqrt(2 / Math.PI);

class Shape {
    constructor(x, y, w, h) {
        this.x = x
        this.y = y
        this.w = w;
        this.h = h;
    }
    static overlap(a, b) {
        return (
            a.x > b.x - a.w &&
            a.x < b.x + b.w &&
            a.y > b.y - a.h &&
            a.y < b.y + b.h
        )
    }
}

class Ball extends Shape {
    constructor() {
        let x = Math.floor(Math.random() * 600);
        let y = Math.floor(Math.random() * 600);
        super(x, y, 20, 20);
        this.vx = Math.random() * 5 - 2.5;
        this.vy = Math.random() * 5 - 2.5;
        let div = document.createElement("div");
        div.className = "ball";
        this.div = div;
    }

    render() {
        this.div.style.top = this.y + "px";
        this.div.style.left = this.x + "px";
        let vx = this.vx; let vy = this.vy;
        let color = Math.sqrt(vx * vx + vy * vy) > AVGVELOCITY ? "red" : "blue";
        this.div.style.backgroundColor = color;
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;
    }

    gravity() {
        this.vy += 0.1;
    }

    constrain() {
        if (this.x > 600) this.vx = - Math.abs(this.vx) * 0.9;
        if (this.x < 0) this.vx = Math.abs(this.vx);
        if (this.y > 600) this.vy = - Math.abs(this.vy) * 0.9;
        if (this.y < 0) this.vy = Math.abs(this.vy);
    }


    static animate(list) {
        list.forEach(b => {
            b.move();
            b.gravity();
            b.constrain();
            b.render();
        });

        list.forEach((a, i) => {
            for (let j = i + 1; j < list.length; j++) {
                let b = list[j];
                if (Shape.overlap(a, b)) {
                    [a.vx, b.vx] = [b.vx, a.vx];
                }
            }
        })

    }


}


function setup() {
    let divMain = document.getElementById("main");
    let baller = Array(100).fill(1).map(e => new Ball());
    /*
    let soyler = [];
    baller.forEach(e => {
        let v = Math.sqrt(e.vx * e.vx + e.vy * e.vy);
        let k = Math.floor(v*100);
        if (!soyler[k]) soyler[k] = 0;
        soyler[k]++;
    });
    soyler.forEach( e => {
        let div = document.createElement("div");
        div.className = "soyle";
        div.style.width = (e /10|| 0) + "px";
        divMain.appendChild(div);
    })
    */
    baller.forEach(e => { divMain.appendChild(e.div); e.render(); });
    setInterval(() => { Ball.animate(baller) }, 10);
    let red = baller.filter(e => e.div.style.backgroundColor === "red");
    document.getElementById("ballcount").innerHTML = String(red.length);

}


