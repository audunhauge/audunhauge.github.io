// @ts-check

/* this component fetches userinfo about current logged in user 
   can then be used as a foreign key or depended on by other components
   thus app.js can deliver queries where userid = myself
  */

(function() {
  const template = document.createElement("template");
  template.innerHTML = `
          <style>
          
          label {
              display: grid;
              grid-template-columns: 7fr 4fr;
              margin: 5px;
              padding: 5px;
              border-radius: 5px;
              border: solid gray 1px;
              background-color: whitesmoke;
          }
          </style>
          <label id="myself"><span></span><input type="text" value=""></label>
      `;

  class DBUser extends HTMLElement {
    constructor() {
      super();
      this.field = "userid";
      this.table = "users";
      this._root = this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    /**
     * field    the field that is returned as value, default is "userid"
     * label    text shown on component
     */
    static get observedAttributes() {
      return ["field", "label"];
    }

    connectedCallback() {
      console.log(this.field, this.table);
      this.getUserInfo(this.field);
    }

    get value() {
      let myself = this._root.querySelector("#myself > input");
      return myself.value;
    }

    get id() {
      // id is set by changing field
      let select = this._root.querySelector("#myself > input");
      return select.id;
    }

    attributeChangedCallback(name, oldValue, newValue) {
      let lbl = this._root.querySelector("#myself > span");
      let input = this._root.querySelector("#myself > input");
      if (name === "label") {
        this.label = newValue;
        lbl.innerHTML = newValue.charAt(0).toUpperCase() + newValue.substr(1);
      }
      if (name === "field") {
        this.field = newValue;
        input.id = newValue;
      }
    }

    // assumes foreign key has same name in both tables
    // bok.forfatterid references forfatter.forfatterid
    getUserInfo(field) {
      let input = this._root.querySelector("#myself > input");
      let data = "";
      let sql = `select ${field}`;
      let init = {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ sql, data }),
        headers: {
          "Content-Type": "application/json"
        }
      };
      fetch("/userinfo", init)
        .then(r => r.json())
        .then(data => {
          console.log(data);
          let v = data.results;
          if (v && v[field]) {
            let value = v[field];
            input.innerHTML = value;
          }
        });
      //.catch(e => console.log(e.message));
    }
  }

  window.customElements.define("db-user", DBUser);
})();
