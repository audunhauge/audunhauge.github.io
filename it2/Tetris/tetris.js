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
let speed = 600;
let timer;
let xp,yp,t;



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


    timer = setInterval(gameLoop, speed);

    t = new Tetramino("I");
    xp = 4;
    yp = -3;

    function gameLoop() {
        clearBoard();
        t.render(xp,yp,minos);
        yp++;
    }

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
    test.rot(5);
    expect(test.rotation,"test.rot(5)").to.eq(2);
    
    // roterer 3 ganger (til høyre)
    test.rot(-3);
    expect(test.rotation,"test.rot(-3)").to.eq(3);
    
    Test.summary("#tester");
   

}

