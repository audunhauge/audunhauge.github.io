// @ts-check

function setup() {
    let divSide1 = document.getElementById("side1");
    let divSide2 = document.getElementById("side2");
    let selBackend = document.getElementById("backend");
    let btnGenerer = document.getElementById("generer");
    let txtSql = document.getElementById("sql");

    btnGenerer.addEventListener("click", genererKode);

    function genererKode() {
        let backend = selBackend.value;
        let sql = txtSql.value;
        let tabeller = sql.split(";");
        // console.log(backend,sql,tabeller);
        divSide1.classList.toggle("hidden");
        divSide2.classList.toggle("hidden");

        tabeller[0]

    }
}