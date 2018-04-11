// @flow
const results = [];
const PASS = '<span style="color:green">PASSED</span> ';
const FAIL = '<span style="color:red">FAILED</span> ';
const MSG_ = '<span style="color:blue">';
const _MSG = '</span> ';

class Test {
  constructor(fu, args) {
    this.fu = typeof fu === "function" ? fu(...args) : fu;
    this.name = fu.name || typeof fu;
    this.args = args;
    this.alive = true;
    this.msg = "";
    this.val = undefined;
    this.not = false;
  }

  get is() {
    this.msg += " is";
    return this;
  }
  get it() {
    this.msg += ". It";
    return this;
  }

  a(type) {
    if (!this.alive) return this;
    if (typeof this.val === type) {
      results.push(
        PASS + this.name + "(" + this.args + ")" + this.msg + " a " + type
      );
    } else {
      results.push(
        FAIL + this.name + "(" + this.args + ")" + this.msg + " not a " + type
      );
    }
  }

  get to() {
    return this;
  }

  be(val) {
    if (!this.alive) return this;
    if (this.name === "string") {
      results.push(MSG_ + this.fu + _MSG);
      return;
    }
    if (this.fu === val || this.val === val) {
      results.push(
        PASS + this.name + "(" + this.args + ")" + this.msg + " equal " + val
      );
    } else {
      results.push(
        FAIL + this.name + "(" + this.args + ")" + this.msg + " not equal " + val
      );
    }
  }

  get defined() {
    if (!this.alive) return this;
    log(this.val !== undefined, this, "", ".defined");
  }

  eq(val) {
    return this.be(val);
  }

  looklike(val) {
    if (!this.alive) return this;
    log(this.fu == val, this, " looks like ", val);
  }

  approx(val, epsilon = Number.EPSILON) {
    if (!this.alive) return this;
    log(Math.abs(this.fu - val) < epsilon, this, " ≃ ", val + " ±" + epsilon);
  }

  gt(val) {
    if (!this.alive) return this;
    log(this.fu > val, this, ">", val);
  }

  lt(val) {
    if (!this.alive) return this;
    log(this.fu < val, this, "<", val);
  }

  have(values) {
    if (!this.alive) return this;
    let p, present, msg;
    if (typeof values === "string") {
      // sjekk om vi har .. expect(fu,1,2).to.have("cells.length").eq(12)
      // values er her "cells.length" - splitter på punktum
      let vlist = values.split(".");
      p = this.fu;
      msg = " has " + values;
      present = vlist.every(e => p[e] !== undefined ? (p = p[e], true) : false);
    } else {
      p = this.fu[values];
      present = p !== undefined;
      msg = " has [" + values + "]";  // most likely a numeric index
    }
    if (present) {
      this.msg += msg;
      this.val = p;
      return this;
    } else {
      results.push(FAIL + this.name + "(" + this.args + ") does not have " + values);
      this.alive = false;
      return this;
    }
  }

  static summary(selector = "body") {
    let div = document.createElement("div");
    div.innerHTML = results.map(e => "<div>" + e + "</div>").join("");
    let body = document.querySelector(selector);
    body.appendChild(div);
  }
}

function log(test, obj, logick, val) {
  if (test) {
    results.push(
      PASS + obj.name + "(" + obj.args + ")" + logick + obj.msg + val
    );
  } else {
    results.push(
      FAIL + obj.name + "(" + obj.args + ")" + "!" + logick + obj.msg + val
    );
  }
}

function expect(fu, ...args) {
  return new Test(fu, args);
}
