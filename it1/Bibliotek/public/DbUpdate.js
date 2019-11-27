// @ts-check

(function() {
  const template = document.createElement("template");
  template.innerHTML = `
        <style>
        .heading {
            text-align: center;
            font-size: 1.2em;
            color:blue;
        }
        form {
            position: relative;
            width: 35em;
            max-width: 85%;
            padding: 5px;
            border-radius: 5px;
            border: solid gray 1px;
            background-color: gainsboro;
            margin-top: 1em;
        }

        form > label {
            position: relative;
            left: 70%;
        }
        
        form  div label {
            display: grid;
            grid-template-columns: 7fr 4fr;
            margin: 5px;
            padding: 5px;
            border-radius: 5px;
            border: solid gray 1px;
            background-color: whitesmoke;
        }

        form  div#foreign label {
          grid-template-columns: 5fr 1fr 4fr;
        }
        
        form::after {
            color:blue;
            content: "Registrering";
            position: absolute;
            right: 20px;
            top: -20px;
        }

        span.foreign {
          color: green;
          font-size: 0.9em;
          padding-right:3px;
        }
        
        #lagre {
            background-color: antiquewhite;
        }
        </style>
        <form>
          <div class="heading"><slot name="heading"></slot></div>
          <div id="fields"></div>
          <div id="foreign">
          </div>
          <div id="alien">
            <slot></slot>
          </div>
          <label> &nbsp; <button type="button" id="save"><slot name="save">Save</slot></button></label>
        </form>
    `;

  // extend to more datatypes if needed
  const getval = e => {
    switch(e.type) {
      case "checkbox":
        return e.checked;
      default:
        return e.value;
    }
  }

  class DBUpdate extends HTMLElement {
    constructor() {
      super();
      this.rows = [];  
      this.idx = 0;
      this.table = "";
      this._root = this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      // this is code for creating sql insert statement
      this._root.querySelector("#save").addEventListener("click", e => {
        // aliens will pick out any db-foreign placed into alien-slot
        let aliens = Array.from(this._root.querySelectorAll("#alien slot")).map(
          e => e.assignedElements()[0]
        ).filter(e => e !== undefined);
        let foreign = Array.from(
          this._root.querySelectorAll("#foreign select")
        );
        let inputs = Array.from(this._root.querySelectorAll("#fields input"))
          .concat(foreign)
          .concat(aliens);
        let names = inputs.map(e => e.id);
        let valueList = names.map(e => `$[${e}]`).join(",");
        let namelist = names.join(",");
        // get value of input element - handles checkboxes
        let data = inputs.reduce((s, e) => ((s[e.id] = getval(e)), s), {});
        let table = this.table;
        let sql = `update ${table} set ${fieldvalues} where `;
        this.upsert(sql, data);
      });
    }

    static get observedAttributes() {
      return ["table", "key", "fields", "foreign"];
    }

    connectedCallback() {
      this.redraw();
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
        this.fieldlist = fieldlist.map(e => this._root.querySelector("#"+e));
      }
      if (name === "table") {
        this.table = newValue;
      }
      if (name === "fields") {
        this.fields = newValue;
      }
      if (name === "key") {
        this.key = newValue;
      }
      if (name === "foreign") {
        divForeign.innerHTML = "";
        let fieldlist = newValue.split(",");
        for (let i = 0; i < fieldlist.length; i++) {
          let [table, fields] = fieldlist[i].split(".");
          let [field, use] = fields.split(":");
          use = use || field;
          let text = use.charAt(0).toUpperCase() + use.substr(1);
          let label = document.createElement("label");
          label.innerHTML = `${text} <span class="foreign">fra&nbsp;${table}</span> <select id="${field}"></select>`;
          divForeign.appendChild(label);
          this.makeSelect(table, field, use);
        }
      }
    }

    show() {
      // places data for row[idx] in form for editing
      if (this.rows.length && this.fieldlist.length) {
        let current = this.rows[this.idx];
        this.fieldlist.forEach(e => e.value = current[e.id]);
      }
    }

    redraw() {
      if (this.table && this.key) {
        let table = this.table;
        let key = this.key;
        let fields = this.fields || "*";
        let keyfields = key + ',' + fields; 
        let sql = `select ${keyfields} from ${table} order by ${key}`;
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
              this.rows = list;
              this.show();
            }
          });
      }
    }
    

    // assumes foreign key has same name in both tables
    // bok.forfatterid references forfatter.forfatterid
    makeSelect(table, field, use) {
      let fields = field === use ? field : `${field}, ${use}`;
      let sql = `select ${fields} from ${table} order by ${use}`;
      let data = "";
      let init = {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ sql, data }),
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
            let options = list
              .map(e => `<option value="${e[field]}">${e[use]}</option>`)
              .join("");
            this._root.querySelector(`#${field}`).innerHTML = options;
          }
        });
      //.catch(e => console.log(e.message));
    }

    upsert(sql = "", data) {
      let init = {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ sql, data }),
        headers: {
          "Content-Type": "application/json"
        }
      };
      console.log(sql, data);
      fetch("runsql", init)
        .then(() =>  // others may want to refresh view
          this.dispatchEvent(
            new CustomEvent("dbUpdate", {
              bubbles: true,
              composed: true,
              detail: "upsert"
            })
          )
        )
        .catch(e => console.log(e.message));
    }
  }

  window.customElements.define("db-update", DBUpdate);
})();
