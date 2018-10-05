// @ts-check
let sql = `CREATE TABLE forfatter
(
  navn INT NOT NULL,
  forfatterID INT NOT NULL,
  PRIMARY KEY (forfatterID)
);

CREATE TABLE forlag
(
  navn INT NOT NULL,
  forlagID INT NOT NULL,
  PRIMARY KEY (forlagID)
);

CREATE TABLE bok
(
  bokID INT NOT NULL,
  isbn text NOT NULL,
  tittel text NOT NULL,
  sider INT NOT NULL,
  sjanger text NOT NULL,
  Utgitt INT NOT NULL,
  forfatterID INT NOT NULL,
  forlagID INT NOT NULL,
  PRIMARY KEY (bokID),
  FOREIGN KEY (forfatterID) REFERENCES forfatter(forfatterID),
  FOREIGN KEY (forlagID) REFERENCES forlag(forlagID)
);

CREATE TABLE eksemplar
(
  eID INT NOT NULL,
  isbn INT NOT NULL,
  PRIMARY KEY (eID),
  FOREIGN KEY (isbn) REFERENCES bok(isbn)
);

CREATE TABLE låner
(
  lånerID INT NOT NULL,
  navn INT NOT NULL,
  adresse INT NOT NULL,
  PRIMARY KEY (lånerID)
);

CREATE TABLE Utlån
(
  StartDato INT NOT NULL,
  Innlevert INT NOT NULL,
  eID INT NOT NULL,
  lånerID INT NOT NULL,
  PRIMARY KEY (eID, lånerID),
  FOREIGN KEY (eID) REFERENCES eksemplar(eID),
  FOREIGN KEY (lånerID) REFERENCES låner(lånerID)
);`;

let target = 'bok';


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
        let [x, xs] = t.split('(');
        if (x.startsWith("CREATE TABLE")) {
            let tname = n2e(x.substr(12).trim());
            let r = xs.split(",").map(e => n2e(e.trim())).filter(e => !e.startsWith("PRIMARY") && !e.startsWith("FOREIGN")).map(e => e.split(" ").slice(0,2));
            td[tname] = r;
            let rows = r.map(e => `this.${e[0]} = ${e[0]}`);
            let params = r.map(e => e[0]).join(",");
            s.push(
                `class ${tname} { 
  constructor(${params}) {
    ${rows.join(";\n    ")};
  }
}`);

        }
    });
    return { s, td };
}

let { s, td } = sql2class(sql);

/*
@startuml

title "Bruker lager database-skjema"

actor User
boundary "Web GUI" as GUI
control "Velg database" as SC
entity Kodegenerator as KO


User -> GUI : Lim inn sql
GUI -> SC : sql
SC -> KO : {array,backend}
KO -> User : {HTML,js,class,css}
@enduml
*/



function makeForm(tablename, tabledata) {
    let inputs = tabledata.filter(e => e[0] !== tablename + "ID").map(e => {
        let [name,sqlType] = e;
        let type = sqlType === "INT" ? "number" : "text";
        if (name.endsWith("ID")) {
            // foreign key - make select

        } else return `<label>${name}<input type="${type}" id="${name}"></label>`;
    }).join('\n')
    let s = `<form data-tittel="${tablename}">${inputs}</form>`;
    return s;
}

function makeCode(tablename, tabledata) {

}

let skjema = makeForm(target, td[target]);

console.log(s.join("\n"), "\n", skjema);