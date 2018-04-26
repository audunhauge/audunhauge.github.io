// @ts-check
function setup() {

    const MAXFART = 12;
    let bird = document.getElementById("bird");
    let above = document.getElementById("above");
    let below = document.getElementById("below");

    document.addEventListener("keydown", girFartTilFuggel);

    bird.ypos = 150;
    bird.xpos = window.innerWidth / 2 - 50;
    bird.fart = 0;

    above.xpos = window.innerWidth;
    below.xpos = window.innerWidth;

    const GAP = 180;
    const SPENN = window.innerHeight - GAP;


    let poeng = 0;
    let divPoeng = document.getElementById("poeng");

    let top;

    function giHoydeTilSoyler() {
        top = Math.floor(Math.random() * SPENN);
        above.style.height = top + "px";
        below.style.height = (window.innerHeight - GAP - top) + "px";
    }

    giHoydeTilSoyler();

    function girFartTilFuggel(event) {
        bird.fart = bird.fart + 10;
    }

    let timer = setInterval(flyttPaaTing, 40);

    function flyttPaaTing() {
        bird.ypos = bird.ypos - bird.fart;
        bird.fart = bird.fart - 1;
        if (bird.fart > MAXFART) { bird.fart = MAXFART; }
        if (bird.fart < -MAXFART) { bird.fart = -MAXFART; }
        if (bird.ypos < 0) {
            bird.ypos = 0;
            bird.fart = 0;
        }
        if (bird.ypos > window.innerHeight - 200) {
            bird.ypos = window.innerHeight - 200;
            bird.fart = 0;
        }
        bird.style.top = bird.ypos + "px";

        above.xpos = above.xpos - 5;
        if (above.xpos < 0) {
            above.xpos = window.innerWidth;
            poeng = poeng + 10;
            visPoeng();
            giHoydeTilSoyler();
        }
        above.style.left = above.xpos + "px";

        below.xpos = below.xpos - 5;
        if (below.xpos < 0) {
            below.xpos = window.innerWidth;
        }
        below.style.left = below.xpos + "px";

        if (bird.xpos > above.xpos - 100 &&
            bird.xpos < above.xpos + 30 &&
            bird.ypos < top
        ) {
            clearInterval(timer);
            poeng = poeng * 0.9;
            visPoeng();
        }

        
        if (bird.xpos > below.xpos - 100 &&
            bird.xpos < below.xpos + 30 &&
            bird.ypos > window.innerHeight - GAP - top
        ) {
            poeng = poeng * 0.9;
            visPoeng();
        }

    }

    function visPoeng() {
        divPoeng.innerHTML = "Poeng:" + poeng.toFixed(2);
    }

}