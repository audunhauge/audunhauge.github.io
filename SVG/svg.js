// @ts-check


const $i = (e) => document.getElementById(e);
const $q = (e) => document.querySelector(e);
const $$ = (e) => document.querySelectorAll(e);
const new$ = (e) => document.createElement(e);

function setup() {
    let divMain = $i("main");
    let svg = new$('svg');
    divMain.appendChild(svg);

}