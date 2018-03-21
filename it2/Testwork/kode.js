function setup() {
    Test.summary();
}


function add(a,b) {
    return a+b;
}

function mult(a,b) {
    return a*b;
}

function box(a) {
    return [a];
}


expect(mult,3,4).to.be(12);
expect(add,3,4).to.be(7);
expect(box,12).to.have(0).eq(12);
expect(box,12).to.have("length").eq(1);
expect(box,12).to.have("length").defined;

expect(add,1,2).to.looklike("3");
expect(add,0.1,0.2).to.approx(0.3);
expect(add,101,203).to.approx(300,10);