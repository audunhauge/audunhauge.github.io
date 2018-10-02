let _idnum = 0;

class Skudd {

  static get idnum() {
    _idnum = (_idnum + 1) % 20;
    return _idnum;
  }

  constructor(id, klass) {
    this.div = document.createElement("div");
    this.div.id = id;
    this.div.className = "skudd " + klass;
    this.body = new RigidBody(0,0,1,3,0);    
    this.alive = false;
    this.owner = null;
    // each shot must have an owner
    // used to avoid shooting self
    this.idnum = 0;  // each player numbers her shots % 20
    this.is = 'Skudd';
  }
  
  strike(other) {
    this.alive = false;
  }

  hit(klass) {
    switch(klass) {
      case 'Tank':
        return 20;
        break;
      default:
        return 50;
        break;  
    }
  }

  die() {
    this.alive = false;
    this.body.x = -200;
    this.setpos();
  }
  
  fire(owner, idnum, x, y, rot) {
    this.alive = true;
    this.body.x = x + 12 * Math.sin(Math.PI * rot / 180);
    this.body.y = y + 5 * Math.cos(Math.PI * rot / 180);
    this.body.rot = rot;
    this.owner = owner;
    this.idnum = idnum;
    this.div.style.transform = 'rotate(' + rot + 'deg)';
  }
  
  move(delta) {
    if (this.alive) {
      this.body.move(delta);
      this.setpos();
      if (this.body.x < 0 || this.body.x > 500 || this.body.y < 0 || this.body.y > 500) {
        this.alive = false;
      }
    }
  }

  setpos() {
    this.div.style.left = this.body.x + "px";
    this.div.style.top = this.body.y + "px";
  }
  
}