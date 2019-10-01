// @ts-check

function setup() {
    let skisse = document.getElementById("skisse");
    skisse.addEventListener("click", showme);

    function showme(e) {
        let u = e.target;
        if (u.dataset && u.dataset.more) {
            location.href = u.dataset.more + ".html";
        }

    }

}