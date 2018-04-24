// @ts-check
function setup() {

    const MAXFART = 12;

    let bird = document.getElementById("bird");

    let above = document.getElementById("above");
    let below = document.getElementById("below");

    document.addEventListener("keydown", girFartTilFuggel);

    let ypos = 150;
    let xpos = window.innerWidth / 2 - 50;
    let fart = 0;

    let posA = window.innerWidth;
    let posB = window.innerWidth;

    let topA = 0;
    let heightA = 150;



    function girFartTilFuggel(event) {
        fart = fart + 10;
    }

    setInterval(flyttPaaTing, 40);

    function flyttPaaTing() {
        ypos = ypos - fart;
        fart = fart - 1;
        if (fart > MAXFART) { fart = MAXFART; }
        if (fart < -MAXFART) { fart = -MAXFART; }
        if (ypos < 0) {
            ypos = 0;
            fart = 0;
        }
        if (ypos > window.innerHeight - 200) {
            ypos = window.innerHeight - 200;
            fart = 0;
        }
        bird.style.top = ypos + "px";

        posA = posA - 5;
        if (posA < 0) {
            posA = window.innerWidth;
        }
        above.style.left = posA + "px";

        posB = posB - 5;
        if (posB < 0) {
            posB = window.innerWidth;
        }
        below.style.left = posB + "px";

        if (xpos > posA - 100 &&
            xpos < posA + 30 &&
            ypos < 150
        ) {
            document.querySelector("body").innerHTML = "game over";
        }
    }




}