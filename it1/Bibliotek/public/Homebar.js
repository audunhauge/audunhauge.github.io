class HomeBar extends HTMLElement {

  constructor() {
    super();
    const heading = this.getAttribute("heading") || "";
    const crumb = this.getAttribute("crumb") || "";
    const username = this.getAttribute("username") || "";
    this._info = {};
    let now = new Date();
    let datestr = now.toDateString();
    this._root = this.attachShadow({ mode: "open" });
    this._root.innerHTML = `
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
      <div id="home">
        <div id="menu" tabindex="0">
        <i class="material-icons">menu</i>
            <ul>
              <slot><li>simple menu</li></slot>
            </ul>
        </div>
        <div id="heading">${heading}</div>
        <div id="crumb">${crumb}</div>
        <div id="username">${username}</div>
        <div id="info">${datestr}</div>
      </div>
          <style>
            #home {
                display: grid;
                align-items: center;
                grid-template-columns: 1fr 1fr 2fr 3fr 1fr;
                height: 70px;
                background: rgba(32,166,231,.8) linear-gradient(180deg,#20a8e9,rgba(30,158,220,.5)) repeat-x;
                color: #fff;
                /*overflow:hidden;*/
            }

            div#menu {
              place-self:center left;
            }

            div#menu ul,
            div#info > ul {
              text-align: left;
              visibility: hidden;
              list-style: none;
              margin: 0;
              padding: 5px;
              z-index:100;
              position: relative;
              top:-0px;
              color: black;
              background-color: rgb(245, 245, 245);
              box-shadow: 2px 2px 2px gray;
              border: solid gray 1px;
              border-radius: 4px;
              padding: 5px;
            }

            div#menu:focus-within ul,
            div#menu:hover ul,
            div#info:hover > ul {
               visibility: visible;
            }
            ::slotted(li:hover),
            div#menu slot:hover,
            div#info > ul > li:hover {
              background: rgb(32,166,231);
            }

            div#info li, div#menu li {
              padding: 2px;
            }

            #home > div {
                font-size: 1.2em;
                height: 32px;
                padding: 5px;
                text-align: center;
                white-space: nowrap;
            }
            div#heading {
                font-size: 1.5em;
                white-space: nowrap;
                margin-left: 2em;
            }
            #home i.material-icons {
              font-size: 32px;
            }
            @media not (screen and (-webkit-device-pixel-ratio: 1)) {
              #username , #info, #crumb { display:none; }
              #home {grid-template-columns: 1fr 1fr 3fr;}
            }
            @media screen and (max-width: 750px) {
              #username , #info { display:none; }
              #home {grid-template-columns: 1fr  1fr 3fr;}
            }
            @media screen and (max-width: 550px) {
              #username , #info, #crumb { display:none; }
              #home {grid-template-columns: 1fr 2fr; }
            }
          </style>
        `;

    this._root.querySelector("#crumb").addEventListener("click", () => this.dispatchEvent(new Event("crumb")));
    this._root.querySelector("#menu").addEventListener("click", (e) => {
      let t = e.target;
      this._info.target = t;
      if (t.localName === "li" && t.dataset.link) {
        let link = t.dataset.link;
        location.href = `${link}.html`;
      } else
        this.dispatchEvent(new Event("menu"));
    });
    this._root.querySelector("#info").addEventListener("click", (e) => {
      let t = e.target;
      this._info.target = t;
      this.dispatchEvent(new Event("info"))
    });
    this._root.querySelector("#username").addEventListener("click", () => this.dispatchEvent(new Event("username")));
  }

  connectedCallback() {
    let links = this._root.querySelectorAll("#menu li");
      links.forEach((e,i) => {
      e.tabindex = String(10 + i);
    });
  }

  get info() { return this._info; }

  static get observedAttributes() {
    return ["username", "heading", "menu", "info", "crumb"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this._root.querySelector("#" + name).innerHTML = newValue;
  }
}

window.customElements.define("home-bar", HomeBar);