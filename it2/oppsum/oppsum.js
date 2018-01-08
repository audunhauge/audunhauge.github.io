// @ts-check

function setup() {
   let divPeter = document.getElementById("peter");
   let divEx = document.getElementById("ex");
   let divStorPeter = document.getElementById("storpeter");

    divPeter.addEventListener("click", visStorPeter);

    divStorPeter.addEventListener("click", visLillePeter);

    function visStorPeter(e) {
        // @ts-ignore
       divEx.style.display = "none";
       divStorPeter.style.display = "block";
    }

    function visLillePeter(e) {
        // @ts-ignore
       divEx.style.display = "flex";
       divStorPeter.style.display = "none";
    }
    
}