// @ts-check

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
      this.die();
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

  respawn() {
    let xpos = 10 + 20 * Math.random(),
      ypos = 10 + 100 * Math.random(),
      vx = 0,
      vy = Math.random() * 10 - 5;
    this.px = xpos;
    this.py = ypos;
    this.y = ypos + vy;
    this.x = xpos + vx;
    this.alive = true;
    this.div.classList.remove("hidden");
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

class Particle extends Movable {
  charge;
  constructor(div, x, y, w, h, vx, vy, charge) {
    super(div, x, y, w, h, vx, vy); // konstruer spriten først
    this.charge = charge;
  }
}

class Ohm extends Movable {
    ox; oy;
    constructor(div, x, y, w, h, vx, vy) {
      super(div, x, y, w, h, vx, vy); // konstruer spriten først
      this.ox = x;
      this.oy = y;
    }
    inertia() { 
        this.x = this.ox;
        this.y = this.oy;
    }
  }

function setup() {
  let divMain = document.getElementById("conductor");
  let divVoltage = document.getElementById("voltage");
  let friction = 0.03;
  let power;

  let volts = [];

  let ohms = [];

  let manyThings = [];
  let box;
  let segment;
  {
    let h = divMain.clientHeight;
    let w = divMain.clientWidth;
    box = new Sprite(null, 0, 0, w, h); // rammen rundt spillet
    segment = w / 10; // used to count charges in 10 segments
  }

  for (let i = 0; i < 10; i++) {
    let div = document.createElement("div");
    div.className = "volt";
    divVoltage.appendChild(div);
    volts.push(div);
  }

  // her lager vi alle elektronene

  if (divMain) {
    for (let i = 0; i < 1352; i++) {
      let divElectron = document.createElement("div");
      divElectron.className = "electron";
      let electron = new Particle(divElectron, 0, 0, 10, 10, 0, 2, -1);
      electron.die(); // plasser tilfeldig langs kant
      divMain.appendChild(divElectron);
      manyThings.push(electron);
    }
  }

  // vi lager noen hindringer (motstand - ohm)
  if (divMain) {
    for (let i = 0; i < 16; i++) {
      let x = Math.random() * 400 + 500;
      let y = Math.random() * 100 + 5;
      let divOhm = document.createElement("div");
      divOhm.className = "ohm";
      let ohm = new Ohm(divOhm, x, y, 30, 30, 0, 0);
      divMain.appendChild(divOhm);
      manyThings.push(ohm);
    }
  }

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
    // styrSpillet();
    Movable.collide(manyThings);
    generate();
    voltage();
  }

  function voltage() {
    let charges = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // bin the charges (note extra bin for edge)
    let theQuick = manyThings.filter(e => e.alive && e.charge === -1);
    if (theQuick.length > 0) {
      theQuick.forEach(e => {
        let segid = Math.trunc(e.x / segment);
        charges[segid] += e.charge;
        volts[segid].style.height = 2 - 5*(charges[segid+1] - charges[segid]) + "px";
      });
      theQuick.forEach(e => {
        let segid = Math.trunc(e.x / segment);
        let dv = charges[segid + 1] - charges[segid];
        e.ax = dv;
        e.accelerate(0.08);
      });
    }
  }

  function generate() {
    let theDead = manyThings.filter(e => !e.alive);
    let lefties = manyThings.filter(e => e.alive && e.x < 20);
    while (lefties.length < 9 && theDead.length > 0) {
      let zombie = theDead.pop();
      zombie.respawn();
      lefties = manyThings.filter(e => e.alive && e.x < 20);
    }
  }

  // function styrSpillet() {}
}
