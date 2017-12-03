class Tile {

    static get tiles() {
        const OCEAN = 0;
        const SEA = 1;
        const GRASS = 2;
        const PLAIN = 3;
        const SWAMP = 4;
        const FOREST = 5;
        const HILL = 6;
        const MOUNTAIN = 7;
        return { OCEAN, SEA, GRASS, PLAIN, SWAMP, FOREST, HILL, MOUNTAIN };
    }
}