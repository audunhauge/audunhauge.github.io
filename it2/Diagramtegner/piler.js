// @ts-check

function setup() {
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
    } else {
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
    console.log(e.offsetX, e.offsetY);
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

  let getSide = (p,c) => {
    let mx = c.x;
    let my = c.y;
    let sides = [
      [p.x + p.w / 2, p.y],
      [p.x + p.w / 2, p.y + p.h],
      [p.x, p.y + p.h / 2],
      [p.x + p.w, p.y + p.h / 2]
    ];
    let closest = sides.reduce(
      (s, e) => {
        let [x, y] = e;
        let dx = mx - x;
        let dy = my - y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        let min = s[0] > dist ? [dist, x, y] : s;
        return min;
      },
      [Number.MAX_SAFE_INTEGER, 0, 0]
    );
    return closest;
  };

  function makeArrow([d1, d2]) {
    let nuline = (x1, y1, x2, y2, mark = "") =>
      `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#f00" stroke-width="2" ${mark}/>`;
    let nug = () => document.createElementNS("http://www.w3.org/2000/svg", "g");
    let p1 = {
      x: +d1.offsetLeft,
      y: +d1.offsetTop,
      w: +d1.clientWidth,
      h: +d1.clientHeight,
      mx: +d1.dataset.x,
      my: +d1.dataset.y
    };
    let p2 = {
      x: +d2.offsetLeft,
      y: +d2.offsetTop,
      w: +d2.clientWidth,
      h: +d2.clientHeight,
      mx: +d2.dataset.x,
      my: +d2.dataset.y
    };
    let c1 = { x:p2.x+p2.w/2,y:p2.y+p2.h/2 };
    let c2 = { x:p1.x+p1.w/2,y:p1.y+p1.h/2 };
    let [_a,x1,y1] = getSide(p1,c1);
    let [_b,x2,y2] = getSide(p2,c2);

    
    let l1 = nuline(x1, y1, x2, y2, 'marker-end="url(#arrowhead)"');
    if (l1) {
      let g = nug();
      g.innerHTML = l1 + `<circle cx="${close[1]}" cy="${close[2]}" r="2"/>`;

      svg.appendChild(g);
    }
  }
}
