// @ts-check
const css = `
form {
    margin-top: 1.2cm;
    position: relative;
    width: 25em;
    max-width: 85%;
    padding: 5px;
    border-radius: 5px;
    border: solid gray 1px;
    background-color: gainsboro;
}

form > label {
    display: grid;
    grid-template-columns: 7fr 2fr;
    margin: 5px;
    padding: 5px;
    border-radius: 5px;
    border: solid gray 1px;
    background-color: whitesmoke;
}

form::after {
    color:blue;
    content: attr(data-info);
    position: absolute;
    right: 20px;
    top: -20px;
}

#main {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
}

#main > div {
    position: relative;
    background-color: whitesmoke;
    border: solid teal 1px;
    border-left: solid teal 10px;
    border-radius: 5px;
    width: 12em;
    height: 16em;
    padding: 5px;
    box-shadow: 5px 4px 6px gray;
    margin: 1em;
}

#main > div.romaner {
    background-color: lightcoral;
}

#main > div.historie {
    background-color: blue;
}


#main > div::after {
  z-index: -1;
  content: "";
  display: block;
  position: absolute;
  left: 3px;
  top: 3px;
  border: solid teal 1px;
  border-left: solid teal 5px;
  border-radius: 5px;
  width: 12em;
  height: 16em;
  padding: 5px;
}
#main > div h4 {
    text-align: center;
    color: blue;
}

#main > div > div {
    display: grid;
    grid-template-columns: 1fr 1fr;
}

#antall {
    position: absolute;
    top: 30px;
    left: 16em;
    width: 5em;
    height: 2em;
}
`;

const html1 = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Bibliotek</title>
    <link rel="stylesheet" href="bib.css">
    <script src="bib.js"></script>
</head>

<body>
    <header>
        <h1>
            Registrer 
        </h1>
        <div id="antall"></div>
        <p>
            <a href="bokliste.html">Vis boklister</a>
        </p>
    </header>
`.replace(/</g, "&lt;");

const html2 = `
<script>
setup();
</script>
</body>
</html>
`.replace(/</g, "&lt;");

function setup() {
    let divSide1 = document.getElementById("side1");
    let divSide2 = document.getElementById("side2");
    let divSide3 = document.getElementById("side3");
    let selBackend = document.getElementById("backend");
    let selTabell = document.getElementById("tabell");
    let btnGenerer = document.getElementById("generer");
    let txtSql = document.getElementById("sql");
    let divRamme = document.getElementById("ramme");
    let divDB = document.getElementById("db");
    let divHTML = document.getElementById("html");
    let divCSS = document.getElementById("css");
    let divJs = document.getElementById("js");
    let divPsql = document.getElementById("postgres");

    let sql, s, td, tabell;

    selTabell.addEventListener("change", genererKode);
    btnGenerer.addEventListener("click", velgTabell);
    divRamme.addEventListener("click", visRamme);

    function velgTabell() {
        divSide1.classList.toggle("hidden");
        divSide2.classList.toggle("hidden");
        // @ts-ignore
        sql = txtSql.value;
        let rr = sql2class(sql);
        s = rr.s; td = rr.td;
        selTabell.innerHTML = Object.keys(td).map(t => `<option>${t}</option>`).join("");
    }

    function visRamme(e) {
        if (e.target.classList.contains("faner")) {
            Array.from(document.querySelectorAll(".faner")).forEach(e => e.classList.remove("active"));
            Array.from(document.querySelectorAll(".kode")).forEach(e => e.classList.add("hidden"));
            e.target.classList.add("active");
            let kodeID = e.target.dataset.t;
            document.getElementById(kodeID).classList.remove("hidden");
        }
    }

    function genererKode() {
        // @ts-ignore
        let backend = selBackend.value;
        // @ts-ignore
        tabell = selTabell.value;
        document.querySelector(".faner[data-t=html]").innerHTML = tabell + ".html";
        document.querySelector(".faner[data-t=js]").innerHTML = tabell + ".js";

        // console.log(backend,sql,tabeller);
        // divSide2.classList.toggle("hidden");
        divSide3.classList.remove("hidden");

        divDB.innerHTML = "<p>" + s.join("</p><p>") + "</p>";
        divHTML.innerHTML = "<pre>" + html1 + makeForm(tabell, td[tabell]) + html2 + "</pre>";
        divCSS.innerHTML = "<pre>" + css + "</pre>";
        divJs.innerHTML = "<pre>" + makeCode(tabell, td[tabell]) + "</pre>";
        divPsql.innerHTML = "<pre>" + sql2postgres(sql) + "</pre>";


    }
}