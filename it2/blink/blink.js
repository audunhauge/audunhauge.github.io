

/**
 * Sprite - Et element som skal vises på skjermen, gitt plassering,w,h og rotasjon
 * Rotasjon kan settes etterpå:  
 *   let p = new Sprite(myDiv,10,10,10,10);
 *   p.rot = (20); p.render();
 * Merk at p.render() må kjøres manuelt etter endring
 * Du kan lage et fake element uten div,
 *   let box = new Sprite(null,0,0,800,600);
 *   Kan være nyttig til å sjekke kollisjoner - vises ikke på skjermen
 * p.touching(q) er sann dersom avstand p,q er mindre enn p.radius+q.radius
 * p.overlap(q) er sann dersom rektangel P(x,y,w,h) overlapper Q(x,y,w,h)
 */
class Sprite {

  constructor(div, x, y, w, h) {
    this.div = div;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.rot = 0;
    this.radius = (w + h) / 4;
    this.isA = "sprite";
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
    return this.x < other.x + other.w && this.x > other.x - this.w && this.y < other.y + other.h && this.y > other.y - this.h;
  }
}

/**
 *  en Movable er en Sprite som kan bevege seg
 *  konstrueres som en sprite, men må ta med rot og velocity
 *  En movable p har p.flytt() og p.roter() som metoder
 */
class Movable extends Sprite {

  constructor(div, x, y, w, h, rot, velocity) {
    super(div, x, y, w, h); // konstruer spriten først
    this.px = x;
    this.py = y;
    this.rot = rot;
    let vinkel = this.rot * Math.PI / 180;
    this.x += velocity * Math.cos(vinkel);
    this.y += velocity * Math.sin(vinkel);
    this.alive = true;
    this.isA = "moveable";
    this.score = 0;
  }

  /**
   * Default ignore - just check alive
   */
  // previous position
  get ignore() {
    return !this.alive;
  }

  /**
   * Default no effect other than collide
   */
  effectOn(other) {
    return false;
  }

  die() {
    this.alive = false;
    this.div.classList.add("hidden");
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
    let vinkel = angle * Math.PI / 180;
    this.x = this.px + velocity * Math.cos(vinkel);
    this.y = this.py + velocity * Math.sin(vinkel);
    this.render();
  }

