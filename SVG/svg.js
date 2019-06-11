// @ts-check

const $i = e => document.getElementById(e);
const $q = e => document.querySelector(e);
const $$ = e => document.querySelectorAll(e);
const new$ = e => document.createElement(e);

function setup() {
  let divMain = $i("main");
  let divSVG = document.createElement("div");
  //let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  divMain.appendChild(divSVG);
  //svg.setAttribute("viewBox", "0 0 500 500");
  let b = trig({ a: 3, b: 4, c: 5, ABC: "A,B,C", abc: "$,$,x" });
  b.color = "red";
  // svg.innerHTML += svgBuilder(b);

  let end;

  divSVG.addEventListener("click", () => {
    if (end) {
      clearInterval(end);
      end = null;
    } else {
      end = setInterval(animate, 20);
    }
  });

  let pp = new Point(b.points.p2).add(new Point(2, 0));

  let i = 1;
  end = setInterval(animate, 20);
  function animate() {
    i += 1;
    test(i);
    if (i > 8720) clearInterval(end);
  }

  function test(i) {
    let x = Math.cos((i * Math.PI) / 360);
    let y = Math.sin((i * Math.PI) / 360);
    let pp = new Point(5, 5);
    let qq = pp.add(new Point(x, y));

    let c = tri({
      a: 2.981,
      b: 4.221,
      c: 3.789,
      p: pp,
      q: qq,
      color: "green",
      vert:"abc",
      ABC: "A,B,C",
      abc: "1112342341111,22223222222,33333333"
    });
    divSVG.innerHTML = svgBuilder(c);
  }
}

function svgBuilder(p) {
  let s = '<svg viewBox="0 0  500 500">';
  if (p.valid) {
    if (p.polygon) {
      s += `<polygon points="${p.polygon}" stroke="${p.color ||
        "blue"}" fill="none" />`;
    }
    if (p.ABC) {
      s += p.ABC.map(e => `<text x="${e.x}" y="${e.y}">${e.txt}</text>`).join('');
    }
    if (p.abc) {
      s += p.abc.map(
        e =>
          `<text x="${e.x}" y="${e.y}" text-anchor="${e.anchor}">${
            e.txt
          }</text>`
      ).join('');
    }
    if (p.vert) {
      s += p.vert.map(e => 
        `<circle cx="${e.x}" cy="${e.y}" r="3" fill="${p.color || "red"}" />`
        ).join('');
    }
  }
  return s + "</svg>";
}

const SIN = x => Math.sin((Math.PI * x) / 180);
const COS = x => Math.cos((Math.PI * x) / 180);
const ASIN = x => (180 * Math.asin(x)) / Math.PI;

