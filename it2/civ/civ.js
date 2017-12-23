

//declare var { OCEAN, SEA, GRASS, PLAIN, SWAMP, FOREST, HILL, MOUNTAIN } = Tile.tiles;


// avoid spurious error on Math.seedrandom


function civ(params) {

    const { OCEAN, SEA, GRASS, PLAIN, SWAMP, FOREST, HILL, MOUNTAIN } = Tile.tiles;

    let divMain = document.getElementById("main");
    let divBoard = document.getElementById("board");
    let cvsMiniMap = document.getElementById("minimap");
    let ctx = cvsMiniMap.getContext("2d");
    let terrain = "ocean,sea,grass,plain,swamp,forest,hill,mountain,desert".split(",");
    let colors = "blue,lightblue,green,yellow,sandybrown,teal,olive,darkgray,orange".split(",");

    const W = params.wi || 150; // antall brikker i bredden
    const H = params.hi || 150; // antall brikker i høyden
    const hexH = 115; // høde bredde på hex-tile
    const hexW = 100;
    const hexD = 115 * 17 / 23; // forskyvning i høyde mellom rader

    let brett;
    let board = [];
    let islands;
    let units = [];
    // fetch uits from firebase

    let buffer = new ArrayBuffer(W * H);
    let fog = new Uint8Array(buffer);

    let wait = false; // ignore commands while animating
    let facing = "right";

    cvsMiniMap.width = W * 4;
    cvsMiniMap.height = H * 4;

    //let astar = new AsyncAstar({});

    let rr = Math.random;

    Math.seedrandom(params.seed);

    [brett, islands] = build(W, H, params.land, params.size, params.radius, params.freq);

    // finner en startposisjon for min spiller
    // dette må endres når vi skifter til multiplayer
    let idx = Math.floor(rr() * islands.length);
    let myland = islands[idx];
    let t;
    let px = myland.x;
    let py = myland.y;
    // bør ha en sperre her så vi ikke kommer i uendelig løkke
    do {
        px = (px + 1) % W;
        t = brett[px + W * py];
    } while (t === MOUNTAIN || t === SEA);

    px = (px + W - 8) % W;
    py = (py + H - 4) % H;

    for (let i = 0; i < 17; i++) {
        board[i] = [];
        for (let j = 0; j < 9; j++) {
            let t = document.createElement('div');
            t.className = "gametile hex";
            t.style.top = -hexD + j * hexD + "px";
            t.style.left = -hexW * 7 + i * hexW + hexW * j / 2 + "px";
            divBoard.appendChild(t);
            board[i][j] = t;
        }
    }

    /*
    // just a test to see if we can render a unit
    units.push({ x: px, y: py, type: "warrior" });
    let u = document.createElement('div');
    u.className = "unit gametile";
    u.style.top = (-hexD + 4 * hexD) + "px";
    u.style.left = (-hexW * 7 + 8 * hexW + hexW * 4 / 2) + "px";
    divMain.appendChild(u);
    */

    units.push(new Unit("settler", { x: px + 8, y: py + 4, type: "explorer", klass: "unit gametile" }));
    units.push(new Unit("farmer1", { x: px + 8 - 1, y: py + 4 + 1, klass: "unit gametile" }));
    units.push(new Unit("horse1", { x: px + 8 - 2, y: py + 4 + 1, type: "horse", klass: "unit gametile" }));

    units.forEach((e, i) => {
        divBoard.appendChild(e.div);
        e.div.dataset.idx = i; // used when clicking on unit - can find index
    });
    let myId = 0;
    let me = units[0];
    let unmoved = units.length;

    // starting game

    nextUnit();

    function render(px, py) {
        liftFog();
        for (let i = 0; i < 17; i++) {
            for (let j = 0; j < 9; j++) {
                let t = board[i][j];
                let tile = brett[(px + i) % W + W * ((py + j) % H)];
                let f = fog[(py + j) * W + (px + i)];
                let foggy = f === 0 ? "fog " : ""; // a = unknown land
                t.className = "gametile hex " + foggy + terrain[tile];
                t.dx = 8 - i; // delta x
                t.dy = 4 - j;
                t.px = (px + i) % W; // the tile knows current x,y
                t.py = (py + j) % H;
            }
        }
        renderUnits();
        minimap();
        drawFrame();
    }

    function liftFog() {
        units.forEach(e => {
            let t = brett[e.y * W + e.x];
            let n = neighbours(e.x, e.y, W, H);
            fog[e.y * W + e.x] = brett[e.y * W + e.x] + 32;
            n.forEach(([x, y]) => fog[y * W + x] = brett[y * W + x] + 32);
            if (t === MOUNTAIN) {
                // can see farther
                // much redundant work done here ...
                n.forEach(([x, y]) => {
                    let m = neighbours(x, y, W, H);
                    m.forEach(([x, y]) => fog[y * W + x] = brett[y * W + x] + 32);
                });
            }
        });
    }

    function renderUnits() {
        units.forEach(e => {
            e.render(px, py);
        });
    }

    function drawFrame() {
        ctx.strokeStyle = "white";
        ctx.strokeRect(((px + 6) * 4 + 4 * (py / 2)) % (W * 4), (py + 1) * 4 % (H * 4), 28, 28);
    }

    function minimap() {
        for (let x = 0; x < W; x++) {
            for (let y = 0; y < H; y++) {
                let f = fog[x + y * W];
                let e = brett[x + y * W];
                let px = (x + Math.floor(y / 2)) % W;
                let py = y;
                let color = colors[e];
                if (f === 0) color = "gray";
                ctx.fillStyle = color;
                ctx.fillRect(px * 4, py * 4, 4, 4);
            }
        }
    }

    function gotoMini(e) {
        if (me) {
            me.div.classList.remove("focus");
            me = null;
        }
        py = (Math.floor(e.offsetY / 4) - 3 + H) % H;
        px = Math.floor(e.offsetX / 4 - py / 2 - 9 + W) % W;
        render(px, py);
    }

    render(px, py);

    document.addEventListener("keydown", command);
    document.addEventListener("contextmenu", goToPos, true);
    document.addEventListener("click", selectItem);
    cvsMiniMap.addEventListener("click", gotoMini);

    document.querySelector("#turn").addEventListener("click", endTurn);

    function endTurn(e) {
        units.forEach(e => {
            e.newTurn();
            e.div.classList.remove("tired");
        });
        if (me) {
            me.div.classList.add("focus");
        }
        unmoved = units.filter(e => !e.waiting).length;
    }

    function nextUnit() {
        let newMe;
        units.forEach(e => {
            e.div.classList.remove("focus");
        });
        let awake = units.filter(e => e.isActive);
        if (awake.length) {
            do {
                myId = (myId + 1) % units.length;
                newMe = units[myId];
            } while (!newMe.isActive);
        } else {
            return;
        }
        newMe.div.classList.add("focus");
        let ox, oy;
        if (me === null) {
            ox = px + 8;
            oy = py + 4;
        } else {
            ox = me.x;
            oy = me.y;
        }
        scrollFromTo(ox, oy, newMe.x, newMe.y, () => {
            me = newMe;
            px = me.x - 8;
            py = me.y - 4;
            render(px, py);
        });
    }

    function command(e) {
        if (e.keyCode === 13) {
            endTurn(null);
            return;
        }
        if (e.keyCode === 9) {
            event.preventDefault();
            nextUnit();
        } else {
            if (me) {
                me.doCommand(e.keyCode, nextUnit);
                // let me. decide to execute next unit
            }
        }
    }

    function scrollFromTo(ax, ay, bx, by, cb) {
        let deltaX = ax - bx;
        let deltaY = ay - by;
        if (Math.abs(deltaX) > W / 2) {
            // shorter going the other way
            deltaX = (deltaX + W) % W;
        }
        if (Math.abs(deltaY) > H / 2) {
            // shorter going the other way
            deltaY = (deltaY + H) % H;
        }
        let dx = hexW * deltaX + 50 * deltaY;
        let dy = hexD * deltaY;
        let dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (dist < 30) {
            let smooth = divBoard.animate([{ left: "0px", top: "0px" }, { left: dx + "px", top: dy + "px" }], {
                duration: Math.min(33 * dist + 80, 800)
            });

            smooth.onfinish = () => {
                cb();
            };
        } else {
            cb();
        }
    }

    function selectItem(e) {
        let t = e.target;
        let tn = t.className;
        if (tn.includes("hex")) {
            if (me !== null) {
                me.div.classList.remove("focus");
            }
            me = null; // no unit selected;
            scrollFromTo(px, py, t.px - 8, t.py - 4, () => {
                px = t.px - 8;
                py = t.py - 4;
                render(px, py);
            });
        } else {
            if (tn.includes("unit")) {
                // clicked on a unit
                myId = t.dataset.idx; // div has idx stored in dataset
                me = units[myId]; // valid idx - me != undefined
                me.div.classList.add("focus");
                me.sleeping = false;
                me.done = this.moves === 0;
                scrollFromTo(px + 8, py + 4, me.x, me.y, () => {
                    if (me) {
                        // flowtype thinks me can be null - I disagree
                        px = me.x - 8;
                        py = me.y - 4;
                        render(px, py);
                    }
                });
            }
        }
    }

    function goToPos(e) {
        let t = e.target;
        let tn = t.className;
        if (tn.includes("gametile")) {
            event.preventDefault();
            if (wait) return; // ignore while in animation
            if (tn.includes("hex") && me !== null) {
                // clicked on a tile
                // console.log(t.px, t.py);
                let tx = t.dx;
                let ty = t.dy;
                let deltaX = Math.sign(tx);
                let deltaY = Math.sign(ty);
                if (deltaX * deltaY === 1) {
                    // same sign not allowed
                    deltaY = 0;
                }
                // check if we can move to new tile
                let nx = (px + 8 - deltaX + W) % W;
                let ny = (py + 4 - deltaY + H) % H;
                let tt = brett[nx + ny * W];
                if (me.canMove(tt)) {
                    me.moveMe(tt); // apply cost
                    wait = true;
                    me.facing(deltaX, deltaY);
                    px = (px - deltaX + W) % W;
                    py = (py - deltaY + H) % H;
                    let dx = hexW * deltaX + 50 * deltaY;
                    let dy = hexD * deltaY;
                    me.div.classList.remove("focus");
                    divBoard.removeChild(me.div);
                    divMain.appendChild(me.div);
                    let smooth = divBoard.animate([{ left: "0px", top: "0px" }, { left: dx + "px", top: dy + "px" }], {
                        duration: 280
                    });

                    smooth.onfinish = () => {
                        if (me) {
                            divMain.removeChild(me.div);
                            divBoard.appendChild(me.div);
                            me.div.classList.add("focus");
                            me.x = px + 8;
                            me.y = py + 4;
                            render(px, py);
                            wait = false;
                            if (me.done) {
                                unmoved--;
                                me.div.classList.add("tired");
                                if (unmoved > 0) {
                                    nextUnit();
                                } else {
                                    me.div.classList.remove("focus");
                                }
                            }
                        }
                    };
                }
            }
        }
    }
} // flow is unsure about document eventlistener