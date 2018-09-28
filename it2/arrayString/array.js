// @ts-check

function $(e) {
    return document.getElementById(e);
}

function setup() {
    let divMain = $("main");

    let a = [];
    let b = new Array(200).fill(0);
    let c = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z".split(",");

    for (let i = 1; i < 1001; i += 1) {
        a.push(Math.random() * 1000);
    }
    a.sort((x, y) => x - y);
    // divMain.innerHTML = a.join(" ");
    let s = "";
    for (let i=0; i < c.length; i++) {
        s += `<div>${c[i]}</div>`;
    }
    divMain.innerHTML = s;
    
}