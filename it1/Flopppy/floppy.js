// @ts-check

let fuggel = { x: 180, y: 180, v: 0 };

function setup() {
    let divFuggel = document.getElementById("fuggel");

    setTimeout(start, 3000);
    function start() {
        setInterval(flyttFuggel, 50);
    }
    
    addEventListener("keypress", fly);

    function fly() {
        fuggel.v -= 6;
    }

    function flyttFuggel() {
        fuggel.v += 0.5;
        fuggel.y += fuggel.v;
        divFuggel.style.top = fuggel.y + "px";

    }
}