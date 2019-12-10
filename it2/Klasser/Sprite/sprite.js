// @ts-check
class Sprite {
  constructor({ div, x, y, w, h }) {
    this.div = div;
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 10;
    this.h = h || 10;
  }
  render() {
    this.div.style.transform = `translate(${this.x}px,${this.y}px)`;
  }
}

class Movable extends Sprite {
  constructor(spriteInfo, vx, vy) {
    super(spriteInfo);
    this.vx = vx;
    this.vy = vy;
  }
  move() {
    this.x += this.vx;
    this.y += this.vy;
  }
}

class Turnable extends Movable {
  constructor(spriteInfo, angle, speed) {
    let vx = Math.cos(angle) * speed;
    let vy = Math.sin(angle) * speed;
    super(spriteInfo, vx, vy);
    this.angle = angle;
    this.speed = speed;
  }
  turn(delta) {
    this.angle = (this.angle + delta) % (Math.PI * 2);
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;
  }

  // må lage egen render da Sprite sin render ikke har med rotasjon
  render() {
    this.div.style.transform = `translate(${this.x}px,${this.y}px) rotate(${this.angle}rad)`;
  }
}

const g = id => document.getElementById(id);
const getdiv = () => document.createElement("div");

function setup() {
  let divGame = g("game");
  let x = 100,
    y = 100,
    w = 10,
    h = 10;
  let s = new Sprite({ div: getdiv(), x, y, w: 5, h: 25 });
  let m = new Movable({ div: getdiv(), x, y, w: 20, h: 20 }, 2, 3);
  let r = new Turnable({ div: getdiv(), x, y, w: 30, h: 15 }, 0.3, 3);
  s.div.className = "tree";
  m.div.className = "bird";
  r.div.className = "dog";
  divGame.append(s.div, m.div, r.div);


  // lager en liste over ting som skal flyttes/oppdateres
  // s trenger ikke være med i lista (står jo i ro), men tatt med
  // for å vise bruken av arv og instanceof
  // dersom s ikke med - da må vi kjøre s.render() her.
  const itemList = [s, m, r];
  
  setInterval(() => {
    for (let item of itemList) {
      item.render();   // alle
      if (item instanceof Movable) item.move();  // bird og dog
      if (item instanceof Turnable) item.turn(0.05);  // bare dog
    }
  }, 40);
}
