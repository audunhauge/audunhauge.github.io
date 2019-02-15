// @ts-check

function setup() {
    let select = document.querySelector("db-select");
    let form = document.querySelector("db-form");
    let homebar = document.querySelector('home-bar');
    if (homebar) {
        homebar.setAttribute("menu",
            `<i class="material-icons">menu</i>
        <ul>
          <li>Kunde
          <li>Vare
          <li>Butikk
          <li>Korg
        </ul>
        `)
        homebar.addEventListener("menu", menuHandler);
    }
    if (select) {
        select.addEventListener("korg", bestilling);
    }

    if (form) {
        form.addEventListener("saved", refresh);
    }

    function refresh() {
        if (select) {
           setTimeout( () => select.getData(), 500);
        }
    }

    function bestilling() {
        location.href = "korg.html";
    }

    function menuHandler(e) {
        let info = homebar.info;
        let text = info.target.innerHTML.trim().toLowerCase();
        if (text) {
            location.href = text + ".html";
        }
    }
}