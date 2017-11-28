function setup() {
    let canvas = document.getElementById('tegning');
    let ctx = canvas.getContext('2d');
    let xpos = 0;
    let vx = 2;
    /**
     * Tegner en figur
     * @param {context} ctx - tegneområdet
     * @param {number} dx - avstand fra v.kant 
     */
    function figur(ctx, dx) {
        ctx.beginPath();
        ctx.fillStyle = 'rgb(200,0,0)';
        ctx.arc(dx + 100, 375, 30, 0, 2 * Math.PI);
        ctx.stroke();
    }
    function tegn() {
        ctx.clearRect(0,0,500,500);
        figur(ctx, xpos);
        xpos += vx;
        if (xpos > 500) {
          vx = -2;
        }
    }
    setInterval(tegn,40);
}