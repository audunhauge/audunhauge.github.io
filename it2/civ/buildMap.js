

const SEA = 0;
const GRASS = 1;
const SWAMP = 2;
const FOREST = 3;
const HILL = 4;
const MOUNTAIN = 5;

/**
 * lager et kart for civ
 * prøver å lage øyer med hav rundt
 * @param {array} theMap 
 * @param {int} w 
 * @param {int} h 
 */
function build(w, h) {
    // fill map with ocean/sea
    let theMap = Array(w).fill(0);
    theMap = theMap.map(e => Array(h).fill(0));

    // generate random number of islands
    // x,y is pos, r is radius
    let islandCount = roll(3, 12);
    let islands = Array(islandCount).fill(0);
    let maxR = Math.min(w, h) / 2;
    islands = islands.map((e) => ({ x: roll(1, w - 1), y: roll(1, h - 1), r: roll(2, maxR) }));

    // place initial mountain at island seed
    islands.forEach(e => { theMap[e.x][e.y] = MOUNTAIN })

    // stand on each island and throw stones
    islands.forEach(e => {
        let iter = Math.min(90, e.r * e.r);
        for (let i = 0; i < iter; i++) {
            let p = throwStone(e);
            let x = p.x % w;
            let y = p.y % h;
            if (!theMap[x]) {
                console.log(x, y);
            }
            if (theMap[x][y] === SEA) {
                // close to island === mountain
                // far away === grass
                let t = 2 + Math.floor(Math.random() * 10 * (1 - p.r / e.r));
                theMap[x][y] = Math.min(MOUNTAIN, t);
            }
        }
    });
    return theMap;
}

/**
 * Random number [lo,hi]
 * @param {int} lo 
 * @param {int} hi 
 */
function roll(lo, hi) {
    let diff = 1 + hi - lo;
    return Math.floor(Math.random() * diff) + lo;
}


/**
 * We stand on an island and throw a stone in random direction
 * The landing is within the island radius
 * @param {Object} island 
 */
function throwStone(island) {
    let r = island.r;
    let R = r * r;
    let x, y;
    do {
        x = roll(-r, r);
        y = roll(-r, r);
    } while (x * x + y * y > R);
    return { x: island.x + x, y: island.y + y, r: Math.sqrt(x * x + y * y) }
}