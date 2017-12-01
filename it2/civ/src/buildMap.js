

const OCEAN = 0;
const SEA = 1;
const GRASS = 2;
const PLAIN = 3;
const SWAMP = 4;
const FOREST = 5;
const HILL = 6;
const MOUNTAIN = 7;



/**
 * lager et kart for civ
 * prøver å lage øyer med hav rundt
 * @param {array} theMap 
 * @param {int} w 
 * @param {int} h 
 */
function build(w, h, _LAND = 4, _MINIMUM = 1, _RADIUS = 12, _FREQ = "776655443") {
    // fill map with ocean
    let theMap = Array(w).fill(0);
    theMap = theMap.map(e => Array(h).fill(0));

    // generate random number of islands
    // x,y is pos, r is radius
    const RADIUS = _RADIUS;
    const LAND = _LAND;   //  1 = small islands  50 = large islands
    const MINIMUM = _MINIMUM;  // 1 = few islands 10 = many islands
    const FREQ = _FREQ;  // we pick from this list to choose terrain
    let size = w * w * h * h;
    let logSize = Math.floor(Math.log(size));
    let islandCount = MINIMUM + roll(Math.floor(logSize / 3 + 1), logSize + 1);
    let islands = Array(islandCount).fill(0);
    let maxR = RADIUS + roll(3,9);
    let minR = Math.max(1,RADIUS - roll(3,9));
    // space the islands
    let m = Math.floor((w + h) / 2);
    let sqr = 3 + Math.floor(m / (Math.sqrt(islandCount)));
    let dx = -Math.floor(sqr / 1.7);
    let dy = Math.floor(sqr / 2.2);

    islands = islands.map((e) => {
        dx += sqr;
        if (dx > w) {
            dx = sqr;
            dy += sqr;
            if (dy > h) {
                dy = h - Math.floor(sqr / 2);
            }
        }
        return { x: dx + roll(1, 5), y: dy + roll(1, 5), r: roll(minR, maxR) }
    });

    // remove islands of the map
    islands = islands.filter(e => e.x < w && e.y < h);

    // place initial mountain at island seed
    islands.forEach(e => { theMap[e.x][e.y] = MOUNTAIN })

    // stand on each island and throw stones
    islands.forEach(e => {
        let iter = Math.min(LAND * logSize, e.r * e.r);
        for (let i = 0; i < iter; i++) {
            let p = throwStone(e);
            let x = (p.x + w) % w;
            let y = (p.y + h) % h;
            if (!theMap[x]) {
                console.log(x, y);
            }
            if (theMap[x][y] === OCEAN) {
                // close to island === mountain
                // far away === grass
                let pos = Math.random() * FREQ.length;
                let t = +FREQ.charAt(pos);
                //let t = 3 + Math.floor(Math.random() * 9 * (1 - p.r / e.r));
                theMap[x][y] = Math.min(MOUNTAIN, t);
            }
        }
    });


    // create land around high ground (mountain -> hills -> forrest -> swamp -> grass)
    theMap.forEach((e, x) => e.forEach((e, y) => {
        if (e === OCEAN) {
            // check in 6 directions
            let adjacent = getNeighbours(x, y);
            let m = Math.max(...adjacent);
            if (adjacent.length > 1 && m > GRASS) {
                theMap[x][y] = m - 1; // roll(1, m - 1);
            }
        }
    }))


    if (islandCount < 12 && logSize > 8) {
        // do it twice to grow some more land
        // create land around high ground (mountain -> hills -> forrest -> swamp -> grass)
        theMap.forEach((e, x) => e.forEach((e, y) => {
            if (e === OCEAN) {
                // check in 6 directions
                let m = Math.max(...getNeighbours(x, y));
                if (m > GRASS) {
                    theMap[x][y] = m - roll(1, m - 1);
                }
            }
        }))
    }
    
    // add sea tiles around land
    theMap.forEach((e, x) => e.forEach((e, y) => {
        if (e === OCEAN) {
            // check in 6 directions
            let adjacent = getNeighbours(x, y);
            let m = Math.max(...adjacent);
            if (m > SEA) {
                theMap[x][y] = SEA;
            }
        }
    }))


    function getNeighbours(x, y) {
        n = [];
        n.push(theMap[(x + w - 1) % w][y]);
        n.push(theMap[(x + 1) % w][y]);
        n.push(theMap[x][(y + 1) % h]);
        n.push(theMap[x][(y + h - 1) % h]);
        n.push(theMap[(x + w - 1) % w][(y + 1) % h]);
        n.push(theMap[(x + 1) % w][(y + h - 1) % h]);
        return n.filter(e => e > 0);
    }




    return [theMap, islands];
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