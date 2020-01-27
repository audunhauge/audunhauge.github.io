// @ts-check

(function() {
  const template = document.createElement("template");
  template.innerHTML = `
          <style>
            table {
              width: var(--tsize, 100%);
              border-collapse:collapse;
            }
            #thead {
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
            td.true, td.false {
              text-align: center;
              color: green;
              font-size: 1.2rem;
            } 
            td.false {
              color:red;
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
            tr.selected {
              box-shadow: inset 0 0 5px blue;
            }
            table.error thead tr {
              box-shadow: inset 0 0 5px red, 0 0 0 orange;
              animation: pulse 1s alternate infinite;
            }
            @keyframes pulse {
              100% { box-shadow: inset 0 0 2px black, 0 0 6px red; }
            }
          </style>
          <table>
            <caption><slot name="caption"></slot></caption>
            <thead>
              <tr id="thead"></tr>
            </thead>
            <tbody id="tbody">
            </tbody>
          </table>
      `;

  const formatField = (type, value) => {
    // NOTE (value == null) covers (value == undefined) also
    switch (type) {
      case "boolean":
        return (value ? {type:'true', value:'✓'} : { type:'false',value:'✗'});
      case "number":
        return {type, value:+value };
      case "money":
        return {type:"number", value:(+value).toFixed(2) };
      case "int":
        return {type:"number", value:Math.trunc(+value)};
      case "date":
        let date = "";
        date = value == null ? "" : value.split("T")[0];
        return {type,value:date};
      default:
        let cleanValue = value === null ? "" : value;
        return {type,value:cleanValue};
    }
  };

  class DBTable extends HTMLElement {
    constructor() {
      super();
      this.selectedRow;
      this.rows = []; // data from sql
      this.key = "";
      this.refsql = ""; // set if updated by dbupdate - reused by simple refresh
      this.delete = "";
      this.connected = ""; // use given db-component as where, assumed to implement get.value
      // also assumed to emit dbUpdate
      this._root = this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      addEventListener("dbUpdate", e => {
        let source = e.detail.source;
        let table = e.detail.table;
        let done = false;
        if (source && this.connected !== "") {
          // otherwise do an update
          let [id, field] = this.connected.split(":");
          if (id === source) {
            done = true;
            let dbComponent = document.getElementById(id);
            if (dbComponent) {
              // component found - get its value
              let value = dbComponent.value || "";
              if (value !== "") {
                // check that sql does not have where clause and value is int
                let sql = this.sql;
                let intvalue = Math.trunc(Number(value));
                if (sql.includes("where") || !Number.isInteger(intvalue))
                  return; // do nothing
                sql += ` where ${field} = ${intvalue}`; // value is integer
                this.refsql = sql; // reuse if refreshed by update
                this.redraw(sql);
              } else {
                // we must redraw as empty
                let divBody = this._root.querySelector("#tbody");
                divBody.innerHTML = "";
                this.selectedRow = undefined;
                this.trigger({}); // cascade
              }
            }
          }
        }
        // check if we need a simple refresh
        if (!done && this.update && this.update === table)
          this.redraw(this.refsql || this.sql);
      });
      // can set focus on a row in table
      let divBody = this._root.querySelector("#tbody");
      divBody.addEventListener("click", e => {
        let prev = divBody.querySelector("tr.selected");
        if (prev) prev.classList.remove("selected"); // should be only one
        let t = e.target;
        while (t && t.localName !== "tr") {
          t = t.parentNode;
        }
        if (t && t.dataset && t.dataset.idx) {
          t.classList.add("selected");
          this.selectedRow = Number(t.dataset.idx);
          this.trigger({ row: this.selectedRow });
        }
      });
    }

    static get observedAttributes() {
      return ["fields", "sql", "update", "key", "connected", "delete"];
    }

    connectedCallback() {
      // only make initial redraw if not connected
      // a connected table must be triggered by event
      if (this.connected === "") {
        this.redraw(this.sql);
      }
    }

    get value() {
      if (this.selectedRow === undefined) {
        return undefined;
      }
      let current = this.rows[this.selectedRow];
      return current[this.key];
    }

    trigger(detail) {
      detail.source = this.id;
      this.dispatchEvent(
        new CustomEvent("dbUpdate", {
          bubbles: true,
          composed: true,
          detail
        })
      );
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
        for (let { name, type } of headers) {
          let th = document.createElement("th");
          th.innerHTML = name;
          th.className = type;
          divThead.appendChild(th);
        }
      }
      if (name === "connected") {
        this.connected = newValue;
      }
      if (name === "sql") {
        this.sql = newValue;
      }
      if (name === "key") {
        this.key = newValue;
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
          let data = {};
          let init = {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({ sql, data }),
            headers: {
              "Content-Type": "application/json"
            }
          };
          fetch("/runsql", init)
            .then(r => r.json())
            .then(data => {
              let list = data.results; // check for errors
              let htmltable = this._root.querySelector("table");
              if (list.error) {
                htmltable.classList.add("error");
                htmltable.title = sql + "\n" + list.error;
                return;
              } else {
                this.trigger({ update: true, table });
              }
            })
            .catch(e => console.log(e.message));
        });
      }
    }

    redraw(sql) {
      this.selectedRow = undefined;
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
            let htmltable = this._root.querySelector("table");
            if (list.error) {
              htmltable.classList.add("error");
              htmltable.title = sql + "\n" + list.error;
              return;
            }
            htmltable.classList.remove("error");
            htmltable.title = "";
            this.rows = list; // so we can pick values
            let rows = "";
            let headers = this.fieldlist;
            let chkDelete = this.delete;
            let leader = headers[0].name; // name of first field
            if (list.length) {
              rows = list
                .map(
                  (e, i) =>
                    `<tr data-idx="${i}">${headers
                      .map((h, i) => {
                        let {value,type} = formatField(h.type,e[h.name]);
                        return `<td class="${type}">${value}</td>`
                      })
                      .join("")} ${
                      chkDelete
                        ? `<td><input type="checkbox" value="${e[leader]}"></td>`
                        : ""
                    }</tr>`
                )
                .join("");
            }
            divBody.innerHTML = rows;
            this.trigger({}); // dependents may redraw
          });
      }
    }
  }

  window.customElements.define("db-table", DBTable);
})();
