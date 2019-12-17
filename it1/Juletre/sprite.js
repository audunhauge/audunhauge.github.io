// @ts-check
class Sprite {
  radius;
  alive = true;
  constructor({ div, x, y, w, h }) {
    this.div = div;
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 10;
    this.h = h || 10;
    this.radius = (w + h) / 4;
  }

  render() {
    this.div.style.transform = `translate(${this.x - this.w / 2}px,${this.y -
      this.h / 2}px)`;
  }

  touching(other) {
    let dx = this.x - other.x;
    let dy = this.y - other.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + other.radius;
  }

  overlap(other) {
    return (
      this.x < other.x + other.w &&
      this.x > other.x - this.w &&
      this.y < other.y + other.h &&
      this.y > other.y - this.h
    );
  }
  effectOn(other) {
    return false;
  }

  die() {
    this.alive = false;
    this.div.classList.add("hidden");
  }

  get ignore() {
    return !this.alive;
  }

  get isa() {
    return "Sprite";
  }
}

class Movable extends Sprite {
  px;
  py;
  ax = 0;
  ay = 0;
  diverge = 0;
  edgy = 0;
  rot;
  constructor(spriteInfo, vx, vy) {
    super(spriteInfo);
    this.px = this.x;
    this.py = this.y;
    this.x += vx;
    this.y += vy;
    this.rot = Math.atan2(vy, vx);
  }

  static get damping() {
    return 0.9985;
  }

  get isa() {
    return "Movable";
  }

  accelerate(delta) {
    if (!this.alive) return;
    this.x += this.ax * delta * delta;
    this.y += this.ay * delta * delta;
    this.ax = 0;
    this.ay = 0;
  }

  inertia() {
    if (!this.alive) return;
    let x = this.x * 2 - this.px;
    let y = this.y * 2 - this.py;
    this.px = this.x;
    this.py = this.y;
    this.x = x;
    this.y = y;
    this.vx = x - this.px;
    this.vy = y - this.py;
  }

  roter(delta) {
    if (!this.alive) return;
    let vx = this.x - this.px;
    let vy = this.y - this.py;
    this.rot = (this.rot + delta) % (2 * Math.PI);
    let velocity = Math.sqrt(vx * vx + vy * vy);
    this.x = this.px + velocity * Math.cos(this.rot);
    this.y = this.py + velocity * Math.sin(this.rot);
    this.render();
  }

  edge(box) {
    let damping = Movable.damping;
    let radius = this.radius;
    let x = this.x;
    let y = this.y;
      if (x - radius < box.x) {
        // utenfor box venstre kant
        let vx = (this.px - this.x) * damping;
        this.x = radius;
        this.px = this.x - vx;
    
      } else if (x + radius > box.w) {
        // utenfor høyre kant
        let vx = (this.px - this.x) * damping;
        this.x = box.w - 3*radius;
        this.px = this.x - vx;
    
      }
      if (y - radius < box.y) {
        // utenfor top av box
        let vy = (this.py - this.y) * damping;
        this.y = radius;
        this.py = this.y - vy;
    
      } else if (y + radius > box.h) {
        // utenfor bunn av box
        let vy = (this.py - this.y) * damping;
        this.y = box.h - radius;
        this.py = this.y - vy;
    
      }
    this.vx = this.x - this.px;
    this.vy = this.y - this.py;
    this.rot = Math.atan2(this.vy, this.vx);
    this.edgy = this.edgy > 0 ? this.edgy - 1 : 0;
  }

  /**
   * Kollisjon mellom alle kropper
   * Dobbel løkke slik at kropp nr 1
   *   sjekker kollisjon med kropp 2,3, ...
   *   Nr 2 sjekker mot 3,4, ...
   *     Nr 3 sjekker mot 4,5, ...
   *      osv
   * @param {*} bodies
   * @param {*} preserve_impulse
   */
  static collide(bodies, preserve_impulse = true) {
    let damping = Movable.damping;
    for (let i = 0, l = bodies.length; i < l; i++) {
      let body1 = bodies[i];
      if (body1.isa === "Sprite") continue; // Sprites dont move
      if (body1.ignore) continue;
      for (let j = i + 1; j < l; j++) {
        let body2 = bodies[j];
        if (body2.ignore) continue;
        let x = body1.x - body2.x;
        let y = body1.y - body2.y;
        let slength = x * x + y * y;
        let length = Math.sqrt(slength);
        let target = body1.radius + body2.radius;
        if (length < target) {
          let skip = false;
          skip = skip || body1.effectOn(body2); // default no effect
          skip = skip || body2.effectOn(body1); // changed for skudd and tank
          if (skip) continue;

          if (body2.isa === "Sprite") {
            // collided with a static sprite
            // find lesser of dx,dy
            let dx = body1.x - body2.x;
            let dy = body1.y - body2.y;
            if (Math.abs(dx) > Math.abs(dy)) {
              // mostly x overlap
              let vx = (body1.px - body1.x) * damping;
              body1.x += dx;
              body1.px = body1.x - vx;
            } else {
              // mostly y overlap
              let vy = (body1.py - body1.y) * damping;
              body1.y += dy;
              body1.py = body1.y - vy;
            }
          } else {
            // collided with a movable
            let v1x = body1.x - body1.px;
            let v1y = body1.y - body1.py;
            let v2x = body2.x - body2.px;
            let v2y = body2.y - body2.py;

            let factor = (length - target) / length;
            body1.x -= x * factor * 0.5;
            body1.y -= y * factor * 0.5;
            body2.x += x * factor * 0.5;
            body2.y += y * factor * 0.5;
            if (preserve_impulse) {
              let f1 = (damping * (x * v1x + y * v1y)) / slength;
              let f2 = (damping * (x * v2x + y * v2y)) / slength;

              v1x += f2 * x - f1 * x;
              v2x += f1 * x - f2 * x;
              v1y += f2 * y - f1 * y;
              v2y += f1 * y - f2 * y;

              body1.px = body1.x - v1x;
              body1.py = body1.y - v1y;
              body2.px = body2.x - v2x;
              body2.py = body2.y - v2y;
            }
          }
        }
      }
    }
  }
}

