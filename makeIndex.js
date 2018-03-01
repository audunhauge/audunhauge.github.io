// @ts-check


const markdown = require("markdown").markdown;

const fs = require("fs");

function makeIndex(root, title) {
    let files = fs.readdirSync(root);
    let s = [];
    let div = '';
    files.forEach(f => {
        let path = root + "/" + f;
        let stat = fs.statSync(path);
        if (stat.isDirectory()) {
            let dir = f;
            let [html, info] = getHtml(path);
            s.push({ dir, html, info });
        }
    });
    s.forEach(d => {
        if (d.info !== "") {
            div += `<li><div class="info">${d.info}</div>`;
        } else {
            div += `<li><h4>${d.dir}</h4>`;
        }
        div += d.html.map(f => `<a href="${root}/${d.dir}/${f}">${f}</a>`).join('\n')
            + '</li>\n';
    });
    return div;
}


function getHtml(p) {
    let files = fs.readdirSync(p);
    let html = [];
    let info = "";
    files.forEach(f => {
        if (f.endsWith("html")) {
            html.push(f);
        }
        if (f.toLocaleLowerCase() === "readme.md") {
            let md = fs.readFileSync(p + "/" + f, "utf-8");
            info = markdown.toHTML(md);
        }
    });
    return [html, info];
}


let index = `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="github.css">
    <script src="git.js"></script>
</head>

<body>
    <div id="main">
            `;

index += '<div><h3>IT1</h3><ul>' + makeIndex("it1", "IT1") + '</ul></div>';
index += '<div><h3>IT2</h3><ul>' + makeIndex("it2", "IT2") + '</ul></div>';

index += `
    </div>
    <script>
        setup();
    </script>
</body>
</html>
`;

fs.writeFileSync("index.html", index);
console.log("index.html created");
