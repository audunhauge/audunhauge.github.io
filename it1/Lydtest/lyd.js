function setup() {
    let lyd = document.getElementById("lyd");
    setTimeout( () => {
        console.log("hei");
        lyd.play()
    }, 500);
}