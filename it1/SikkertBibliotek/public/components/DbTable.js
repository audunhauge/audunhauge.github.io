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
            th.hidden,
            td.hidden {
              display:none;
            }
            td.number {
              text-align: right;
              color: blue;
              padding-right: 10px;
            }
            th button {
              color:red;
              font-size: 1.1rem;
              font-weight:bold;
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
      this.connected = ""; // use given db-component as where, assumed to implement get.value
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
              if (sql.includes("where") || !Number.isInteger(intvalue)) return; // do nothing
              sql += ` where ${field} = ${intvalue}`; // value is integer
              this.redraw(sql);
            }
          }
        }
        if (this.update === "true") this.redraw(this.sql);
      });
    }

    static get observedAttributes() {
      return ["fields", "sql", "update", "connected", "delete"];
    }

    connectedCallback() {
      this.redraw(this.sql);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      let divThead = this._root.querySelector("#thead");
      let divBody = this._root.querySelector("#tbody");
      if (name === "fields") {
        divThead.innerHTML = "";
        let fieldlist = newValue.split(",");
        let headers = fieldlist.map(h => {
          let [name, type = "text"] = h.split(":");
          return { name, type };
        });
        this.fieldlist = headers;
        for (let { name,type } of headers) {
          let th = document.createElement("th");
          th.innerHTML = name;
          th.className = type;
          divThead.appendChild(th);
        }
        if (this.delete) {
          let th = document.createElement("th");
          th.innerHTML = "<button>x</button>";
          divThead.appendChild(th);
          divThead.querySelector("button").addEventListener("click", () => {
            let table = this.delete;
            let leader = this.fieldlist[0].name;
            let selected = Array.from(divBody.querySelectorAll("input:checked"))
              .map(e => e.value)
              .join(",");
            let sql = `delete from ${table} where ${leader} in (${selected})`;
            console.log(sql);
            let data = {};
            let init = {
              method: "POST",
              credentials: "include",
              body: JSON.stringify({ sql, data }),
              headers: {
                "Content-Type": "application/json"
              }
            };
            //console.log(sql, data);
            fetch("/runsql", init)
              .then(() =>
                // others may want to refresh view
                this.dispatchEvent(
                  new CustomEvent("dbUpdate", {
                    bubbles: true,
                    composed: true,
                    detail: "upsert"
                  })
                )
              )
              .catch(e => console.log(e.message));
          });
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
      if (name === "delete") {
        // must be name of table to delete from
        // first field of fields will be used as shown
        // delete from tablename where field in ( collect field.value of checked rows)
        // the first field value is stored on checkbox to make this easy
        this.delete = newValue;
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
            // console.log(data);
            let list = data.results;
            let rows = "";
            let headers = this.fieldlist;
            let chkDelete = this.delete;
            let leader = headers[0].name; // name of first field
            if (list.length) {
              rows = list
                .map(
                  e =>
                    `<tr>${headers
                      .map(h => `<td class="${h.type}">${e[h.name]}</td>`)
                      .join("")} ${
                      chkDelete
                        ? `<td><input type="checkbox" value="${e[leader]}"></td>`
                        : ""
                    }</tr>`
                )
                .join("");
            }
            divBody.innerHTML = rows;
          });
      }
    }
  }

  window.customElements.define("db-table", DBTable);
})();
