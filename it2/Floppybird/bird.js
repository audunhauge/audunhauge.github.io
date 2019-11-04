// @ts-check

function setup() {
    let divFuggel = document.getElementById("fuggel");
    addEventListener("keydown", fuggelFlyr);

    let fuggel = { x:250, y: 210, v:0};

    setInterval(flyttFuggel,50);

    function flyttFuggel() {
        fuggel.y += fuggel.v;
        fuggel.v += 1;
        visFuggel();
    }

    function fuggelFlyr() {
        fuggel.v -= 5;
        visFuggel();
    }

    function visFuggel() {
        divFuggel.style.top = fuggel.y + "px";
        divFuggel.style.left = fuggel.x + "px";
    }
}