// @ts-check

/* this component runs a select and fills in a template with values
 */

(function() {
  const template = document.createElement("template");
  let base = `
          <style>
            #main {
              min-width: 12em;
              min-height: 4em;
            }
          </style>
          #import#

          <div id="main"><slot></slot></div>
      `;

  class DBList extends HTMLElement {
    constructor() {
      super();
      this.loaded = false;
      this.sql = "";
      this.service = "/runsql";   // default service 
      // assumed to exist on server
      this._root = this.attachShadow({ mode: "open" });
      // leave of setting innerHTML - see if we have some css to include
      //this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    // NOTE: service must be placed before sql
    static get observedAttributes() {
      return ["sql", "service", "cssimport"];
    }

    connectedCallback() {
      // console.log("called");
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (name === "service") {
        this.service = newValue;
      }
      if (name === "cssimport") {
        this.import = `<style>@import "${newValue}";</style>`;
        template.innerHTML = base.replace('#import#',this.import);
        if (!this.loaded) this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.loaded = true;
      }
      if (name === "sql") {
        if (!this.loaded) {
          // the css was not ready - must be placed before sql
          template.innerHTML = base.replace('#import#','');  
          this.shadowRoot.appendChild(template.content.cloneNode(true));
          this.loaded = true;
        }
        let sql = (this.sql = newValue);
        let init = {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ sql }),
          headers: {
            "Content-Type": "application/json"
          }
        };
        fetch(this.service, init)
          .then(r => r.json())
          .then(data => {
            let list = data.results;
            let htmltable = this._root.querySelector("#main");
            if (list.error) {
              htmltable.classList.add("error");
            } else {
              htmltable.classList.remove("error");
              let items = Array.from(this._root.querySelectorAll("#main slot"));
              if (items && items.length) {
                let template;
                // only pick out the last element found in slot
                // not obvious how to handle multiple elements
                items[0].assignedElements().forEach((e, i) => {
                  template = e;
                });
                // we have a template and returned values
                if (template && list.length) {
                  //let style = document.defaultView.getComputedStyle(template, "").cssText;
                  list.forEach(e => {
                    let copy = template.cloneNode(true);
                    //copy.style.cssText = style;
                    let replaced = document.createRange().createContextualFragment(fill(copy,e));
                    copy.innerHTML = "";
                    copy.append(replaced);
                    htmltable.append(copy);
                  })
                  template.style.display = "none";
                }

              }
              //htmltable.title = sql + "\n" + list.error;
              return;
            }
            
            //htmltable.title = "";

            //divBody.innerHTML = rows;
            //this.trigger({}); // dependents may redraw
          });
      }
    }
  }

  /**
   * 
   * @param {Object} node clone of template
   * @param {Object} value values to fill into template
   */
  function fill(node,value) {
    let replaced = node.innerHTML;
    return replaced.replace(/\$\{(.+?)\}/g, (_ ,v) => {
      if (value[v]) {
        return value[v];
      } else {
        return `#${v}`;
      }
    })
  }

  window.customElements.define("db-list", DBList);
})();
