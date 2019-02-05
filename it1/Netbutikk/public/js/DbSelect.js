// @ts-check

(function () {
  const template = document.createElement("template");
  template.innerHTML = `
       <style>
         div.liste {
           border: solid gray 1px;
           margin: 1em;
         }
       </style>
       <div class="liste">
         <slot></slot>
       </div>
    `;

  class DBSelect extends HTMLElement {
    constructor() {
      super();
      this.starting = true;
      this.table = "";
      this.fields = "";
      this.where = "";
      this._root = this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    static get observedAttributes() {
      return ["table", "fields", "where"];
    }

    connectedCallback() {
      console.log(this.table);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "fields") {
        this.fields = newValue.replace(/[^a-z0-9,]+/g, '');
      }
      if (name === "table") {
        this.table = newValue.replace(/[^a-z0-9]+/g, '');
      }
      if (name === "where") {
        this.where = newValue.replace(/;/g, '').replace(/union/ig, '');
      }
      if (this.starting && this.table && this.where && this.fields) {
        let sql = `select ${this.fields} from ${this.table} where ${this.where}`;
        let slot = this._root.querySelector('slot');
        this.starting = false;
        slot.addEventListener('slotchange', async (e) => {
          let data = await this.select(sql);
          let id = this.getAttribute("liste");
          //*
          if (data.results) {
            let target = document.getElementById(id);
            if (target) {
              let pattern  = target.innerHTML;
              console.log(pattern);
              let s = "";
              data.results.forEach(linje => {
                s += supplant(pattern,linje);
              });
              target.innerHTML = s;
            }
          }
          //*/
        });
        
      }

      function supplant(s, o) {
        return s.replace(/{([^{}]*)}/g, function (a, b) {
          var r = o[b];
          return typeof r === "string" || typeof r === "number" ? r : a;
        });
      }
    }



    async select(sql = "") {
      let init = {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ sql }),
        headers: {
          "Content-Type": "application/json"
        }
      };
      console.log(sql);
      const address = window.location.protocol + '//'
        + window.location.hostname + ':'
        + window.location.port;
      //fetch(address + "/runsql", init).catch(e => console.log(e.message));
      const response = await fetch(address + "/runsql", init).catch(e => console.log(e.message));
      let res = await response.json();
      return res;
    }
  }

  window.customElements.define("db-select", DBSelect);
})();
