// @ts-check


function $(element) {
  return document.getElementById(element);
}

function setup() {
  let divBrett = $("brett");
  let divInfo = $("info");
  let divScore = $("score");
  let ball, plate;


  function lagBall() {
    let div = document.createElement("div");
    div.className = "ball";
    divBrett.appendChild(div);
  }

  function lagPlate() {
    let div = document.createElement("div");
    div.className = "plate";
    divBrett.appendChild(div);
  }

  function lagBrikker() {
    for (let j = 0; j < 26; j += 1) {
      for (let i = 0; i < 30; i += 1) {
        let div = document.createElement("div");
        div.className = "brikke";
        let x = i * 30;
        let y = j * 16;
        div.style.left = x + "px";
        div.style.top = y + "px";
        divBrett.appendChild(div);
      }
    }
  }

  lagBrikker();
  lagPlate();
  lagBall();
  startSpill();

  function startSpill() {
  }
}
