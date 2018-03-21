class Test {
    constructor(selector) {
        this.selector = selector;
        this.good = [];
        this.bad = [];
    }

    assert(test, msg) {
        if (test) {
            this.good.push(msg);
        } else {
            this.bad.push(msg);
        }
    }

    display() {
        let target= document.querySelector(this.selector);
        if (this.selector && target) {
            let txtGood = this.good.map(e => '<div><span style="color:green">Passed</span> ' + e + '</div>').join("");
            let txtBad = this.bad.map(e => '<div><span style="color:red">Failed</span> ' + e + '</div>').join("");
            let div = document.createElement("div");
            div.innerHTML = txtGood + txtBad;
            target.appendChild(div);
        } else {
           this.good.map(e => console.log("%cPassed","color:green",e));
           this.bad.map(e => console.log("%cFailed","color:red",e));
        }
    }
}