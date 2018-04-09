// @flow
const results = [];
const PASS = '<span style="color:green">PASSED</span> ';
const FAIL = '<span style="color:red">FAILED</span> ';

class Test {
  constructor(fu, args) {
    this.fu = fu;
    this.args = args;
    this.alive = true;
    this.msg = "";
    this.val = undefined;
    this.not = false;
  }

  get to() {
    return this;
  }

  be(val) {
    if (!this.alive) return this;
    if (this.fu(...this.args) === val || this.val === val) {
      results.push(
        PASS + this.fu.name + "(" + this.args + ")" + this.msg + " === " + val
      );
    } else {
      results.push(
        FAIL + this.fu.name + "(" + this.args + ")" + this.msg + " !== " + val
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
    log(this.fu(...this.args) == val, this, " looks like ", val);
  }

  approx(val, epsilon = Number.EPSILON) {
    if (!this.alive) return this;
    log(Math.abs(this.fu(...this.args) - val) < epsilon, this, " ≃ ", val + " ±"+epsilon);
  }

  gt(val) {
    if (!this.alive) return this;
    log(this.fu(...this.args) > val, this, "<", val);
  }

  lt(val) {
    if (!this.alive) return this;
    log(this.fu(...this.args) < val, this, "<", val);
  }

  have(val) {
    if (!this.alive) return this;
    if (this.fu(...this.args)[val] !== undefined) {
      this.msg += ".has." + val;
      this.val = this.fu(...this.args)[val];
      return this;
    } else {
      results.push(FAIL + this.fu.name + "(" + this.args + ") ! has." + val);
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
      PASS + obj.fu.name + "(" + obj.args + ")" + logick + obj.msg + val
    );
  } else {
    results.push(
      FAIL + obj.fu.name + "(" + obj.args + ")" + "!" + logick + obj.msg + val
    );
  }
}

function expect(fu, ...args) {
  return new Test(fu, args);
}
