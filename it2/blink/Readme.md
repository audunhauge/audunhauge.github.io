## Install

* sudo npm install -g babel-cli
* echo '{"plugins": ["transform-flow-strip-types"]}' > .babelrc
* sudo npm install -g babel-plugin-transform-flow-strip-types
* babel --watch=./src --out-dir=.

* sudo npm install -g flow-bin
* npm install babel-preset-es2017
* echo '{"name": "get_started", "scripts": {"flow": "flow; test $? -eq 0 -o $? -eq 2"}}' > package.json
* touch .flowconfig
* flow init

I vs-code må du gjøre følgende:
   code -> preferences -> settings
      "javascript.validate.enable": false,
     "flow.path" : "/usr/local/bin/flow"
(gitt at   which flow   sier /usr/local ... )
 
Du må også installere flow som en extension
  søk på vscode-flow og installer
 
Du må også ofte ta omstart på vscode
og slå av andre lintere (slik som jshint)
