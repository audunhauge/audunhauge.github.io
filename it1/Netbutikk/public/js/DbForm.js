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
            margin-top: 1.5em;
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
        
        form::after {
            color:blue;
            content: "Registrering";
            position: absolute;
            right: 20px;
            top: -20px;
        }
        
        #lagre {
            background-color: antiquewhite;
        }
        </style>
        <form>
          <div class="heading"><slot name="heading"></slot></div>
          <div id="fields"></div>
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
        let inputs = Array.from(this._root.querySelectorAll("#fields input"));
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
      return ["table", "fields"];
    }

    connectedCallback() {
      console.log(this.table);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      let divFields = this._root.querySelector("#fields");
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
      const address = window.location.protocol + '//'
        + window.location.hostname + ':'
        + window.location.port;
      fetch(address + "/runsql", init)
      .then(  this.dispatchEvent(new Event("saved")) )
      .catch(e => console.log(e.message));
    }
  }

  window.customElements.define("db-form", DBForm);
})();
