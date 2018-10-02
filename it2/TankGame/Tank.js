const THW = 16;

class Tank {
  constructor(id, klass) {
    this.div = document.createElement("div");
    this.div.className = "tanks " + klass;
    this.div.id = id;
    this.speed = 1;
    this.a = 0.035;
    this.body = new RigidBody(0,0,THW,THW,0);
    this.delay = 0;
    this.turnrate = 2;
    this.alive = true;
    this.owner = null;
    this.is = 'Tank';
    this.idnum = 0;
    this.hitpoints = 100;
  }

  hit(klass) {
    return 5;
  }
  
  takeDamage(amount) {
    this.hitpoints -= amount;
    if (this.hitpoints < 50) {
      this.div.classList.add("damaged");  
    }
  }

  move(delta) {
    if (this.alive) {
      this.body.move(delta);
      this.setpos();
    }
  }

  setpos() {
    this.div.style.left = this.body.x + "px";
    this.div.style.top = this.body.y + "px";
  }

  turn(delta) {
    if (this.alive) {
      if (this.body.v < 0) delta *= 2.5;        //turn fast when reversing
      let d = (this.body.rot + delta) % 360;
      this.body.rot = d;
    }
  }
  
  direction(angle) {
    this.div.style.transform = 'rotate(' + angle + 'deg)';
  }
}