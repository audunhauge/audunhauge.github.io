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
       </style>
       <h4>Vareliste</h4>
       <div class="liste">
         <slot name="liste"></slot>
         <button>Gå til kasse</button>
       </div>
    `;

  class DBSelect extends HTMLElement {
    constructor() {
      super();
      this.datalist =[];
      this.starting = true;
      this.table = "";
      this.fields = "";
      this.where = "";
      this.buy = false;
      this._root = this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    static get observedAttributes() {
      return ["table", "fields", "where"];
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
        let divKorg = this._root.querySelector('div.korg');
        let divListe = this._root.querySelector('div.liste');
        this.starting = false;
        this._root.querySelector('button').addEventListener("click", () => {
           let valgt = Array.from(this.valgt);
           let items = valgt.map(e => Object.assign({},this.datalist[e.id]));
           items.forEach(e => delete e.buy);
           localStorage.setItem('korg',JSON.stringify(items));
           this.dispatchEvent(new Event("korg"));        
        });
        slot.addEventListener('slotchange', async (e) => {
          let data = await this.select(sql);
          let id = this.getAttribute("liste");
          let korg = this.getAttribute("korg");
          let buy = this.getAttribute("buy");
          //*
          if (data.results) {
            let target = document.getElementById(id);
            if (target) {
              let pattern  = target.innerHTML;
              console.log(pattern);
              let s = "";
              data.results.forEach((linje,idx) => {
                this.datalist[idx] = linje;
                if (buy) {
                  linje.buy = `<input id="${idx}" type="checkbox">`;
                }
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
      const response = await fetch(address + "/runsql", init).catch(e => console.log(e.message));
      let res = await response.json();
      return res;
    }
  }

  window.customElements.define("db-select", DBSelect);
})();
