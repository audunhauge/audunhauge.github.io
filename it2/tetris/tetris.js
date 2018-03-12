// @flow

const shapes = {
  I: ",****",
  O: " **, **",
  J: "*,***",
  L: "***,*",
  S: " **,**",
  Z: "**, **",
  T: " *,***"
};

function rotate(arr, w) {
  let b = [];
  for (let y = 0; y < w; y++) {
    b[y] = [];
    for (let x = 0; x < w; x++) {
      b[y][x] = arr[x][y];
    }
  }
  return b.reverse();
}

class Tetrino {
  constructor(name) {
    this.cells = this.makeShape(name);
    this.rot = 0; // initial rotation
    this.class = name;
    this.x = 3; // starting x
    this.y = -3;
  }

  /**
   * Return bricks for current rotation
   */
  bricks() {
    return this.cells[this.rot];
  }

  /**
   * Change rotation to next state (+-)
   * @param {number} delta +1 or -1
   */
  rotate(delta) {
    this.rot = (this.rot + Math.sign(delta) + 4) % 4;
  }

  render(board, wipe = false) {
    let k = wipe ? "" : this.class;
    let b = this.bricks();
    let d = board.divs;
    b.forEach((row, y) => {
      row.forEach((c, x) => {
        if (c) {
          let idx = (this.y + y) * 12 + (this.x + x);
          if (d[idx]) {
            d[idx].className = "tetromino " + k;
          }
        }
      });
    });
  }

  legalMove(board, dx, dy, rot) {
    let r = this.rot; // restore after getting cells
    this.rotate(rot);
    let b = this.bricks();
    this.rot = r; // undo rotation
    let d = board.cells;
    for (let y = 0; y < b.length; y++) {
      let row = b[y];
      for (let x = 0; x < row.length; x++) {
        let c = row[x];
        if (c) {
          let px = x + this.x + dx;
          let py = y + this.y + dy;
          if (py >= 0 && d[py] && px >= 0) {
            if (d[py][px]) {
              return false;
            }
          }
        }
      }
    }
    return true;
  }

  /**
   * Given a tetrino name (IOJLSZT) - creates array of cells
   * fetches shape (a string like "**,**") which is split
   * on "," - each * becomes a number (1,2,3,4,5) based on
   * index of name in "IOJLSZT" + 1, space remains unchanged (0)
   * @param {string} name
   */
  makeShape(name) {
    let k = "IOJLSZT".indexOf(name) + 1;
    let ar = [];
    let base = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    let pattern = shapes[name].split(",");
    pattern.forEach((row, i) => {
      [...row].forEach((e, j) => {
        if (e !== " ") base[i][j] = k;
      });
    });
    ar.push(base);
    let rr;
    let size = 3;
    if (name === "I") {
      // rotate 4x4
      size = 4;
    }
    if (name === "O") {
      ar.push(base);
      ar.push(base);
      ar.push(base);
    } else {
      let r1 = rotate(base, size);
      ar.push(r1);
      let r2 = rotate(r1, size);
      ar.push(r2);
      let r3 = rotate(r2, size);
      ar.push(r3);
    }
    return ar;
  }
}

class Board {
  constructor(div) {
    this.div = div;
    this.cells = [];
    this.divs = [];
    for (let i = 0; i < 20; i++) {
      this.cells.push([9, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9]);
    }
    this.cells.push([9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9]);
    for (let i = 0; i < 21 * 12; i++) {
      let t = document.createElement("div");
      t.className = "tetromino";
      div.appendChild(t);
      this.divs.push(t);
    }
  }

  render() {
    this.cells.forEach((row, y) => {
      row.forEach((c, x) => {
        let d = this.divs[y * 12 + x];
        let k = "xIOJLSZTxx".charAt(c);
        d.className = "tetromino " + k;
      });
    });
  }

  /**
   * Discover any completed lines and remove them
   * Iterate bottum up - skipping lowest line ( list of 9s )
   */
  complete() {
    let c = this.cells;
    for (let y = c.length - 2; y > 0; y--) {
      let line = c[y].slice(1, -1);
      if (line.every(e => e > 0)) {
        // found a full line, copy all lines above down 1, clear top line
        for (let yi = y - 1; yi > 0; yi--) {
          for (let xi = 1; xi < 11; xi++) {
            c[yi + 1][xi] = c[yi][xi];
          }
        }
        for (let xi = 1; xi < 11; xi++) {
          c[0][xi] = 0;
        }
        y++;  // back up to check dropped line
      }
    }
  }

  /**
   * Merge a given tetrino onto the board
   * After - check for complete lines
   * @param {Tetrino} t
   */
  merge(t) {
    let b = t.bricks();
    let d = this.cells;
    b.forEach((row, y) => {
      row.forEach((c, x) => {
        if (c) {
          d[y + t.y][x + t.x] = c;
        }
      });
    });
  }
}

function setup() {
  let divBrett = document.getElementById("brett");
  let b = new Board(divBrett);
  let tname = "T";
  let t = new Tetrino(tname);

  let timer = setInterval(gameEngine, 800);
  document.addEventListener("keydown", respondToUser);

  function respondToUser(e) {
    t.render(b, true); // wipe board
    switch (e.keyCode) {
      case 40:
        if (t.legalMove(b, 0, 0, 1)) t.rotate(1);
        break;
      case 38:
        if (t.legalMove(b, 0, 0, -1)) t.rotate(-1);
        break;
      case 37:
        if (t.legalMove(b, -1, 0, 0)) t.x--;
        break;
      case 39:
        if (t.legalMove(b, 1, 0, 0)) t.x++;
        break;
      case 32:
        clearInterval(timer);
        timer = setInterval(gameEngine, 30);
    }
    t.render(b);
  }

  function gameEngine(e) {
    if (t.legalMove(b, 0, 1, 0)) {
      t.y++;
    } else {
      if (t.y < 0) {
        gameOver();
        clearInterval(timer);
        return;
      }
      b.merge(t); // merge tetrino onto board
      b.complete();
      tname = "IOJLSZT"
        .replace(tname, "")
        .charAt(Math.floor(Math.random() * 6));
      t = new Tetrino(tname);
      clearInterval(timer);
      timer = setInterval(gameEngine, 800);
    }
    b.render();
    t.render(b);
  }

  function gameOver() {
    document.getElementById("main").innerHTML = "Game over";
  }
}

setup();
