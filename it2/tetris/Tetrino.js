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


// export 
class Tetrino {
    constructor(name) {
      this.cells = this.makeShape(name);
      this.rot = 0; // initial rotation
      this.class = name;
      this.x = 3; // starting x
      this.y = -1;
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
                // the position is already taken
                // moving here would result in a collide
                // thus the move is illegal
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