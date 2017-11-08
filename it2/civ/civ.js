// flow

function civ() {
    let divMain = document.getElementById("main");
    let divBoard = document.getElementById("board");
    let ctx = document.getElementById("minimap").getContext("2d");
    let terrain = "sea,grass,plain,swamp,forest,hill,mountain,desert".split(",");
    let colors = "blue,green,yellow,sandybrown,teal,olive,darkgray,orange".split(",");



    const W = 150;   // antall brikker i bredden
    const H = 90;    // antall brikker i høyden
    const HexH = 115;  // høde bredde på hex-tile
    const hexW = 100;
    const hexD = 115 * 17 / 23;  // forskyvning i høyde mellom rader

    let brett;
    let board = [];
    let islands;


    [brett, islands] = build(W, H);

    myland = islands[0];
    let t;
    let px = myland.x;
    let py = myland.y;
    do {
        px++;
        t = brett[px][py]
    } while (t === MOUNTAIN || t === SEA);
    px = (px + W - 8) % W;
    py = (py + H - 4) % H;

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
        minimap();
        ctx.strokeStyle = "white";
        ctx.strokeRect((px + 6) * 4 + 4 * (py / 2), (py + 1) * 4, 28, 28);
    }

    function minimap() {
        brett.forEach((e, x) => e.forEach((e, y) => {
            let px = (x + Math.floor(y / 2)) % W;
            let py = y;
            let color = colors[brett[x][y]];
            ctx.fillStyle = color;
            ctx.fillRect(px * 4, py * 4, 4, 4);
        }));
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