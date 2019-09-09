// @ts-check

function $(element) {
    return document.getElementById(element);
}

function setup() {
    let divBrett = $("brett");
    let divInfo = $("info");
    let divScore = $("score");

    lagBrikker();
    lagPlate();
    lagBall();
    startSpill();

    function lagPlate() {
        let div = document.createElement("div");
        div.className = "plate";
        divBrett.appendChild(div);
    }

    function lagBall() {
        let div = document.createElement("div");
        div.className = "ball";
        divBrett.appendChild(div);
    }

    function lagBrikker() {
        for (let j = 0; j < 12; j += 1) {
            for (let i = 0; i < 30; i += 1) {
                let div = document.createElement("div");
                div.className = "brikke";
                div.style.left = (i * 30) + "px";
                div.style.top = (j * 16) + "px";
                divBrett.appendChild(div);
            }
        }
    }

    function startSpill() {
    }
}