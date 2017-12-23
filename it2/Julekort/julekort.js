// @flow

function setup() {
    let divSanta = document.querySelector("#santa");
    let divSky = document.querySelector("#sky");
    divSanta.addEventListener("click", bombsAway);

    function bombsAway(e) {
       let dx = e.clientX;
       let p = document.createElement('div');
       p.className = "pakke"; 
       divSky.appendChild(p);
       p.animate(
        [
          { top : "100px", left:dx+"px" },
          { top : "90vh", left:dx+"px" }
        ], {fill:"forwards", duration:3000});
    }
}