// flow

function civ() {
    let divMain = document.getElementById("main");
    let divBoard = document.getElementById("board");
    let terrain = "sea,grass,swamp,forest,hill,mountain,desert".split(",");



    const W = 50;   // antall brikker i bredden
    const H = 30;    // antall brikker i høyden
    const HexH = 115;  // høde bredde på hex-tile
    const hexW = 100;
    const hexD = 115 * 17 / 23;  // forskyvning i høyde mellom rader

    let brett = [];
    let board = [];
    let px = 30;
    let py = 30;
    /*
    for (let i = 0; i < W; i++) {
        brett[i] = [];
        for (let j = 0; j < H; j++) {
            let type;
            if (i === 0 || i + 1 === W || j === 0 || j + 1 === W) {
                type = terrain.length - 1;
            } else {
                type = Math.floor(Math.random() * (terrain.length - 1));
            }
            brett[i][j] = type;
        }
    }
    */

    brett = build(W,H);

    for (let i = 0; i < 17; i++) {
        board[i] = [];
        for (let j = 0; j < 9; j++) {
            let t = document.createElement('div');
            t.className = "hex";
            t.style.top = (-hexD + j * hexD) + "px";
            t.style.left = (-hexW * 7 + i * hexW + hexW * j / 2) + "px";
            divBoard.appendChild(t);
            board[i][j] = t;
        }
    }



    function render(px, py) {
        for (let i = 0; i < 17; i++) {
            for (let j = 0; j < 9; j++) {
                let t = board[i][j];
                let tile = brett[(px + i) % W][(py + j) % H];
                t.className = "hex " + terrain[tile];
            }
        }

    }

    render(px, py);

    document.addEventListener("keyup", move);

    let wait = false;
    let facing = "right"

    function move(e) {
        if (wait) return;
        let dx = 0, dy = 0;
        wait = true;
        switch (e.keyCode) {
            case 38:  // opp
                py = (py + H - 1) % H;
                dx = hexW / 2; dy = hexD;
                break;
            case 40: // ned
                py = (py + 1) % H;
                dx = -hexW / 2; dy = -hexD;
                break;
            case 37:  // venstre
                px = (px + W - 1) % W;
                dx = hexW; dy = 0;
                break;
            case 39:   // høyre
                px = (px + 1) % W;
                dx = -hexW; dy = 0;
                break;
            case 65:  // a - ned til venstre
                px = (px + W - 1) % W;
                py = (py + 1) % H;
                dx = 50; dy = -85;
                break;
            case 83:  // s - opp til høyre
                px = (px + 1) % W;
                py = (py + H - 1) % H;
                dx = -50; dy = 85;
                break;
            default:
                wait = false;
                return;
        }
        event.preventDefault();

        let smooth = divBoard.animate(
            [
                { left: "0px", top: "0px" },
                { left: dx + "px", top: dy + "px" }
            ], {
                duration: 250,
            }
        )

        smooth.onfinish = () => {
            render(px, py);
            wait = false;
        }

    }

}


function rndTerrain(terr) {
    let idx = Math.floor(Math.random() * terr.length);
    return terr[idx];
}