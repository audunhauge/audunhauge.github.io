// @ flow

class Nation {
  /*
  name;
  capital;
  leader;
  title;
  // */
  constructor(name, nation) {
    this.name = name;
    this.capital = nation.capital;
    this.leader = nation.leader;
    this.title = nation.title;
  }

  render() {
    let s = `<div id="${this.name}>${name}</div>`;
  }
}

class Game {
  constructor(name, obj) {
    this.name = name;
    this.freq = obj.freq;
    this.hi = obj.hi;
    this.wi = obj.wi;
    this.radius = obj.radius;
    this.seed = obj.seed;
    this.size = obj.size;
    this.land = obj.land;
    this.describe = obj.describe || "A nice map";
  }

  render() {
    return `
    <div>
      <h4>${this.name}</h4>
        <p>${this.describe}
          <br>Width:${this.wi} Height:${this.hi}
        </p>
        <button class="startgame" type="button" id="${this.name}">Play ${this.name}</button>
    </div>
    `;
  }
}