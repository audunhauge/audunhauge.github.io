// @ts-check

function setup() {
    let divSamling = document.getElementById("samling");
    let divBygning = document.getElementById("bygning");
    let divNewyork = document.getElementById("newyork");
    let divRoma = document.getElementById("roma");
    let divPetersburg = document.getElementById("petersburg");
    divNewyork.addEventListener("click", visQuiz);
    divBygning.addEventListener("click", visStartside);
    divRoma.addEventListener("click", visRoma);
    divPetersburg.addEventListener("click", visPetersburg);

    function visQuiz() {
        document.getElementById("quiz").style.display = "block";
        divSamling.style.display = "none";
    }

    function visStartside() {
        divSamling.style.display = "grid";
        document.getElementById("quiz").style.display = "none";
    }
}