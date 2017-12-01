const UNITNAMES = ("farmer,aspear,bspear,cspear,dspear,asword,bsword,dsword,espear," + "settler,horse,bowhorse,fspear,mace,gspear,hspear,ispear,jspear,spearhorse," + "esword,fsword,gsword,kspear,lspear,hsword,ladder,aram,bram," + "achariot,bchariot,abowchariot,cchariot,dchariot,alongship,bireme,blongship,warship," + "warcanoe,ramship,sling,club,bow,mspear,bbowchariot,ax,nspear").split(",");

const OFFSET = {};

UNITNAMES.forEach((e, i) => OFFSET[e] = { x: i % 9, y: Math.floor(i / 9) });

class Item {

    constructor({ x, y }) {
        this.x = 0;
        this.y = 0;
        this.ix = x;
        this.iy = y;
    }

    render(div) {
        // div.style.backgroundImage = 'url("units.png")';  set in css
        div.style.backgroundPositionX = `-${ this.ix * 100 }px`;
        div.style.backgroundPositionY = `-${ this.iy * 100 }px`;
    }
}

class Movable extends Item {
    constructor() {}
}

class Unit extends Item {

    constructor(name, info) {
        super(OFFSET[name]);
        this.name = name;
        this.info = info;
    }
}