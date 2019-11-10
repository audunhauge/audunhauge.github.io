// @ts-check

(function () {
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
        }
        
        #lagre {
            background-color: antiquewhite;
        }
        </style>
        <form>
          <div class="heading"><slot name="heading"></slot></div>
          <div id="fields"></div>
          <div id="foreign"></div>
          <label> &nbsp; <button type="button" id="save"><slot name="save">Save</slot></label>
        </form>
    `;

  class DBForm extends HTMLElement {
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
        // others may want to refresh view
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

    // assumes foreign key has same name in both tables
    // bok.forfatterid references forfatter.forfatterid
    makeSelect(table,field,use) {
      let fields = (field === use) ? field : `${field}, ${use}`;
      let sql = `select ${fields} from ${table} order by ${use}`;
      let data = '';
      let init = {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ sql, data }),
        headers: {
          "Content-Type": "application/json"
        }
      };
      fetch("runsql", init).then(r => r.json()).then(data => {
        console.log(data);
        let list = data.results;
        if (list.length) {
          let options = list.map(e => `<option value="${e[field]}">${e[use]}</option>`).join('');
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
      .then( () => this.dispatchEvent(new Event("dbUpdate")))
      .catch(e => console.log(e.message));
    }
  }

  window.customElements.define("db-form", DBForm);
})();
