function setup() {
    const FART = 4;
    let divBrett = document.getElementById("brett");
    let divPoeng = document.getElementById("poeng");
    let playerDiv = document.createElement("div");
    playerDiv.className = "player";
    divBrett.appendChild(playerDiv);
    let player = {
        x: 250,
        y: 250,
        vx: FART,
        vy: FART,
        div: playerDiv
    }

    document.addEventListener("keydown", styrSpillet);

    function styrSpillet(event) {
        let k = event.keyCode;
        if (k === 38) {
            player.vy = -FART;
            player.vx = 0;
        }
        if (k === 40) {
            player.vy = FART;
            player.vx = 0;
        }
        if (k === 37) {
            player.vx = -FART;
            player.vy = 0;
        }
        if (k === 39) {
            player.vx = FART;
            player.vy = 0;
        }
     }

    setInterval(animate, 50);

    function animate() {
        player.x += player.vx;
        player.y += player.vy;
        player.div.style.left = player.x + "px";
        player.div.style.top = player.y + "px";
        if (player.x > 500) {
            player.vx = -FART;
        }
        if (player.y > 500) {
            player.vy = -FART;
        }
        if (player.x < 0) {
            player.vx = FART;
        }
        if (player.y < 0) {
            player.vy = FART;
        }
    }

   
}