class Santa extends Movable {
  angry = 100;
  constructor(spriteInfo, vx, vy) {
    super(spriteInfo, vx, vy);
  }
  get ignore() {
    // angry santa cant collide
    return this.angry > 50 || (this.vx === 0 && this.vy === 0);
  }
}

class Child extends Movable {
  constructor(spriteInfo) {
    let velocity = Math.random() * 3 + 0.3;
    let rot = Math.random() * 0.2 - 0.1;
    let vx = Math.cos(rot) * velocity;
    let vy = Math.sin(rot) * velocity;
    super(spriteInfo, vx, vy);
    this.excited = false;
    this.edgy = 0;
  }
  // turn towards m
  turn(m, maxDist = 1000, minDist = 100000) {
    let dx = m.x - this.x;
    let dy = m.y - this.y;
    let dist = dx * dx + dy * dy;
    let vx = this.x - this.px;
    let vy = this.y - this.py;
    let velocity = Math.sqrt(vx * vx + vy * vy);
    if (dist > minDist) {
      // child cant see santa
      this.excited = false;
      if (velocity < 0.01 && this.edgy === 0) {
        velocity = Math.random() * 0.2 + 0.1;
      }
    } else {
      if (Math.random() > 0.95) {
        this.diverge = Math.random() * 2 - 1;
      }
      if (dist < maxDist) {
        this.rot += Math.random() * 0.2 - 0.1;
      } else {
        this.rot = Math.atan2(dy, dx) + this.diverge;
      }
      if (!this.excited) {
        velocity = Math.random() * 3 + 0.5;
        this.excited = true;
      }
    }
    this.vx = Math.cos(this.rot) * velocity;
    this.vy = Math.sin(this.rot) * velocity;
    this.px = this.x - this.vx;
    this.py = this.y - this.vy;
  }
}

const g = id => document.getElementById(id);
const getdiv = () => document.createElement("div");
const box = new Sprite({ div: getdiv(), x: 0, y: 0, h: 900, w: 900 });

const itemList = [];

function setup() {
  let divGame = g("game");

  for (let i = 0; i < 40; i++) {
    let x = 50 + Math.random() * 800;
    let y = 50 + Math.random() * 800;
    let r = new Child({ div: getdiv(), x, y, w: 10, h: 10 });
    r.div.className = "child p" + (i % 8);
    divGame.append(r.div);
    itemList.push(r);
  }

  for (let i = 0; i < 20; i++) {
    let x = 50 + Math.random() * 800;
    let y = 50 + Math.random() * 800;
    let s = new Sprite({ div: getdiv(), x, y, w: 50, h: 50 });
    s.div.className = "tree";
    divGame.append(s.div);
    s.render();
    itemList.push(s);
  }

  let m = new Santa({ div: getdiv(), x: 200, y: 200, w: 40, h: 40 }, 3, 4);
  m.div.className = "santa";
  divGame.append(m.div);
  itemList.push(m);

  const treListe = itemList
    .slice()
    .filter(e => e.div.classList.contains("tree"));
  const flueListe = itemList.filter(e => e.div.classList.contains("child"));

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
        let dist = (m.x - tre.x) ** 2 + (m.y - tre.y) ** 2; // kvadrat av avstand
        if (dist < 1000) {
          minst = dist;
          mittTre = tre;
        }
      }
      if (minst < 10) {
        // vi har funnet et tre og kan stoppe
        m.px = m.x;
        m.py = m.y;
      } else if (minst < 1000) {
        let speed = 3;
        let dx = mittTre.x - m.x;
        let dy = mittTre.y - m.y;
        let angle = Math.atan2(dy, dx);
        m.vx = Math.cos(angle) * speed;
        m.vy = Math.sin(angle) * speed;
        m.px = m.x - m.vx;
        m.py = m.y - m.vy;
      }
    }
  }

  function tellFluene() {
    let antall = 0;
    for (let flue of flueListe) {
      let dist = (m.x - flue.x) ** 2 + (m.y - flue.y) ** 2; // kvadrat av avstand
      if (dist < 2500) {
        antall++;
      }
    }
    if (antall > 5 || antall / ANTALLFLUER > 0.85) {
      m.vx = Math.random() * 20 - 10;
      m.vy = Math.random() * 20 - 10;
      m.px = m.x - m.vx;
      m.py = m.y - m.vy;
      m.angry = 100; // fuggel er irritert
    }
  }

  setInterval(() => {
    for (let item of itemList) {
      item.render(); // alle
      if (item instanceof Movable) {
        item.inertia(); // bird og fly
        if (item instanceof Child ) {
          item.turn(m); // bare ungene
        }
        item.edge(box);
      }
    }
    Movable.collide(itemList);
    if (Math.abs(m.x - m.px) > 0.01 || Math.abs(m.y - m.py) > 0.01) {
      // ser ut som fuggel flyr
      letEtterEtTre();
    } else {
      // sitter i ro
      tellFluene();
    }
  }, 40);
}
