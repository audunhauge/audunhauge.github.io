// @ts-check


const $i = (e) => document.getElementById(e);
const $q = (e) => document.querySelector(e);
const $$ = (e) => document.querySelectorAll(e);
const new$ = (e) => document.createElement(e);

function setup() {
    let divMain = $i("main");
    let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    divMain.appendChild(svg);
    svg.setAttribute("viewBox","0 0 500 500");
    svg.innerHTML = `
    <polygon 
    points="10,400 400,400 200,10 10,400"
    fill="none" stroke="blue" />
    <polygon 
    points="30,420 420,420 220,30 30,420"
    fill="none" stroke="blue" />
    <text x="20" y="35" class="small">My</text>  
    `;
}

let tri = (param) => {
    let { a=0, b=0, c=0, A=0, B=0, C=0, abc, ABC, vABC, p, q } = param;
    let sides = [a, b, c].filter(e => e > 0);
    let angles = [A, B, C].filter(e => e > 0);
    if (sides.length === 3) {
      // three sides is sufficient - ignore any angles
      //return qz.triangle(p,q,a,b,c,"","","",0);
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
      return true;
      //return qz.triangle(p,q,a,b,c,"","","",0);
    }
    if (angles.length === 1 && sides.length === 2) {
      // all good if angle between sides
      let sides = [a,b,c].map(e => e !== 0);  // [true,true,false] variant of
      let angles = [A,B,C].map(e => e !== 0); // [true,false,false] variant of
      // they should disagree on all points
      let good = sides.reduce( (s,v,i) => s && (v !== angles[i]), true );  // true if sides=[1,1,0] and angles = [0,0,1]
      if (good) {
        // qz.tri ...
        return true;
      }
      // check if angle is opposite longest of two sides
      let angSide = [ [a,A],[b,B],[c,C]].sort((x,y)=> y[0] - x[0]);
      if (angSide[0][1] !== 0) {
        // two sides and angle opposite longest side
        return true;
      }
    }
  }