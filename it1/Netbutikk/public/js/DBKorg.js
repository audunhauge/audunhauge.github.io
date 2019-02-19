// @ts-check

(function () {
  const template = document.createElement("template");
  template.innerHTML = `
         <style>
           div.liste {
             border: solid gray 1px;
             margin: 1em;
           }
           div.korg {
             display:none;
           }
           h4 {
            text-align:center;
          }
         </style>
         <h4>Handlekorg</h4>
         <div class="liste">
           <slot name="liste"></slot>
           <button>Kjøp varene</button>
         </div>
      `;

  class DBKorg extends HTMLElement {
    constructor() {
      super();
      this.datalist = [];
      this.starting = true;
      this.table = "";
      this.fields = "";
      this.where = "";
      this.buy = false;
      this._root = this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    static get observedAttributes() {
      return ["table", "fields", "where", "heading"];
    }

    get valgt() {
      let id = this.getAttribute("liste");
      let div = document.getElementById(id);
      return div.querySelectorAll("input:checked");
    }

    connectedCallback() {
      console.log(this.table);
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "heading") {
        this._root.querySelector('h4').innerHTML = newValue;
      }
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
        let slot = this._root.querySelector('div.liste slot');
        this.starting = false;
        slot.addEventListener('slotchange', async (e) => {
          let data = localStorage.getItem("korg");
          let id = this.getAttribute("liste");
          //*
          if (data) {
            let items = JSON.parse(data);
            let target = document.getElementById(id);
            if (target && items.length) {
              let pattern = target.innerHTML;
              console.log(pattern);
              let s = "";
              items.forEach((linje, idx) => {
                s += supplant(pattern, linje);
              });
              target.innerHTML = s;
            } else {
              this._root.querySelector('div.liste').style.display = "none";
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
      const response = await fetch(address + "/runsql", init).catch(e => console.log(e.message));
      let res = await response.json();
      return res;
    }
  }

  window.customElements.define("db-korg", DBKorg);
})();
