// @ts-check

function setup() {
    let ball =document.getElementById("ball");
    let x = 0;
    let y = 0;
    let vx = 10;
    let vy = 10;

    setInterval(flytt, 10);

    function flytt() {
        ball.style.left = x + "px";
        ball.style.top = y + "px";
        x = x + vx;
        y = y + vy;
        if (x > 800) {
            vx = -10;
        }
        if (y > 600) {
            vy = -10;
        }
        if (y < 0) {
            vy = 10;
        }
        if (x < 0) {
            vx = 10;
        }
    }
}