// @ts-check

// lager et brett 
// koden under lager samme array - den jeg bruker er kortere, men
// kanskje litt vanskelig å forstå

const brett = [
    "V          V".split(""),
    "V          V".split(""),
    "V          V".split(""),
    "V          V".split(""),
    "V          V".split(""),
    "V          V".split(""),
    "V          V".split(""),
    "V          V".split(""),
    "V          V".split(""),
    "V          V".split(""),
    "V          V".split(""),
    "V          V".split(""),
    "V          V".split(""),
    "V          V".split(""),
    "V          V".split(""),
    "V          V".split(""),
    "V          V".split(""),
    "V          V".split(""),
    "V          V".split(""),
    "VVVVVVVVVVVV".split("")
]


const minos = [];
let speed = 1000;
let timer;
let xp, yp, t;



function setup() {
    let divBoard = document.getElementById("board");
    let homebar = document.querySelector("home-bar");
    if (homebar) {
        homebar.setAttribute("menu", `<i class="material-icons">settings</i>`);
    }



    // lager en div for hver mulige posisjon for en brikke (20*10) + kanter
    for (let i = 0; i < 20 * 12; i++) {
        let div = document.createElement("div");
        div.className = "tetro";
        divBoard.appendChild(div);
        minos.push(div);
    }


    clearBoard();

    function clearBoard() {
        for (let i = 0; i < minos.length; i++) {
            let e = minos[i];
            let x = i % 12;
            let y = Math.floor(i / 12);
            e.className = "tetro " + brett[y][x];
        }
    }

    addEventListener("keydown", styrSpillet);

    function styrSpillet(e) {
        clearBoard();
        switch (e.key) {
            case "ArrowLeft":
                if (!t.kollisjon(xp - 1, yp, brett)) {
                    xp--;
                }
                break;
            case "ArrowRight":
                if (!t.kollisjon(xp + 1, yp, brett)) {
                    xp++;
                }
                break;
            case "ArrowUp":
                if (!t.kollisjon(xp, yp, brett, 1)) {
                    t.rot(1);
                }
                break;
            case "ArrowDown":
                if (!t.kollisjon(xp, yp, brett, -1)) {
                    t.rot(-1);
                }
                break;
            case " ":
                clearInterval(timer);
                timer = setInterval(gameLoop, 20);
        }
        t.render(xp, yp, minos);
    }


    let type = "I";
    timer = setInterval(gameLoop, speed);
    makeNewTetrino(type);
    gameLoop();

    function makeNewTetrino(type) {
        let possible = "OISZJLT".replace(type, "");
        type = possible.charAt(Math.random() * 7);
        t = new Tetramino(type);
        xp = 4;
        yp = -3;
        clearInterval(timer);
        timer = setInterval(gameLoop, speed);
        gameLoop();
    }

    function dropAbove(brett, idx) {
        for (let i = idx; i > 0; i--) {
            let s = brett[i-1].join("");
            brett[i] = s.split("");
        }
    }

    function sjekkForLinjer(brett) {
        // Ny løkke
        // while løkka har den fordelen at du selv
        // bestemmer hvordan indeksen (i) skal endres
        // i en for løkke endres indeks etter en fast regel
        // i en while kan du bestemme med en if ()
        let i = brett.length - 2;
        while (i > 0) {
            let linje = brett[i].join("");
            if (!linje.includes(" ")) {
                dropAbove(brett, i);
            } else {
                i--;
            }
        }
        /*
        for (let i= brett.length-2; i > 0; i--) {
            let linje = brett[i].join("");
            if (! linje.includes(" ")) {
                dropAbove(brett, i);
            }
        }
        */
    }

    function gameLoop() {
        clearBoard();
        if (t.kollisjon(xp, yp, brett)) {
            t.transfer(xp, yp - 1, brett);
            sjekkForLinjer(brett);
            if (yp < 0) {
                alert("game over");
                clearInterval(timer);
                return;
            }
            makeNewTetrino();
        } else {
            t.render(xp, yp, minos);
            yp++;
        }
    }
    /*
    // tester at brettet er i orden
    expect(brett,"brett").it.is.a("Array");
    expect(brett,"brett").to.have("length").eq(20);
    expect(brett,"brett").to.have(0).to.have(0).eq('V');
    expect(brett,"brett").to.have(19).to.have(8).eq('V');
    expect(brett[0].join(""),"først linje i brett").to.eq("V          V");
    expect(brett[19].join(""),"siste linje i brett").to.eq("VVVVVVVVVVVV");

    let test = new Tetramino("I");
    expect(test,"test").it.is.a("Tetramino");
    expect(test.rotation,"test.rotation").to.eq(0); 

    // roterer en gang (til venstre)
    test.rot(1);
    expect(test.rotation,"test.rot(1)").to.eq(1);
    
    // roterer 5 ganger (til venstre)
    test.rot(2);
    expect(test.rotation,"test.rot(5)").to.eq(3);
    
    // roterer 3 ganger (til høyre)
    test.rot(-1);
    expect(test.rotation,"test.rot(-3)").to.eq(2);

    // roterer 5 venstre
    test = new Tetramino("I");
    test.rot(5);
    expect(test.rotation,"test.rot(5)").to.eq(1);

    test.rot(-4);
    expect(test.rotation,"test.rot(5)").to.eq(1);
    
    Test.summary("#tester");
   */

}

