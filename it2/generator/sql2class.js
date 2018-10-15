// @ts-check




function n2e(w) {
  return w.replace(/ø/g, 'o').replace(/æ/g, 'e').replace(/å/g, 'a');
}

/**
 * Convert sql to javascript classes
 * @param {String} sql table definitions from sql
 * @return {Object} class definitions and table-objects
 */
function sql2class(sql) {
  let tables = sql.split(';');
  let s = [], td = {};
  tables.forEach(t => {
    t = t.trim();
    let p = t.indexOf("(");
    let x = t.substr(0, p);
    let xs = t.substr(p + 1);
    if (x.startsWith("CREATE TABLE")) {
      let tname = n2e(x.substr(12).trim());
      let r = xs.split(",")
        .map(e => n2e(e.trim()))
        .filter(e => !e.startsWith("PRIMARY") && !e.startsWith("FOREIGN") && !e.startsWith("UNIQUE"))
        .map(e => e.split(" ")
          .slice(0, 2));
      td[tname] = r;
      let nonKeys = r.filter(e => e[0] !== tname + "ID");
      let rows = nonKeys.map(e => `this.${e[0]} = ${e[0]}`);
      let params = nonKeys.map(e => e[0]);
      if (nonKeys.length === r.length - 1) {
        rows.unshift(`this.${tname}ID = autokeys.${tname}ID++`);
        params.unshift(tname + "ID");
      }
      s.push(
        `class ${tname} { 
  constructor(${params.join(",")}) {
    ${rows.join(";\n    ")};
  }
}`);

    }
  });
  s.push(`
let autokeys = {
    ${Object.keys(td).map(t => `${t}:0`).join(",")}
} 
`);
  return { s, td };
}

function makeForm(tablename, tabledata) {
  let inputs = tabledata.filter(e => e[0] !== tablename + "ID").map(e => {
    let [name, sqlType] = e;
    let type = sqlType === "INT" ? "number" : "text";
    if (name.endsWith("ID")) {
      // foreign key - make select
      return `      <label>${name}<select class="foreign" id="${name}"></select>`;
    } else return `      <label>${name}<input type="${type}" id="${name}"></label>`;
  }).join('\n')
  let s = `
  <form data-tittel="${tablename}">
${inputs}
  </form>
`;
  return s.replace(/&/g,"&amp").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

function makeCode(tablename, tabledata) {

}
