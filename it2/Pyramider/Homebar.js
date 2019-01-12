// @ts-check
class HomeBar extends HTMLElement {
    constructor() {
      super();
      const title = this.getAttribute("title") || "Demo";
      const username = this.getAttribute("username") || "Ole";
      
      const menu = this.getAttribute("menu") || "Home";

      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth();
      let day = now.getDate();

      const mnames = "Jan,Feb,Mar,Apr,Mai,Jun,Jul,Aug,Sep,Okt,Nov,Des".split(",");

      const info = this.getAttribute("info") 
           || `${day} ${  mnames[month]    } ${year}`;

      this._root = this.attachShadow({ mode: "open" });

      this._root.innerHTML = `
        <div id="home">
          <div id="title">${title}</div>
          <div id="menu">${menu}</div>
          <div id="username">${username}</div>
          <div id="info">${info}</div>
        </div>
            <style>
              #home {
                  display: grid;
                  align-items: center;
                  grid-template-columns: 1fr 2fr 3fr 1fr;
                  height: 70px;
                  background: rgba(32,166,231,.8) linear-gradient(180deg,#20a8e9,rgba(30,158,220,.5)) repeat-x;
                  color: #fff;
                  overflow:hidden;
              }
              #home > div {
                  font-size: 1.2em;
                  height: 32px;
                  padding: 5px;
                  text-align: center;
              }
              div#title {
                  font-size: 1.5em;
                  white-space: nowrap;
                  margin-left: 2em;
              }
            </style>
          `;
    }
    static get observedAttributes() {
      return ["username","title","menu","info"];
    }
    attributeChangedCallback(name, oldValue, newValue) {
      this._root.querySelector("#"+name).innerHTML = newValue;
    }
  }
  window.customElements.define("home-bar", HomeBar);