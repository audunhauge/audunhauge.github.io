// @ts-check

class Point {
    constructor({x,y}) {
        this.x = x;
        this.y = y;
    }
}

class Vector extends Point {
    constructor({x,y}) {
        super({x,y});
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
    }
}

class Square extends Point {
    constructor({x,y,w,h}) {
        super({x,y});
        this.w = w;
        this.h = h;
    }
    render() {
        ctx.beginPath();
        ctx.strokeStyle = farge;
        ctx.strokeRect(this.x, this.y, this.w, this.h);
    }
}

let canCanvas;
let ctx,farge;
const g = id => document.getElementById(id);


function setup() {
  const divTools = g("tools");
  canCanvas = g("canvas");
  const divFarger = g("farger");
  ctx = canCanvas.getContext("2d");
  // @ts-ignore
  

  farge = "blue";

  divTools.addEventListener("click", activateTool);
  divFarger.addEventListener("click", chooseColor);

  function chooseColor(e) {
    const t = e.target;
    if (t.title) { 
        farge = t.title;
    } 
  }

  function activateTool(e) {
    const t = e.target;
    if (t.title) {
      switch (t.title) {
        case "peker":
          break;
        case "firkant":
          let f = new Square({x:200,y:200,w:50,h:50})
          f.render();
          break;
        case "sirkel":
          tegnSirkel();
          break;
        case "trekant":
          break;
        case "strek":
          break;
        case "visk":
          ctx.clearRect(0, 0, 500, 500);
          break;
      }
    }
  }


  function tegnSirkel() {
    ctx.beginPath();
    ctx.strokeStyle = farge;
    ctx.arc(200, 200, 50, 0, 2 * Math.PI, false);
    ctx.stroke();
  }

  
}