let tri = param => {
  let { a = 0, b = 0, c = 0, A = 0, B = 0, C = 0 } = param;
  let sides = [a, b, c].filter(e => e !== 0);
  let angles = [A, B, C].filter(e => e > 0);
  if (sides.length === 3) {
    // three sides is sufficient - ignore any angles
    //return qz.triangle(p,q,a,b,c,"","","",0);
    let sorted = [a, b, c].map(e => Math.abs(e)).sort((x, y) => x - y);
    let [u, v, w] = sorted;
    if (w > u + v) return { valid: false }; // can't construct
    return trig(param);
  }
  if (angles.length === 2) {
    // calculate missing angle
    let third = 180 - (A + B + C);
    A = A || third;
    B = B || third;
    C = C || third;
    angles = [A, B, C];
  }
  if (angles.length === 3 && sides.length > 0) {
    // three angles and a side is sufficient
    let sum = A + B + C;
    if (Math.abs(sum - 180) > 100 * Number.EPSILON) return { valid: false }; // AngleSum must be 180
    // calculate missing sides if any
    let sinus = [a, b, c]
      .map((e, i) => e / SIN(angles[i]))
      .filter(e => e !== 0)
      .pop();
    sides = [a, b, c].map((e, i) => (e ? e : sinus * SIN(angles[i])));
    param.a = sides[0];
    param.b = sides[1];
    param.c = sides[2];
    return trig(param);
  }
  if (angles.length === 1 && sides.length === 2) {
    // all good if angle between sides
    let goodSides = [a, b, c].map(e => e !== 0); // [true,true,false] variant of
    let goodAngles = [A, B, C].map(e => e !== 0); // [true,false,false] variant of
    // they should disagree on all points
    let good = goodSides.reduce((s, v, i) => s && v !== goodAngles[i], true); // true if sides=[1,1,0] and angles = [0,0,1]
    if (good) {
      let angle = A + B + C; // as two are zero
      let [u, v] = sides; // the two given sides
      let aa = Math.sqrt(u * u + v * v - 2 * u * v * COS(angle));
      sides = [a, b, c].map(e => (e ? e : aa)); // one is zero - replace with calculated value
      param.a = sides[0];
      param.b = sides[1];
      param.c = sides[2];
      return trig(param);
    }
    // check if angle is opposite longest of two sides
    let angSide = [[a, A], [b, B], [c, C]].sort((x, y) => y[0] - x[0]);
    if (angSide[0][1] !== 0) {
      // two sides and angle opposite longest side
      // find missing side
      angles = [A, B, C];
      sides = [a, b, c];
      let idx = angles.map((e, i) => i).filter(i => angles[i])[0]; // idx of angle != 0
      let sinus = sides[idx] / SIN(angles[idx]);
      let sunis = SIN(angles[idx]) / sides[idx]; // reciproc
      angles = [A, B, C].map((e, i) => (e ? e : ASIN(sunis * sides[i]))); // found one more angle
      let missing = 180 - angles.reduce((s, v) => s + v, 0);
      angles = angles.map(e => (e ? e : missing));
      sides = [a, b, c].map((e, i) => (e ? e : sinus * SIN(angles[i]))); // now all sides
      param.a = sides[0];
      param.b = sides[1];
      param.c = sides[2];
      return trig(param);
    }
  }
  return { valid: false };
};

