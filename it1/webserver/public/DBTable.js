// @ts-check

(function () {
    const template = document.createElement("template");
    template.innerHTML = `
          <style>
          
          </style>
          <table>
            <caption></caption>
            <thead>
            </thead>
            <tbody>
            </tbody>
          </table>
          <form>
            <div class="heading"><slot name="heading"></slot></div>
            <div id="fields"></div>
            <div id="foreign"></div>
            <label> &nbsp; <button type="button" id="save"><slot name="save">Save</slot></label>
          </form>
      `;
  
    class DBTable extends HTMLElement {
      constructor() {
        super();
        this.table = "";
        this._root = this.attachShadow({ mode: "open" });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this._root.querySelector("#save").addEventListener("click", e => {
          let inputs = Array.from(this._root.querySelectorAll("#fields input")).
              concat(Array.from(this._root.querySelectorAll("#foreign select")));
          let names = inputs.map(e => e.id);
          let valueList = names.map(e => `$[${e}]`).join(",");
          let namelist = names.join(",");
          let data = inputs.reduce((s, e) => ((s[e.id] = e.value), s), {});
          let table = this.table;
          let sql = `insert into ${table} (${namelist}) values (${valueList})`;
          this.upsert(sql, data);
        });
      }
  
      static get observedAttributes() {
        return ["table", "fields", "foreign"];
      }
  
      connectedCallback() {
        console.log(this.table);
      }
  
      attributeChangedCallback(name, oldValue, newValue) {
        let divFields = this._root.querySelector("#fields");
        let divForeign = this._root.querySelector("#foreign");
        if (name === "fields") {
          divFields.innerHTML = "";
          let fieldlist = newValue.split(",");
          for (let i = 0; i < fieldlist.length; i++) {
            let [name, type = "text", text = ""] = fieldlist[i].split(":");
            text = (t => t.charAt(0).toUpperCase() + t.substr(1))(text || name);
            let label = document.createElement("label");
            label.innerHTML = `${text} <input type="${type}" id="${name}">`;
            divFields.appendChild(label);
          }
        }
        if (name === "table") {
          this.table = newValue;
        }
        if (name === "foreign") {
          divForeign.innerHTML = "";
          let fieldlist = newValue.split(",");
          for (let i = 0; i < fieldlist.length; i++) {
            let [table, fields] = fieldlist[i].split(".");
            let [field,use] = fields.split(":");
            use = use || field;
            let text = use.charAt(0).toUpperCase() + use.substr(1);
            let label = document.createElement("label");
            label.innerHTML = `${text} <span class="foreign">fra ${table}</span> <select id="${field}"></select>`;
            divForeign.appendChild(label);
            this.makeSelect(table,field,use);
  
          }
        }
      }
  
      select(sql = "select * from bok") {
        let init = {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({ sql }),
            headers: {
                "Content-Type": "application/json"
            }
        };
        const response = await fetch("/runsql", init);
        let res = await response.json();
        return res;
      }
  
    }
  
    window.customElements.define("db-table", DBTable);
  })();
  