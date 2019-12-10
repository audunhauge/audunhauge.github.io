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
            text-transform:capitalize;
        }

        form  div#foreign label {
          grid-template-columns: 5fr 1fr 4fr;
        }

        span.foreign {
          color: green;
          font-size: 0.9em;
          padding-right:3px;
        }

        #next, #prev {
          width: 0px;
          height: 0px;
          position: absolute;
          right: -60px;
          top: calc(50% - 30px);
          border: solid 25px transparent;
        }
        #prev {
          left: -60px;
          border-right: solid gray 25px;
        }
        #next {
          border-left: solid gray 25px;
        }
        #lagre {
            background-color: antiquewhite;
        }
        div.heading {
          display: grid;
          grid-template-columns: 5fr 1fr;
        }
        .hidden {
          display:none;
        }
        form.invalid  {
          height: 1em;
          overflow:hidden;
        }
        </style>
        <form>
          <div class="heading"><slot name="heading"></slot><div id="number">1</div></div>
          <div id="fields"></div>
          <div id="foreign">
          </div>
          <div id="alien">
            <slot></slot>
          </div>
          <div id="next"></div>
          <div id="prev"></div>
          <label class="hidden"> &nbsp; <button type="button" id="save"><slot name="save">Save</slot></button></label>
        </form>
    `;

  // extend to more datatypes if needed
  const getval = e => {
    switch (e.type) {
      case "checkbox":
        return e.checked;
      case "number":
        return e.value !== "" ? Number(e.value) : 0;
      case "date":
        return e.value;
      default:
        return e.value;
    }
  };

  const assignInput = (inp, type, value) => {
    // NOTE (value == null) covers (value == undefined) also
    switch (type) {
      case "checkbox":
        inp.checked = value !== false;
        break;
      case "date":
        let date = "";
        date = value == null ? "" : value.split("T")[0];
        inp.value = date;
        break;
      default:
        let cleanValue = value === null ? "" : value;
        inp.value = cleanValue;
        break;
    }
  };

  class DBUpdate extends HTMLElement {
    constructor() {
      super();
      this.rows = [];
      this.types = {}; // fields need typing so we can store dates and number correctly
      this.idx = 0;
      this.table = "";
      this.key = "";
      this.update = "";
      this.connected = "";
      this._root = this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));

      // this is code for creating sql insert statement
      this._root.querySelector("#save").addEventListener("click", e => {
        if (this.update) {
          let current = this.rows[this.idx]; // save any changes to the rows array
          let keyint = current[this.key];
          this.fieldlist.forEach(e => (current[e.id] = e.value));
          // aliens will pick out any db-foreign placed into alien-slot
          let aliens = Array.from(this._root.querySelectorAll("#alien slot"))
            .map(e => e.assignedElements()[0])
            .filter(e => e !== undefined);
          let foreign = Array.from(
            this._root.querySelectorAll("#foreign select")
          );
          let inputs = Array.from(this._root.querySelectorAll("#fields input"))
            .concat(foreign)
            .concat(aliens)
            .filter(e => !e.disabled);
          let names = inputs.map(e => e.id);
          let fieldvalues = names.map(e => `${e}=$[${e}]`).join(",");
          // get value of input element - handles checkboxes
          let data = inputs.reduce((s, e) => ((s[e.id] = getval(e)), s), {});
          let table = this.table;
          let sql = `update ${table} set ${fieldvalues} where ${this.key} = ${keyint}`;
          this.upsert(sql, data);
        }
      });
      this._root.querySelector("#next").addEventListener("click", () => {
        this.idx = (this.idx + 1) % this.rows.length;
        this.show();
      });
      this._root.querySelector("#prev").addEventListener("click", () => {
        this.idx = (this.idx + this.rows.length - 1) % this.rows.length;
        this.show();
      });
    }

    static get observedAttributes() {
      return ["table", "key", "fields", "foreign", "update", "connected"];
    }

    connectedCallback() {
      this.redraw();
    }

    get value() {
      let current = this.rows[this.idx];
      return current[this.key];
    }

    attributeChangedCallback(name, oldValue, newValue) {
      let divFields = this._root.querySelector("#fields");
      let divForeign = this._root.querySelector("#foreign");
      if (name === "fields") {
        divFields.innerHTML = "";
        let rawfields = newValue.split(",");
        let fieldlist = rawfields.map(h => {
          let [name, type = "text"] = h.split(":");
          return { name, type };
        });
        let readonly = this.update === "";
        for (let f of fieldlist) {
          let label = document.createElement("label");
          let disabled = f.name === this.key || readonly ? " disabled" : ""; // can not change key
          label.innerHTML = `${f.name} <input type="${f.type}" id="${f.name}" ${disabled}>`;
          divFields.appendChild(label);
        }
        this.fieldlist = fieldlist.map(e =>
          this._root.querySelector("#" + e.name)
        );
        this.fields = fieldlist.map(e => e.name);
        this.types = fieldlist.reduce((s, e) => {
          s[e.name] = e.type;
          return s;
        }, {});
      }
      if (name === "table") {
        this.table = newValue;
      }
      if (name === "update") {
        this.update = newValue;
        this._root.querySelector("label.hidden").classList.remove("hidden");
      }
      if (name === "key") {
        this.key = newValue;
      }
      if (name === "connected") {
        this.connected = newValue;
        // this component depends on another
        this._root.querySelector("#next").classList.add("hidden");
        this._root.querySelector("#prev").classList.add("hidden");
        addEventListener("dbUpdate", e => {
          let source = e.detail.source;
          let [id, field] = this.connected.split(":");
          if (id !== source) return; // we are not interested
          let dbComponent = document.getElementById(id);
          if (dbComponent) {
            // component found - get its value
            let value = dbComponent.value || "";
            if (value !== "") {
              let intvalue = Math.trunc(Number(value));
              let rows = this.rows;
              let key = this.key;
              if (rows.length && key) {
                // find correct idx
                for (let i = 0; i < rows.length; i++) {
                  let r = rows[i];
                  if (r[key] === intvalue) {
                    // found correct row
                    this.idx = i;
                    this.show();
                    return;
                  }
                }
              }
            } else {
              // we must redraw as empty
              this._root.querySelector("form").classList.add("invalid");
              this.idx = undefined;
              this.trigger({}); // cascade
            }
          }
        });
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

    show() {
      // places data for row[idx] in form for editing
      this._root.querySelector("form").classList.remove("invalid");
      if (this.rows.length && this.fieldlist.length) {
        let current = this.rows[this.idx];
        //assignInput
        this.fieldlist.forEach(e =>
          assignInput(e, this.types[e.id], current[e.id])
        );
        this._root.querySelector("#number").innerHTML =
          "#" + String(this.idx + 1);
        this.trigger({ source: this.id, table: this.table });
      }
    }

    redraw() {
      if (this.table && this.key) {
        let table = this.table;
        let key = this.key;
        let fields = this.fields || "*";
        let keyfields = key + "," + fields;
        let sql = `select ${keyfields} from ${table} order by ${key}`;
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
      fetch("/runsql", init)
        .then(r => r.json())
        .then(data => {
          //console.log(data);
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
      //console.log(sql, data);
      fetch("/runsql", init)
        .then(() =>
          // others may want to refresh view
          this.dispatchEvent(
            new CustomEvent("dbUpdate", {
              bubbles: true,
              composed: true,
              detail: { source: this.id, table: this.table }
            })
          )
        )
        .catch(e => console.log(e.message));
    }
  }

  window.customElements.define("db-update", DBUpdate);
})();
