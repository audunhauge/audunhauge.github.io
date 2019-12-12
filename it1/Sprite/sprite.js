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
    if (this.x > 600 - this.w) this.vx = -Math.abs(this.vx);
    if (this.x < 0) this.vx = Math.abs(this.vx);
    if (this.y > 600 - this.h) this.vy = -Math.abs(this.vy);
    if (this.y < 0) this.vy = Math.abs(this.vy);
  }
}

class Turnable extends Movable {
  constructor(spriteInfo, angle, speed) {
    let vx = Math.cos(angle) * speed;
    let vy = Math.sin(angle) * speed;
    super(spriteInfo, vx, vy);
    this.angle = angle;
    this.speed = speed;
    this.diverge = 1;  // tendens til å bomme på målet
  }

  // turn towards m
  turn(m) {
    let dx = m.x - this.x;
    let dy = m.y - this.y;
    if (Math.random() > 0.95) {
      this.diverge = Math.random() * 2 - 1;
    }
    let dist = dx * dx + dy * dy;
    if (dist < 1000) {
      this.angle += Math.random() * 0.2 - 0.1;
    } else {
      this.angle = Math.atan2(dy, dx) + this.diverge;
    }
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x > 600 - this.w) this.vx = -Math.abs(this.vx);
    if (this.x < 0) this.vx = Math.abs(this.vx);
    if (this.y > 600 - this.h) this.vy = -Math.abs(this.vy);
    if (this.y < 0) this.vy = Math.abs(this.vy);
    this.angle = Math.atan2(this.vy, this.vx);
  }

  // må lage egen render da Sprite sin render ikke har med rotasjon
  render() {
    this.div.style.transform = `translate(${this.x}px,${this.y}px) rotate(${this.angle}rad)`;
  }
}

const g = id => document.getElementById(id);
const getdiv = () => document.createElement("div");

const itemList = [];

function setup() {
  let divGame = g("game");
  let x = 100,
    y = 100,
    w = 10,
    h = 10;

  for (let i = 0; i < 20; i++) {
    let x = 50 + Math.random() * 500;
    let y = 50 + Math.random() * 500;
    let s = new Sprite({ div: getdiv(), x, y, w: 5, h: 25 });
    s.div.className = "tree";
    divGame.append(s.div);
    s.render();
    itemList.push(s);
  }

  for (let i = 0; i < 20; i++) {
    let x = 50 + Math.random() * 500;
    let y = 50 + Math.random() * 500;
    let v = Math.random() * 2 + 0.5;
    let r = new Turnable({ div: getdiv(), x, y, w: 6, h: 2 }, 0.3, v);
    r.div.className = "fly";
    divGame.append(r.div);
    itemList.push(r);
  }




  let m = new Movable({ div: getdiv(), x, y, w: 20, h: 20 }, 2, 3);
  m.angry = 100;  // fuggel er sinna - vil ikke lande


  m.div.className = "bird";
  divGame.append(m.div);


  // lager en liste over ting som skal flyttes/oppdateres
  // s trenger ikke være med i lista (står jo i ro), men tatt med
  // for å vise bruken av arv og instanceof
  // dersom s ikke med - da må vi kjøre s.render() her.
  itemList.push(m);


  const treListe = itemList.slice().filter(e => e.div.className === "tree");
  const flueListe = itemList.filter(e => e.div.className === "fly");

  const ANTALLFLUER = flueListe.length;


  function letEtterEtTre() {
    // beregner avstand til nærmeste tre
    // dersom den er liten nok - da sikter vi på treet
    // dersom avstand < minimum da stopper vi fuggelen
    if (m.angry > 0) {
      // sint fuggel vil ikke lande
      m.angry--;
    } else {
      let minst = 600 * 600;
      let mittTre = null;
      for (let tre of treListe) {
        let dist = (m.x - tre.x) ** 2 + (m.y - tre.y) ** 2;  // kvadrat av avstand
        if (dist < 1000) {
          minst = dist;
          mittTre = tre;
        }
      }
      if (minst < 10) {
        // vi har funnet et tre og kan stoppe
        m.vx = m.vy = 0;
      } else if (minst < 1000) {
        let speed = 3;
        let dx = mittTre.x - m.x;
        let dy = mittTre.y - m.y;
        let angle = Math.atan2(dy, dx);
        m.vx = Math.cos(angle) * speed;
        m.vy = Math.sin(angle) * speed;
      }
    }
  }

  function tellFluene() {
    let antall = 0;
    for (let flue of flueListe) {
      let dist = (m.x - flue.x) ** 2 + (m.y - flue.y) ** 2;  // kvadrat av avstand
      if (dist < 1000) {
        antall++;
      }
    }
    if (antall > 20 || antall / ANTALLFLUER > 0.85) {
      m.vx = Math.random() * 20 - 10;
      m.vy = Math.random() * 20 - 10;
      m.angry = 100;   // fuggel er irritert
    }

  }

  setInterval(() => {
    for (let item of itemList) {
      item.render();   // alle
      if (item instanceof Movable) item.move();  // bird og fly
      if (item instanceof Turnable) item.turn(m);  // bare fly
    }

    if (m.vx !== 0 && m.vy !== 0) {
      // ser ut som fuggel flyr
      letEtterEtTre();
    } else {
      // sitter i ro
      tellFluene()
    }

  }, 50);
}
