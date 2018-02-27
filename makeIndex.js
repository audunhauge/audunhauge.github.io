// @ts-check

const markdown = require("markdown").markdown;

const fs = require("fs");
let files = fs.readdirSync("it1");
let s = [];
files.forEach(f => {
  let path = "it1/" + f;
  let stat = fs.statSync(path);
  if (stat.isDirectory()) {
    let dir = f;
    let [html, info] = getHtml(path);
    s.push({ dir, html, info });
  }
});

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
        <div>
            <h3>IT 1</h3>
            <ul>
            `;

s.forEach( d => {
    if (d.info !== "") {
        index += `<li><div class="info">${d.info}</div>`;
    } else {
        index += `<li><h4>${d.dir}</h4>`;
    }
    index += d.html.map( f => `<a href="it1/${d.dir}/${f}">${f}</a>` ).join('\n')
       + '</li>\n';
});

index +=   `</ul>
        </div>
    </div>
    <script>
        setup();
    </script>

</body>

</html>
`;

fs.writeFileSync("index.html", index);
console.log("index.html created");

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
  return [html,info];
}
