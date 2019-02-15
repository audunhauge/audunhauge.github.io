// @ts-check

const types = 'OILJSZT'.split("");

const bricks = new Map();
bricks.set("O", "....|.xx.|.xx.|....");
bricks.set("I", ".x..|.x..|.x..|.x..");
bricks.set("L", ".x..|.x..|.xx.|....");
bricks.set("J", "..x.|..x.|.xx.|....");
bricks.set("S", "....|..xx|.xx.|....");
bricks.set("Z", "....|xx..|.xx.|....");
bricks.set("T", "....|xxx.|.x..|....");

class Tetramino {
    constructor(type) {
        this.blocks = [
            [
                [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]
            ]
        ];
        this.rotation = 0;
        let pattern = bricks.get(type).split('|');
        for (let i = 0; i < 4; i++) {
            let line = pattern[i];
            let block = this.blocks[0][i];
            for (let j = 0; j < 4; j++) {
                let mark = line.charAt(j);
                if (mark === 'x') {
                    block[j] = type;
                }
            }
        }
        let base = this.blocks[0];
        for (let i = 1; i < 4; i++) {
            base = rot(base);
            this.blocks[i] = base;
        }
        /**
         * Rotate array right - returning copy
         * @param {array} arr  input array
         * @returns {array} rotated copy of arr (right rot) 
         */
        function rot(arr) {
            let b = [];
            for (let y = 0; y < 4; y++) {
                b[y] = [];
                for (let x = 0; x < 4; x++) {
                    b[y][x] = arr[x][y];
                }
            }
            return b.reverse();
        }
    }

    transfer(xp, yp, brett) {
        let mineRuter = this.blocks[this.rotation];
        for (let y = 0; y < 4; y++) {
            let rad = mineRuter[y];
            for (let x = 0; x < 4; x++) {
                let f = rad[x];
                if (f !== 0) {
                    let idx = (y + yp) * 12 + x + xp;
                    if (idx >= 0 && idx < 20 * 12) {
                        brett[yp+y][xp+x] = f;
                    }
                }
            }
        }
    }

    render(xp, yp, arr) {
        let mineRuter = this.blocks[this.rotation];
        for (let y = 0; y < 4; y++) {
            let rad = mineRuter[y];
            for (let x = 0; x < 4; x++) {
                let f = rad[x];
                if (f !== 0) {
                    let idx = (y + yp) * 12 + x + xp;
                    if (idx >= 0 && idx < 20 * 12) {
                        arr[idx].classList.add(f);
                    }
                }
            }
        }
    }

    kollisjon(xp, yp, brett, r=0) {
        let mineRuter = this.blocks[(this.rotation+r+4) % 4];
        for (let y = 0; y < 4; y++) {
            let rad = mineRuter[y];
            for (let x = 0; x < 4; x++) {
                let f = rad[x];
                if (f !== 0) {
                    let idx = (y + yp) * 12 + x + xp;
                    if (idx >= 0 && idx < 20 * 12) {
                        if (brett[yp+y][xp+x] !== " ") {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    rot(delta) {
        this.rotation = (this.rotation + delta + 4) % 4;
    }


}

/*
let t = new Tetramino("O");
console.log(t.blocks[0]);

t = new Tetramino("L");
console.log(t.blocks[0]);
console.log(t.blocks[1]);
console.log(t.blocks[2]);
console.log(t.blocks[3]);

t = new Tetramino("I");
console.log(t.blocks[0]);

t = new Tetramino("J");
console.log(t.blocks[0]);

t = new Tetramino("L");
console.log(t.blocks[0]);

t = new Tetramino("S");
console.log(t.blocks[0]);

t = new Tetramino("Z");
console.log(t.blocks[0]);

t = new Tetramino("T");
console.log(t.blocks[0]);
//*/