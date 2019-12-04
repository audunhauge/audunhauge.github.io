// @ts-check

(function () {
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
            th {
              text-transform: capitalize;
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
            td.text {
              text-align: left;
              padding-left: 10px;
            }
            td.number {
              text-align: right;
              color: blue;
              padding-right: 10px;
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
      this.connected = "";  // use given db-component as where, assumed to implement get.value
      // also assumed to emit dbUpdate
      this._root = this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      addEventListener("dbUpdate", e => {
        if (this.connected !== "") {
          // NOTE update ignored if connected is set
          let [id, field] = this.connected.split(":");
          let dbComponent = document.getElementById(id);
          if (dbComponent) {
            // component found - get its value
            let value = dbComponent.value || "";
            if (value !== "") {
              // check that sql does not have where clause and value is int
              let sql = this.sql;
              let intvalue = Math.trunc(Number(value));
              if (sql.includes("where") || !Number.isInteger(intvalue)) return;  // do nothing
              sql += ` where ${field} = ${intvalue}`;  // value is integer
              this.redraw(sql);
            }
          }

        }
        if (this.update === "true") this.redraw(this.sql);
      });
    }

    static get observedAttributes() {
      return ["fields", "sql", "update", "connected"];
    }

    connectedCallback() {
      this.redraw(this.sql);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      let divThead = this._root.querySelector("#thead");
      if (name === "fields") {
        divThead.innerHTML = "";
        let fieldlist = newValue.split(",");
        let headers = fieldlist.map(h => { let [name,type="text"] = h.split(":"); return {name,type} })
        this.fieldlist = headers;
        for (let {name} of headers) {
          let th = document.createElement("th");
          th.innerHTML = name;
          divThead.appendChild(th);
        }
      }
      if (name === "connected") {
        this.connected = newValue;
      }
      if (name === "sql") {
        this.sql = newValue;
      }
      if (name === "update") {
        this.update = newValue;
      }
    }

    redraw(sql) {
      let divBody = this._root.querySelector("#tbody");
      if (this.sql && divBody) {
        //let sql = this.sql;
        let init = {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ sql }),
          headers: {
            "Content-Type": "application/json"
          }
        };
        fetch("/runsql", init)
          .then(r => r.json())
          .then(data => {
            console.log(data);
            let list = data.results;
            let rows = '';
            if (list.length) {
              let headers = this.fieldlist;
              rows = list.map(e => `<tr>${headers.map(h => `<td class="${h.type}">${e[h.name]}</td>`).join('')}</tr>`).join("");
            }
            divBody.innerHTML = rows;
          });
      }
    }
  }

  window.customElements.define("db-table", DBTable);
})();
