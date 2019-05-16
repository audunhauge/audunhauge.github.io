// @ts-check

function setup() {
    let divBrett = document.getElementById("brett");
    divBrett.addEventListener("click", snuKort);

    function snuKort(event) {
        let target = event.target;
        if (target.classList.contains("kort")) {
            target.classList.toggle("bakside");
        }
    }
}