function trig(param) {
  let {
    a = 0,
    b = 0,
    c = 0,
    A = 0,
    B = 0,
    C = 0,
    abc = "",
    ABC = "",
    vABC = "",
    vert = "",
    p = { x: 1, y: 1 },
    q,
    size = { w: 500, h: 500, sx: 10, sy: 10 }
  } = param;
  let V = new Point(1, 0); // unit vector along x-axis
  let ret = { valid: true }; // return value
  p = new Point(p.x, p.y);
  let p0 = new Point(p.x, p.y);
  let p1 = new Point(p.x, p.y);
  let p2 = new Point(p.x, p.y);
  let v = new Point(1, 0); // use point as vector
  if (q != null) {
    // need to create unit vector (p,q)
    v = new Point(q.x - p.x, q.y - p.y).unit();
  }
  let n = v.norm(); // normal vector for v
  p1 = p1.add(v.mult(a));
  let rx = (a * a + b * b - c * c) / (2 * a);
  p2 = p2.add(v.mult(a - rx));
  let ry = Math.sqrt(b * b - rx * rx);
  p2 = p2.add(n.mult(ry));
  ret.polygon = [p0, p1, p2].map(e => fx(e.x) + "," + fy(e.y)).join(" ");
  ret.points = { p0, p1, p2 };
  ret.scaled = [p0, p1, p2].map(e => [fx(e.x), fy(e.y)]); // scaled points
  let ab = p1.sub(p0);
  let bc = p2.sub(p1);
  let ca = p0.sub(p2);
  a = Math.abs(a);
  b = Math.abs(b);
  c = Math.abs(c);
  ret.area =
    Math.sqrt((a + b + c) * (a + b - c) * (a + c - b) * (b + c - a)) / 4;
  let s = (a + b + c) / 2;
  let r = ret.area / s;
  let e = (b + a - c) / 2;
  let t = new Point(p1.x - e * v.x, p1.y - e * v.y); // tangent for incircle on segment-a
  let CO = new Point(t.x + n.x * r, t.y + n.y * r); // center of incircle
  let pb, pa, dd; // dd is delta to adjust for text being placed by lower left corner
  let Ca = CO.sub(p0).unit(); // vectors towards triangle center
  let Cb = CO.sub(p1).unit();
  let Cc = CO.sub(p2).unit();
  let Px,
    ptxt = {};
  let adj = new Point(1, 1).unit();
  let jad = new Point(-1, -1).unit(); // opposite of adj
  if (param.color) {
    ret.color = param.color;
  }
  if (ABC) {
    // supplied text for corner points
    // text pushed away from triangle center
    ret.ABC = [];
    Px = ABC.split(",");
    dd = Math.max(0.3, 0.5 * Ca.dot(adj));
    pa = p0.sub(Ca.mult(dd));
    ret.ABC.push({ x: fx(pa.x), y: fy(pa.y), txt: Px[0] });
    dd = Math.max(0.3, 0.5 * Cb.dot(adj));
    pa = p1.sub(Cb.mult(dd));
    ret.ABC.push({ x: fx(pa.x), y: fy(pa.y), txt: Px[1] });
    dd = Math.max(0.3, 0.5 * Cc.dot(adj));
    pa = p2.sub(Cc.mult(dd));
    ret.ABC.push({ x: fx(pa.x), y: fy(pa.y), txt: Px[2] });
  }

  if (vert) {
    // vert = "abc" flag for placing point on vertice
    ret.vert = [];
    if (vert.includes("a")) {
      ret.vert.push({ x:fx(p0.x), y:fy(p0.y) }) ;
    }
    if (vert.includes("b")) {
      ret.vert.push({ x:fx(p1.x), y:fy(p1.y) }) ;
    }
    if (vert.includes("c")) {
      ret.vert.push({ x:fx(p2.x), y:fy(p2.y) }) ;
    }
  }

  if (abc) {
    ret.abc = [];
    let sides = [a, b, c];
   
    // place side text using text - not textpath - needed if printing
    let Sx = abc.split(",").map((e, i) => (e === "$" ? nice(sides[i]) : e));
    ret.abc.push(sideText(ab,Cc,p1,Sx[0],a));
    ret.abc.push(sideText(bc,Ca,p2,Sx[1],b));
    ret.abc.push(sideText(ca,Cb,p0,Sx[2],c));
   
    function sideText(vec1, vec2, pnt, txt, side) {
      let dot; // (1,0) dot Side
      let anchor; // start|middle|end
      dot = vec1
        .unit()
        .norm()
        .dot(V); // ~ 0 means nearly horizontal
      anchor = dot < 0 ? "start" : "end";
      anchor = Math.abs(dot) < 0.1 ? "middle" : anchor;
      dd = Math.max(0.3, 0.5 * vec2.dot(jad));
      pa = pnt.sub(vec1.unit().mult(side / 2)).add(vec2.mult(dd));
      return { x: fx(pa.x), y: fy(pa.y), txt: txt, anchor };
    }
  }
  return ret;

  function fx(x) {
    let wx = (size.w * x) / size.sx;
    // clean up for use as coordinates
    return nice(wx);
  }

  function fy(y) {
    let hy = size.h - (size.h * y) / size.sy;
    // clean up for use as coordinates
    return nice(hy);
  }

  function nice(x) {
    if (x % 1 === 0) return String(x);
    return x.toFixed(2);
  }
}

class Point {
  x;
  y;
  constructor(x, y) {
    if (typeof x === "object") {
      this.x = x.x;
      this.y = x.y;
    } else {
      this.x = x;
      this.y = y;
    }
  }
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  add(v) {
    if (v instanceof Point) {
      return new Point(this.x + v.x, this.y + v.y);
    } else {
      return new Point(this.x + v, this.y + v);
    }
  }
  sub(v) {
    if (v instanceof Point) {
      return new Point(this.x - v.x, this.y - v.y);
    } else {
      return new Point(this.x - v, this.y - v);
    }
  }
  dot(v) {
    return this.x * v.x + this.y * v.y;
  }
  mult(v) {
    if (v instanceof Point) {
      return new Point(this.x * v.x, this.y * v.y);
    } else {
      return new Point(this.x * v, this.y * v);
    }
  }
  div(v) {
    if (v instanceof Point) {
      return new Point(this.x / v.x, this.y / v.y);
    } else {
      return new Point(this.x / v, this.y / v);
    }
  }
  unit() {
    return this.div(this.length());
  }
  norm() {
    return new Point(-this.y, this.x);
  }
}
