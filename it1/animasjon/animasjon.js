function setup() {
    let kaktus = document.getElementById("kaktus");
    animerKaktus();
    
    function animerKaktus() {
        kaktus.classList.toggle("ut");
        setTimeout(animerKaktus, 9200);
    }

}