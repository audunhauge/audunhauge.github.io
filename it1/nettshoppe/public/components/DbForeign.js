// @ts-check

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
          <label id="select"><span></span><select></select> </label>
      `;

  class DBForeign extends HTMLElement {
    constructor() {
      super();
      this.foreign = "";
      this.label = "";
      this.sql = "";
      this._root = this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
      this._root
        .querySelector("#select > select")
        .addEventListener("change", e => {
          this.dispatchEvent(
            new CustomEvent("dbChange", {
              bubbles: true,
              composed: true,
              detail: { id:this.id }
            })
          );
        });
    }

    /**
     * foreign  the foreign key connected to this select (book.bookid)
     * label    the field that supplies text for choosing (book.title to choose book.bookid)
     * sql      sql that supplies a list of (foreign,label) to feed into make-select
     *          order is [foreign,label]
     */
    static get observedAttributes() {
      return ["foreign", "label", "sql"];
    }

    connectedCallback() {
      console.log(this.sql);
    }

    get id() {
      let select = this._root.querySelector("#select > select");
      return select.id;
    }
    get value() {
      let select = this._root.querySelector("#select > select");
      return select.value;
    }

    attributeChangedCallback(name, oldValue, newValue) {
      let lbl = this._root.querySelector("#select > span");
      let select = this._root.querySelector("#select > select");
      if (name === "label") {
        this.label = newValue;
        lbl.innerHTML = newValue.charAt(0).toUpperCase() + newValue.substr(1);
      }
      if (name === "foreign") {
        this.foreign = newValue;
        select.id = newValue;
      }
      if (name === "sql") {
        this.sql = newValue;
        this.makeSelect(select, this.sql, this.foreign, this.label);
      }
    }

    // assumes foreign key has same name in both tables
    // bok.forfatterid references forfatter.forfatterid
    makeSelect(select, sql, foreign, label) {
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
          console.log(data);
          let list = data.results;
          if (list.length) {
            let options = list
              .map(e => `<option value="${e[foreign]}">${e[label]}</option>`)
              .join("");
            select.innerHTML = options;
          }
        });
      //.catch(e => console.log(e.message));
    }
  }

  window.customElements.define("db-foreign", DBForeign);
})();
