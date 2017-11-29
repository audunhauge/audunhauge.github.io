// main func called civ so we can reuse scaffolding of game
// login.js to make a map editor


var rr = Math.random;   // original random generator

Math.seedrandom(rr());



function civ() {

    document.getElementById("rnd").addEventListener("click", nuRand);
    document.getElementById("params").addEventListener("input", make);
    document.getElementById("start").removeEventListener("click", civ);
    document.getElementById("start").addEventListener("click", make);
    let divStatus = document.getElementById("status");
    let divMain = document.getElementById("main");
    let divBoard = document.getElementById("board");
    divMain.classList.add("hidden");
    divBoard.classList.add("hidden");
    divStatus.classList.remove("hidden");

    function nuRand() {
        let seed = rr();
        document.getElementById("seed").value = seed;
        make();
    }


}

function make() {

  
    let cvsMiniMap = document.getElementById("minimap");
    let ctx = cvsMiniMap.getContext("2d");
    let terrain = "sea,grass,plain,swamp,forest,hill,mountain,desert".split(",");
    let colors = "blue,green,yellow,sandybrown,teal,olive,darkgray,orange".split(",");

    let wi = +document.getElementById("width").value;
    let hi = +document.getElementById("height").value;
    let land = +document.getElementById("land").value;
    let size = +document.getElementById("size").value;
    let radius = +document.getElementById("radius").value;
    let seed = document.getElementById("seed").value;

    if (seed === "") {
        let seed = rr();
        Math.seedrandom(seed);
        document.getElementById("seed").value = seed;
    } else {
        Math.seedrandom(seed);
    }



    const W = wi;   // antall brikker i bredden
    const H = hi;    // antall brikker i høyden
    const HexH = 115;  // høde bredde på hex-tile
    const hexW = 100;
    const hexD = 115 * 17 / 23;  // forskyvning i høyde mellom rader

    let brett;
    let board = [];
    let islands;
    let units = [];
    // fetch uits from firebase

    

    cvsMiniMap.width = W * 4;
    cvsMiniMap.height = H * 4;



    [brett, islands] = build(W, H, land, size, radius);

    function minimap() {
        brett.forEach((e, x) => e.forEach((e, y) => {
            let px = (x + Math.floor(y / 2)) % W;
            let py = y;
            let color = colors[brett[x][y]];
            ctx.fillStyle = color;
            ctx.fillRect(px * 4, py * 4, 4, 4);
        }));
    }

    minimap();

}