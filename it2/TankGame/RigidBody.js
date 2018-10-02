class RigidBody {
    constructor(x, y, w, h, r) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.v = 0;
        this.rot = r;
        this.is = 'RigidBody';
    }


    /**
    * if obj a,b overlap return true
    * RigidBody{x,y,w,h}
    * @param {RigidBody} a
    * @param {RigidBody} b
    * @returns {boolean} true if overlap
    */
    overlap(b) {
        let a = this;
        return (a.x > b.x - a.w &&
            a.x < b.x + b.w &&
            a.y > b.y - a.h &&
            a.y < b.y + b.h
        );
    }

    move(delta) {
        this.y += delta * Math.sin(Math.PI * this.rot / 180);
        this.x += delta * Math.cos(Math.PI * this.rot / 180);
    }
}