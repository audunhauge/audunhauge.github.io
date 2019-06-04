// @ts-check


const $i = (e) => document.getElementById(e);
const $q = (e) => document.querySelector(e);
const $$ = (e) => document.querySelectorAll(e);
const new$ = (e) => document.createElement(e);

function setup() {
  let divMain = $i("main");
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  divMain.appendChild(svg);
  svg.setAttribute("viewBox", "0 0 500 500");
  svg.innerHTML = `
    <polygon 
    points="10,400 400,400 200,10 10,400"
    fill="none" stroke="blue" />
    <polygon 
    points="30,420 420,420 220,30 30,420"
    fill="none" stroke="blue" />
    <text x="20" y="35" class="small">My</text>  
    `;
  let b = trig({ a:3, b:4,  c:5  });
  if (b.valid) { 
    svg.innerHTML += `<polygon points="${b.polygon}" stroke="green" fill="none" />`;
  }
  
  let c = trig({ a:3, b:4,  c:5 , p:b.points.p1, q:b.points.p2 });
  if (c.valid) { 
    svg.innerHTML += `<polygon points="${c.polygon}" stroke="red" fill="none" />`;
  }
}

let tri = (param) => {
  let { a = 0, b = 0, c = 0, A = 0, B = 0, C = 0, abc, ABC, vABC, p, q } = param;
  let sides = [a, b, c].filter(e => e > 0);
  let angles = [A, B, C].filter(e => e > 0);
  if (sides.length === 3) {
    // three sides is sufficient - ignore any angles
    //return qz.triangle(p,q,a,b,c,"","","",0);
    let sorted = [a, b, c].sort((x, y) => x - y);
    let [u, v, w] = sorted;
    if (w > u + v) return false;  // can't construct
    return true;
  }
  if (angles.length === 2) {
    // calculate missing side
    let third = 180 - angles.reduce((s, v) => s + v, 0);
    A = A || third;
    B = B || third;
    C = C || third;
    angles = [A, B, C];
  }
  if (angles.length === 3 && sides.length > 0) {
    // three angles and a side is sufficient
    let sum = A + B + C;
    if (Math.abs(sum - 180) > Number.EPSILON) return false;  // AngleSum must be 180
    return true;
    //return qz.triangle(p,q,a,b,c,"","","",0);
  }
  if (angles.length === 1 && sides.length === 2) {
    // all good if angle between sides
    let sides = [a, b, c].map(e => e !== 0);  // [true,true,false] variant of
    let angles = [A, B, C].map(e => e !== 0); // [true,false,false] variant of
    // they should disagree on all points
    let good = sides.reduce((s, v, i) => s && (v !== angles[i]), true);  // true if sides=[1,1,0] and angles = [0,0,1]
    if (good) {
      // qz.tri ...
      return true;
    }
    // check if angle is opposite longest of two sides
    let angSide = [[a, A], [b, B], [c, C]].sort((x, y) => y[0] - x[0]);
    if (angSide[0][1] !== 0) {
      // two sides and angle opposite longest side
      return true;
    }
  }
  return false;
}

function trig(param) {
  if (!tri(param)) return { valid: false };
  let { a = 0, b = 0, c = 0, A = 0, B = 0, C = 0,
    abc, ABC, vABC, p = { x: 1, y: 1 }, q, size={w:500,h:500, sx:10, sy:10} } = param;
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
  let polygon = [p0,p1,p2].map(e => fx(e.x) + "," + fy(e.y)).join(" ");
  return { valid: true, polygon, points:{p0,p1,p2} };


  function fx(x) {
    let wx = size.w*x/size.sx;
    // clean up for use as coordinates
    if (wx % 1 === 0) return String(wx);
    return wx.toFixed(2);
  }

  function fy(y) {
    let hy = size.h - size.h*y/size.sy;
    // clean up for use as coordinates
    if (hy % 1 === 0) return String(hy);
    return hy.toFixed(2);
  }
}




class Point {
  x;
  y;
  constructor(x, y) {
    this.x = x;
    this.y = y;
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