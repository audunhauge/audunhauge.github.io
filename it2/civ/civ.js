// flow

function civ() {
    let divMain = document.getElementById("main");
    let divBoard = document.getElementById("board");
    let terrain = "grass,hill,swamp,forest,mountain,desert,sea,snow".split(",");



    const W = 150;
    const H = 90;
    const HexH = 115;
    const hexW = 100;

    let brett = [];
    let board = [];
    let px = 30;
    let py = 30;

    for (let i = 0; i < W; i++) {
        brett[i] = [];
        for (let j = 0; j < H; j++) {
            let type;
            if (i === 0 || i + 1 === W || j === 0 || j + 1 === W) {
                type = terrain.length -1;
            } else {
                type = Math.floor(Math.random() * (terrain.length - 1));
            }
            brett[i][j] = type;
        }
    }

    for (let i = 0; i < 17; i++) {
        board[i] = [];
        for (let j = 0; j < 9; j++) {
            let t = document.createElement('div');
            t.className = "hex";
            t.style.top = (-85 + j * 85) + "px";
            t.style.left = (-hexW * 7 + i * hexW + hexW * j/2) + "px";
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

    function move(e) {
        if (wait) return;
        let dx = 0, dy = 0;
        wait = true;
        switch (e.keyCode) {
            case 38:
                py = (py + H - 1) % H;
                dx = 50; dy = 85;
                break;
            case 40:
                py = (py + 1) % H;
                dx = -50; dy = -85;
                break;
            case 37:
                px = (px + W - 1) % W;
                dx = 100; dy = 0;
                break;

            case 39:
                px = (px + 1) % W;
                dx = -100; dy = 0;
                break;
            default:
                return;
        }
        event.preventDefault();

        let smooth = divBoard.animate(
            [
                { left: "0px", top: "0px" },
                { left: dx + "px", top: dy + "px" }
            ], {
                duration: 500,
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