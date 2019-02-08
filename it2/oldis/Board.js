// export 
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
      let linecount = 0;  // count completed lines
      let c = this.cells;
      for (let y = c.length - 2; y > 0; y--) {
        let line = c[y].slice(1, -1);  // do not take edges
        if (line.every(e => e > 0)) {
          // found a full line, copy all lines above down 1, clear top line
          linecount++;
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
      return linecount;  // number of complete lines
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