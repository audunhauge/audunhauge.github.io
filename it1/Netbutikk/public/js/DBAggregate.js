// @ts-check

(function () {
    const template = document.createElement("template");
    template.innerHTML = `<span class="value"><slot></slot></span>`;

    class DBAgg extends HTMLElement {
        constructor() {
            super();
            this.datalist = [];
            this.starting = true;
            this.table = "";
            this.fields = "";
            this.where = "";
            this.groupby = "";
            this.pattern = "";
            this._root = this.attachShadow({ mode: "open" });
            this.shadowRoot.appendChild(template.content.cloneNode(true));
        }

        static get observedAttributes() {
            return ["table", "fields", "where", "groupby" ];
        }


        attributeChangedCallback(name, oldValue, newValue) {
            if (name === "fields") {
                this.fields = newValue.replace(/[^a-z0-9,()*+/-]+/g, '');
            }
            if (name === "table") {
                this.table = newValue.replace(/[^a-z0-9]+/g, '');
            }
            if (name === "where") {
                this.where = newValue.replace(/;/g, '').replace(/union/ig, '');
            }
            if (name === "groupby") {
                this.groupby = newValue.replace(/;/g, '').replace(/union/ig, '');
            }

            if (this.starting && this.table && this.where && this.fields && this.groupby) {
                let slot = this._root.querySelector('slot');
                this.starting = false;
                slot.addEventListener('slotchange', () => { this.getData() });
            }

        }

        async getData() {
            let sql;
            if (this.groupby === '-') {
                sql = `select ${this.fields} from ${this.table} where ${this.where}`;
            } else {
              sql = `select ${this.fields} from ${this.table} where ${this.where} group by ${this.groupby}`;
            }
            let data = await select(sql);
            let id = this.getAttribute("target");
            let target = document.getElementById(id);
            if (data.results.length) {
                if (target) {
                    let pattern = this.pattern || target.innerHTML;
                    this.pattern = pattern;
                    console.log(pattern);
                    let s = "";
                    data.results.forEach((linje, idx) => {
                        s += supplant(pattern, linje);
                    });
                    target.innerHTML = s;
                }
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
                // @ts-ignore
                const response = await fetch(address + "/runsql", init).catch(e => console.log(e.message));
                let res = await response.json();
                return res;
            }
        };
    }

    window.customElements.define("db-agg", DBAgg);
})();

/**
 * 
 * @param {string} s source string
 * @param {Object} o object with values string||number
 */
function supplant(s, o) {
    return s.replace(/{([^{}]*)}/g, function (a, b) {
        var r = o[b];
        return typeof r === "string" || typeof r === "number" ? String(r) : a;
    });
}
