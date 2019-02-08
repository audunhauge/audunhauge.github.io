// @ts-check

// lager et brett 
// koden under lager samme array - den jeg bruker er kortere, men
// kanskje litt vanskelig å forstå
/*
const brett = [
    [1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1],
    // .... 20 linjer ...
    [1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1],
]
*/
const line = new Array(12).fill(0);
line[0] = line[11] = 1;  // marker sidekanter
const brett = (new Array(21).fill(1)).map(e => line.slice());
brett[20].fill(1);  // siste rad

const minos = [];



function setup() {
    let divBoard = document.getElementById("board");
    let homebar = document.querySelector("home-bar");
    if (homebar) {
        homebar.setAttribute("menu", `<i class="material-icons">settings</i>`);
    }

    let tetroDivs = [];   // all divs

    // lag alle tetraminoene
    // types er definert i Tetramino.js
    for (let typ of types) {
        let t = new Tetramino(typ);
        minos.push(t);
    }
    // lager en div for hver mulige posisjon for en brikke (20*10) + kanter
    for (let i=0; i < 20*12; i++) {
       let div = document.createElement("div");
       div.className = "tetro";
       divBoard.appendChild(div);
       tetroDivs.push(div);
    }

    minos[2].render(0,-3,tetroDivs);

}