// @ts-check

function setup() {
    let select = document.querySelector("db-select");
    let homebar = document.querySelector('home-bar');
    if (homebar) {
        homebar.setAttribute("menu",
        `<i class="material-icons">menu</i>
        <ul>
          <li>Registrer varer
          <li>Bestillinger
        </ul>
        `)
    }
    if (select) {
      select.addEventListener("korg", bestilling);
    }

    function bestilling() {
       location.href = "korg.html";
    }
}