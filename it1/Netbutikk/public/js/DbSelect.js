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
       <h4>Vareliste</h4>
       <div class="liste">
         <slot name="liste"></slot>
         <button><slot name="kasse">Gå til kasse</slot></button>
       </div>
    `;

  class DBSelect extends HTMLElement {
    constructor() {
      super();
      this.datalist = [];
      this.starting = true;
      this.table = "";
      this.fields = "";
      this.where = "";
      this.kasse = false;
      this.buy = false;
      this.pattern = '';
      this._root = this.attachShadow({ mode: "open" });
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    static get observedAttributes() {
      return ["table", "fields", "where", "heading"];
    }

    get valgt() {
      let id = this.getAttribute("target");
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
        let slot = this._root.querySelector('div.liste slot');
        this.starting = false;
        let kasse = this.getAttribute("kasse");
        this._root.querySelector('button').addEventListener("click", () => {
        });
        if (kasse) {
          this._root.querySelector('button').addEventListener("click", () => {
            let valgt = Array.from(this.valgt);
            let items = valgt.map(e => Object.assign({}, this.datalist[e.id]));
            items.forEach(e => delete e.buy);
            // lagrer alle kjøpte varer i localstorage
            localStorage.setItem('korg', JSON.stringify(items));
            this.dispatchEvent(new Event(kasse));
          });
        }
        slot.addEventListener('slotchange', () => { this.getData() });
      }

    }

    async getData() {
      let sql = `select ${this.fields} from ${this.table} where ${this.where}`;
      let data = await select(sql);
      let id = this.getAttribute("target");
      let buy = this.getAttribute("buy");
      let kasse = this.getAttribute("kasse");
      let target = document.getElementById(id);
      if (!kasse) {
        this._root.querySelector('button').style.display = "none";
      }
      if (data.results.length) {
        if (target) {
          let pattern = this.pattern || target.innerHTML;
          this.pattern = pattern;
          console.log(pattern);
          let s = "";
          data.results.forEach((linje, idx) => {
            this.datalist[idx] = linje;
            if (buy) {
              linje.buy = `<input id="${idx}" type="checkbox">`;
            }
            s += supplant(pattern, linje);
          });
          target.innerHTML = s;
        }
      } else {
        this._root.querySelector('div.liste').style.display = "none";
      }
      async function select(sql = "") {
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
    };
  }

  window.customElements.define("db-select", DBSelect);
})();

function supplant(s, o) {
  return s.replace(/{([^{}]*)}/g, function (a, b) {
    var r = o[b];
    return typeof r === "string" || typeof r === "number" ? r : a;
  });
}
