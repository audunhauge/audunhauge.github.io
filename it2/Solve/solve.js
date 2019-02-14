// @ts-check

function setup() {
    let points = [];
    let inpEq = document.getElementById("eq");
    let btnStart = document.getElementById("start");
    let inpLo = document.getElementById("lo");
    let inpHi = document.getElementById("hi");
    btnStart.addEventListener("click", plotSolve);

    function plotSolve() {
        let eqn = inpEq.value;
        let lo = inpLo.valueAsNumber || -100;
        let hi = inpHi.valueAsNumber || 100;
        plot(eqn, lo, hi);
        solve(eqn, lo, hi);
    }

    function solve(f, a, b) {
        const eps = Number.EPSILON;
        // first check if we seem to have a zero crossing
        let xy = points.map((p,i)=> [p,i]);
        let neg = xy.filter(e => e[0] < 0);
        let pos = xy.filter(e => e[0] > 0);
        let tiny = xy.filter(e => Math.abs(e[0]) < 0.1 )
        if ((neg.length === 0 || pos.length === 0) &&  tiny.length === 0) {
            alert("No solve");
            return;
        }
        if (tiny.length) {
            console.log(tiny);
        }
        let fa = fun(f, a);
        let fb = fun(f, b);
        let iter = 0;
        while (iter < 100 && Math.abs(a-b) > eps) {
            let m = (a+b)/2;
            let fm = fun(f,m);
            if (fa*fm < 0) {
                b = m;
                fb = fm;
            } else if (fb*fm < 0) {
                a = m;
                fa = fm;
            }
            iter++;
        }
        console.log(a,b,fa,iter);
        return a;
    }

    function plot(f, start, stop) {
        let x = start;
        let dx = (stop - start) / 500;
        let ctx = document.getElementById("plot").getContext('2d');
        ctx.clearRect(0, 0, 500, 500);
        ctx.beginPath();
        points = [];
        for (let i = 0; i < 500; i++) {
            let p = fun(f, x);
            points.push(fun(f, x));
            x += dx;
        }
        let fine = points.filter(p => Number.isFinite(p));
        let y = fine[0];
        let max = fine.reduce((m, v) => Math.max(m, v), y);
        let min = fine.reduce((m, v) => Math.min(m, v), y);
        let scale = 500 / (max - min);
        y = scale * (y - min);
        ctx.moveTo(0, 500 - y)
        points.forEach((p, i) => {
            if (Number.isFinite(p)) {
                y = scale * (p - min);
                ctx.lineTo(i, 500 - y);
            }
        })

        ctx.stroke();

        ctx.moveTo(0, 500 + scale * min);
        ctx.lineTo(499, 500 + scale * min);
        ctx.stroke();

        if (start * stop < 0) {
            // y axis in focus
            let i = -start / dx;
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 500);
            ctx.stroke();
        }
    }
    function fun(f, x) {
        try {
            return eval(f);
        } catch (e) {
            console.log(e.message);
            return null;
        }
    }

}