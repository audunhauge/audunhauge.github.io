// @ts-check

(function() {
  const template = document.createElement("template");
  template.innerHTML = `
          <style>
            table {
              width: 100%;
              border-collapse:collapse;
            }
            thead {
              background-color: var(--head, beige);
            }
            td,th {
              border: solid gray 1px;
              padding: 2px;
            }
            tr:nth-child(odd) {
              background-color: var(--alternate, lightsteelblue);
            }
            caption {
              color:blue;
              font-size: 1.1em;
            }
          </style>
          <table>
            <caption><slot name="caption"></slot></caption>
            <thead id="thead">
            </thead>
            <tbody id="tbody">
            </tbody>
          </table>
      `;

  class DBTable extends HTMLElement {
    constructor() {
      super();
      this.table = "";
      this.delete = "";
      this._root = this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      addEventListener("dbUpdate", e => {
        if (this.update === "true") this.redraw();
      });
    }

    static get observedAttributes() {
      return ["fields", "sql", "update"];
    }

    connectedCallback() {
      console.log(this.table);
      this.redraw();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      let divThead = this._root.querySelector("#thead");
      if (name === "fields") {
        divThead.innerHTML = "";
        let fieldlist = newValue.split(",");
        this.fieldlist = fieldlist;
        for (let fieldname of fieldlist) {
          let text = fieldname.charAt(0).toUpperCase() + fieldname.substr(1);
          let th = document.createElement("th");
          th.innerHTML = text;
          divThead.appendChild(th);
        }
      }
      if (name === "sql") {
        this.sql = newValue;
      }
      if (name === "update") {
        this.update = newValue;
      }
    }

    redraw() {
      let divBody = this._root.querySelector("#tbody");
      if (this.sql && divBody) {
        let sql = this.sql;
        let init = {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ sql }),
          headers: {
            "Content-Type": "application/json"
          }
        };
        fetch("runsql", init)
          .then(r => r.json())
          .then(data => {
            console.log(data);
            let list = data.results;
            if (list.length) {
              let headers = this.fieldlist;
              let rows = list.map(e => `<tr>${headers.map(h => `<td>${e[h]}</td>`).join('')}</tr>`).join("");
              divBody.innerHTML = rows;
            }
          });
      }
    }
  }

  window.customElements.define("db-table", DBTable);
})();
