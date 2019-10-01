// @ts-check

function start() {
  let bod = document.querySelector("body");
  let svg = document.querySelector("#svg svg");
  let aktivt = document.querySelector("#skisse div");
  let targets = Array.from(document.querySelectorAll(".firkant"));
  let lines = svg.querySelectorAll("g");
  let panel = document.createElement("div");
  panel.id = "panel";
  bod.appendChild(panel);
  panel.innerHTML = `<span>New</span><i>Lag ny pil</i> <span>Clear</span><i>Slett piler</i>
             <span>Flytt boxer</span><i>Du kan flytte boxer</i>`;
  let nu = panel.querySelector("span:nth-of-type(1)");
  let info = panel.querySelector("i:nth-of-type(1)");
  let clear = panel.querySelector("span:nth-of-type(2)");
  let move = panel.querySelector("span:nth-of-type(3)");
  let flytt = panel.querySelector("i:nth-of-type(3)");

  let state = "off";

  let liste;

  let movingDiv = null;

  clear.addEventListener("click", cleansvg);
  nu.addEventListener("click", startLine);
  move.addEventListener("click", moveBoxes);

  function moveBoxes() {
    if (state !== "move") {
      state = "move";
      flytt.innerHTML = "klikk for å slippe";
    } else  {
      state = "off";
      movingDiv = null;
      flytt.innerHTML = "Du kan flytte";
    }
  }

  function cleansvg() {
    let gs = svg.querySelectorAll("g");
    gs.forEach(e => svg.removeChild(e));
  }

  function follow(e) {
    let x = e.clientX;
    let y = e.clientY;
    if (movingDiv) {
      movingDiv.style.top = y - 50 + "px";
      movingDiv.style.left = x - 50 + "px";
    }
  }

  aktivt.addEventListener("click", selectedDiv);

  function startLine(e) {
    info.innerHTML = "Velg startpunkt";
    targets.forEach(e => e.classList.remove("selected"));
    state = "start";
    liste = [];
  }

  function selectedDiv(e) {
    let div = e.target;
    if (!div.classList.contains("firkant")) return;
    switch (state) {
      case "off":
        return;
      case "start":
        div.classList.add("selected");
        info.innerHTML = "Velg Endepunkt";
        state = "next";
        liste.push(div);
        break;
      case "next":
        if (!div.classList.contains("selected")) {
          div.classList.add("selected");
          state = "end";
          liste.push(div);
          info.innerHTML = " En gang til for å bekrefte ";
        }
        break;
      case "end":
        if (div.classList.contains("selected")) {
          state = "off";
          info.innerHTML = " Lag enda en ny pil ";
          targets.forEach(e => e.classList.remove("selected"));
          makeArrow(liste);
        }
        break;
      case "move":
        try {
          movingDiv.removeEventListener("mousemove", follow);
        } catch (e) {}
        div.addEventListener("mousemove", follow);
        movingDiv = div;
        state = "moving";
        break;
      case "moving":
        try {
          movingDiv.removeEventListener("mousemove", follow);
        } catch (e) {}
        state = "move";
        movingDiv = null;
        break;
    }
  }

  function makeArrow([d1, d2]) {
    let nuline = (x1, y1, x2, y2, mark = "") =>
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#f00" stroke-width="2" ${mark}/>`;
    let nug = () => document.createElementNS("http://www.w3.org/2000/svg", "g");
    let p1 = {
      x: +d1.offsetLeft,
      y: +d1.offsetTop,
      w: +d1.clientWidth,
      h: +d1.clientHeight
    };
    let p2 = {
      x: +d2.offsetLeft,
      y: +d2.offsetTop,
      w: +d2.clientWidth,
      h: +d2.clientHeight
    };
    console.log(p1, p2);
    let l1;
    if (p1.y < p2.y && p1.x < p2.x) {
      let x1 = Math.trunc(p1.x + p1.w / 2);
      let y1 = p1.y + p1.h + 2;
      let x2 = x1;
      let y2 = Math.trunc(p2.y + p2.h / 2 - 2);
      l1 = nuline(x1, y1, x2, y2);
      x1 = p2.x - 20;
      y1 = y2;
      l1 += nuline(x2, y2, x1, y1,'marker-end="url(#arrowhead)"');
    }
    if (l1) {
      let g = nug();
      g.innerHTML = l1;
      svg.appendChild(g);
    }
  }
}
