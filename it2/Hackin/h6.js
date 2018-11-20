// @ts-check


const init = `EvieOOcbtyrvi0.qnAo{vAh(>-/=n|ihh47+vi3u/n|xie/<((.h=<.+J.:<R)-3vi3w5C/CU62>OEnyo|pvUnA]0v~nAh53E)E.dh860DJ)?+PBqnhviop+)0(lsou{n,E.|{iŝſƇŋ­żŉƧÂ¾Ʀƌ¹œŸ¿ŤƃŝſƇƣ°¹ƓºƇÂƧōÃº¹Ƈ­ƈºÂÂ»¬ƊÂſƔ¾±ƌŝqu{nbbVfqlsD`;

function setup() {
    let inpPwd = document.getElementById("pwd");
    let divHack = document.getElementById("main");
    inpPwd.addEventListener("keydown", (e) => {
        if (e.keyCode === 13) {
            let p = inpPwd.value;
            render(p);
        }
    })

    function render(p) {
       let xx = init.split('').map((e,i) => String.fromCharCode(( (e.charCodeAt(0)-40) ^ p[i % p.length].charCodeAt(0) )  )).join("")
       try {
          let mu;
          eval("mu = " + xx);
          let msg = mu.fu(mu.msg);
          divHack.innerHTML = msg;
       } catch(e) {
           console.log(e.message);
       }
    }

}