  edge(box) {
    let damping = Movable.damping;
    let radius = this.radius;
    let x = this.x;
    let y = this.y;

    if (x - radius < 0) {
      let vx = (this.px - this.x) * damping;
      this.x = radius;
      this.px = this.x - vx;
    } else if (x + radius > box.w) {
      let vx = (this.px - this.x) * damping;
      this.x = box.w - radius;
      this.px = this.x - vx;
    }
    if (y - radius < 0) {
      let vy = (this.py - this.y) * damping;
      this.y = radius;
      this.py = this.y - vy;
    } else if (y + radius > box.h) {
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
            let f1 = damping * (x * v1x + y * v1y) / slength;
            let f2 = damping * (x * v2x + y * v2y) / slength;

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

class Blink extends Movable {

  constructor(div, x, y, w, h, rot, velocity) {
    super(div, x, y, w, h, rot, velocity);
    this.hitpoints = 3;
    this.isA = "blink";
  }
  /**
   *  Legger til egenskaper som er spesifikk for Blink
   */


  effectOn(other) {
    if (other.isA === "skudd") {
      this.takeDamage();
      other.score = 1; // counted by tank
      other.die();
    }
    return false;
  }

  takeDamage() {
    this.hitpoints--;
    let p = this.hitpoints;
    this.div.classList.remove(..."h0,h1,h2,h3,h4,h5,h6,h7,h8,h9".split(","));
    this.div.classList.add("h" + p);
    if (this.hitpoints < 0) {
      this.die();
      // setTimeout(this.respawn, 1000);
    }
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
}

class Tank extends Movable {

  constructor(div, x, y, w, h, rot, velocity) {
    super(div, x, y, w, h, rot, velocity);
    this.hitpoints = 100;
    this.reload = 0;
    this.isA = "tank";
  }

  effectOn(other) {
    if (other.isA === "skudd") return true;
    if (other.isA === "blink") {
      this.takeDamage();
      this.score -= 2;
    }
    return false;
  }

  throttle(delta) {
    let vx = this.x - this.px;
    let vy = this.y - this.py;
    let velocity = Math.abs(Math.sqrt(vx * vx + vy * vy));
    return velocity < 4 ? delta : 0;
  }

  friction(coff) {
    let vx = this.x - this.px;
    let vy = this.y - this.py;
    this.ax = -coff * vx + (Math.random() * 0.08 - 0.04);
    this.ay = -coff * vy;
  }

  skyt(skudd) {
    this.reload = 25; // tanks kan ikke snu/skyte på xx frames
    let angle = this.rot;
    let vinkel = angle * Math.PI / 180;
    let vx = 20 * Math.cos(vinkel);
    let vy = 20 * Math.sin(vinkel);
    skudd.x = this.x;
    skudd.y = this.y;
    skudd.px = skudd.x - vx;
    skudd.py = skudd.y - vy;
    this.score += 10 * skudd.score; // will be 1 if a target has been hit
    skudd.alive = true;
    skudd.score = 0;
    skudd.render();
    skudd.div.classList.remove("hidden");
  }

  takeDamage() {
    this.hitpoints -= 7;
    let p = Math.floor(this.hitpoints / 10);
    this.div.classList.remove(..."h0,h1,h2,h3,h4,h5,h6,h7,h8,h9".split(","));
    this.div.classList.add("h" + p);
    if (this.hitpoints < 0) {
      this.alive = false;
    } else {
      this.div.animate([
      // keyframes
      { backgroundColor: "red" }, { backgroundColor: "green" }], {
        // timing options
        duration: 250,
        iterations: 1
      });
    }
  }
}

function setup() {
  let antallBlinker = 5;
  let poeng = 0;

  let friction = 0.03;
  let power = friction;

  let keys = {}; // registrerer alle keys som er trykket ned
  let manyThings = [];

  let box = new Sprite(null, 0, 0, 800, 600); // rammen rundt spillet
  let wall = new Sprite(null, 50, 50, 700, 500); // vegg rundt tanksen

  let divTank = document.getElementById("tank");
  let divSkudd = document.getElementById("skudd");
  let spanPoeng = document.querySelector("#poeng span");

  // her lager vi alle blinkene
  for (let i = 0; i < antallBlinker; i++) {
    let divBlink = document.createElement("div");
    divBlink.className = "sprite blink";
    let blink = new Blink(divBlink, 0, 0, 30, 30, 0, 2);
    blink.respawn(); // plasser tilfeldig langs kant
    let divMain = document.getElementById("main");
    if (divMain !== null) {
      divMain.appendChild(divBlink);
    }
    manyThings.push(blink);
  }

  let tank = new Tank(divTank, 250, 250, 26, 26, 0, 2);
  let skudd = new Movable(divSkudd, 260, 260, 10, 10, 0, 20);
  skudd.alive = false;
  skudd.isA = "skudd";

  manyThings.push(tank);
  manyThings.push(skudd);

  tank.render();

  setInterval(gameEngine, 40);

  window.addEventListener("keydown", registrerKey);
  window.addEventListener("keyup", cancelKey);

  function registrerKey(keyEvent) {
    event.preventDefault();
    keys[keyEvent.keyCode] = 1; // marker at denne key er aktiv
  }

  function cancelKey(keyEvent) {
    event.preventDefault();
    keys[keyEvent.keyCode] = 0; // bruker slapp opp denne key-en
  }

  function gameEngine(e) {
    for (let thing of manyThings) {
      thing.inertia();
      thing.edge(box);
      thing.render();
    }
    power = friction;
    styrSpillet();
    tank.friction(power);
    tank.accelerate(1);
    Movable.collide(manyThings);
    spanPoeng.innerHTML = String(tank.score);
  }

  function styrSpillet() {
    tank.reload--;
    if (tank.reload > 0) return;
    if (keys[32] === 1) {
      tank.skyt(skudd);
    }
    if (keys[38] === 1) {
      power = tank.throttle(-0.02);
    }
    if (keys[36] === 1) {
      power = tank.throttle(0.5);
    }
    if (keys[39] === 1) {
      tank.roter(3);
    }
    if (keys[37] === 1) {
      tank.roter(-3);
    }
  }
}
//*/