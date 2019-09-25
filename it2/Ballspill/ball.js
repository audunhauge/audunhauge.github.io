// @ts-check

class Keys {
  static keys = new Set();
  static za = document.addEventListener("keydown", Keys.mark);
  static zb = document.addEventListener("keyup", Keys.unmark);
  static mark(e) {
    Keys.keys.add(e.key);
  }
  static unmark(e) {
    Keys.keys.delete(e.key);
  }
  static any() {
    return Keys.keys.size > 0;
  }
  static many() {
    return Keys.keys.size > 1;
  }
  static has(a) {
    return Keys.keys.has(a);
  }
}

class Sprite {
  div;
  x;
  y;
  w;
  h;
  rot = 0;
  radius;
  constructor(div, x, y, w, h) {
    this.div = div;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.radius = (w + h) / 4;
  }

  render() {
    if (!this.div) return;
    this.div.style.left = this.x - this.radius + "px";
    this.div.style.top = this.y - this.radius + "px";
    this.div.style.transform = "rotate(" + this.rot + "deg)";
  }

  /**
   * Check if this sprite is touching other sprite
   * Uses center(x,y) and radius
   */
  touching(other) {
    let dx = this.x - other.x;
    let dy = this.y - other.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + other.radius;
  }

  /**
   *
   * Check if this sprite overlaps other sprite
   * Uses bounding box (w,h)
   */
  overlap(other) {
    return (
      this.x < other.x + other.w &&
      this.x > other.x - this.w &&
      this.y < other.y + other.h &&
      this.y > other.y - this.h
    );
  }
}

/**
 *  en Movable er en Sprite som kan bevege seg
 *  konstrueres som en sprite, men har vx, vy
 */
class Movable extends Sprite {
  px;
  py;
  ax = 0;
  ay = 0;
  alive = true;
  constructor(div, x, y, w, h, vx, vy) {
    super(div, x, y, w, h); // konstruer spriten først
    this.px = x;
    this.py = y;
    this.x += vx;
    this.y += vy;
  }

  respawn() {
    let xpos, ypos, vx, vy;
    if (Math.random() > 0.5) {
      // plasser oppe/nede
      xpos = Math.floor(Math.random() * 700) + 10;
      vx = Math.floor(Math.random() * 4) - 2;
      if (Math.random() > 0.5) {
        // plasser oppe
        ypos = 10;
        vy = Math.floor(Math.random() * 4) + 1;
      } else {
        // plasser nede
        ypos = 550;
        vy = -Math.floor(Math.random() * 4) - 1;
      }
    } else {
      // plasser høyre/venstre
      ypos = Math.floor(Math.random() * 500) + 10;
      vy = Math.floor(Math.random() * 4) - 2;
      if (Math.random() > 0.5) {
        // plasser høyre
        xpos = 730;
        vx = -Math.floor(Math.random() * 4) - 1;
      } else {
        // plasser venstre
        xpos = 10;
        vx = Math.floor(Math.random() * 4) + 1;
      }
    }
    this.px = xpos;
    this.py = ypos;
    this.y = ypos + vy;
    this.x = xpos + vx;
    this.alive = true;
    this.hitpoints = 3;
    this.div.classList.remove("hidden");
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

  static get damping() {
    return 0.985;
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
  }

  roter(delta) {
    if (!this.alive) return;
    let vx = this.x - this.px;
    let vy = this.y - this.py;
    this.rot = (this.rot + delta) % 360;
    let angle = this.rot;
    let velocity = Math.sqrt(vx * vx + vy * vy);
    let vinkel = (angle * Math.PI) / 180;
    this.x = this.px + velocity * Math.cos(vinkel);
    this.y = this.py + velocity * Math.sin(vinkel);
    this.render();
  }

  // sjekker at this er innenfor box
  // dersom utenfor plasseres this innenfor
  // dermed gis impuls slik at this beveger seg innover
  // merk at testen avsluttes ved første kant som overskrides
  // i rekkefølge venstre,høyre,topp,bunn
  // Ved neste timeframe oppdages da evt overlapp med kant nr to
  // dersom vi har truffet et hjørne
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
      this.x = box.w - radius;
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
  }

  /**
   * Kollisjon mellom alle blinkene
   * Dobbel løkke slik at blink nr 1
   *   sjekker kollisjon med blink 2,3, ...
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

function setup() {
  let friction = 0.03;
  let power = friction;

  let manyThings = [];

  let box = new Sprite(null, 0, 0, 800, 600); // rammen rundt spillet

  // her lager vi alle blinkene
  let divMain = document.getElementById("box");
  if (divMain) {
    for (let i = 0; i < 52; i++) {
      let divBlink = document.createElement("div");
      divBlink.className = "ball";
      let blink = new Movable(divBlink, 0, 0, 10, 10, 0, 2);
      blink.respawn(); // plasser tilfeldig langs kant
      divMain.appendChild(divBlink);
      manyThings.push(blink);
    }
  }

  // lag en ball som følger brukers mus
  let divBounce = document.createElement("div");
  divBounce.className = "bounce";
  let bounce = new Movable(divBounce,200,200,20,20,0,0);
  divMain.appendChild(divBounce);
  manyThings.push(bounce);

  let ge = setInterval(gameEngine, 40);
  document.addEventListener("mousemove", getxy);

  function getxy(e) {
    let x = e.clientX;
    let y = e.clientY;
    
  }

  function gameEngine(e) {
    for (let thing of manyThings) {
      thing.inertia();
      thing.edge(box);
      thing.render();
    }
    power = friction;
    styrSpillet();
    Movable.collide(manyThings);
  }

  function styrSpillet() {}
}
