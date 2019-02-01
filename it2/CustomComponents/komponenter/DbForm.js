// @ts-check

(function() {
    const template = document.createElement('template');
  
    template.innerHTML = `
        <style>
        .heading {
            color: green;
            border: solid red 3px;
        }
        form {
            position: relative;
            width: 35em;
            max-width: 85%;
            padding: 5px;
            border-radius: 5px;
            border: solid gray 1px;
            background-color: gainsboro;
            margin-top: 1em;
        }
        
        form > label {
            display: grid;
            grid-template-columns: 7fr 4fr;
            margin: 5px;
            padding: 5px;
            border-radius: 5px;
            border: solid gray 1px;
            background-color: whitesmoke;
        }
        
        form::after {
            color:blue;
            content: "Registrering";
            position: absolute;
            right: 20px;
            top: -20px;
        }
        
        #lagre {
            background-color: antiquewhite;
        }
        </style>
        <form>
          <div class="heading"><slot name="heading"></slot></div>
          
        </form>
    `;
  
    class DBForm extends HTMLElement {
      constructor() {
        super();
  
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
      }
    }
  
    window.customElements.define('db-form', DBForm);
  })();