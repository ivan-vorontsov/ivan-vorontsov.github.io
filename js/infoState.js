function InfoState(app,canvas, images) {
    AppState.call(this, app, canvas);
    this.m_fusser = new ImageChanger(images);
    this.m_fusser.setDuration(1 / 2);
    this.m_button = new Button();
    this.m_button.setText("Viszlát!");
    this.resize();
}

InfoState.prototype = Object.create(AppState.prototype);

InfoState.prototype.handleInput = function() {
    this.m_button.handleInput();
};

InfoState.prototype.update = function(elapsed) {
    if (this.m_button.check()){
        this.m_app.goToIndex();
    } else if (POINTER.tapped){
        POINTER.tapped = false;
        toggleFullscreeen();
    }

    this.m_fusser.update(elapsed);
};

InfoState.prototype.render = function(ctx) {
    ctx.fillStyle = 'navy';
    ctx.fillRect(0, 0, this.m_canvas.width, this.m_canvas.height);
    this.drawText(ctx, "Ez én vagyok,", 
        {x: this.m_canvas.width / 2, y : .15 * this.m_canvas.height}, 
        this.m_canvas.width / 12, "toontime");
    this.drawText(ctx, "És oly boldog vagyok!", 
        {x: this.m_canvas.width / 2, y : .24 * this.m_canvas.height},
        this.m_canvas.width / 12, "toontime");

    this.drawText(ctx, "email: fiat-tactile.0g@icloud.com", 
        {x: this.m_canvas.width / 2, y : .7 * this.m_canvas.height},
        this.m_canvas.width / 14, "md");
    this.drawText(ctx, "tel: nincs, ezért boldog vagyok", 
        {x: this.m_canvas.width / 2, y : .78 * this.m_canvas.height},
        this.m_canvas.width / 14, "md");

    this.m_fusser.render(ctx);
    this.m_button.render(ctx);
};

InfoState.prototype.drawText = function(ctx, txt, pos, fontSize, font) {
    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.font = fontSize + "px " + font;
    let len = ctx.measureText(txt).width;
    ctx.fillStyle = "orange";

    maxWidth = Math.min(this.m_canvas.width * 3 / 4, len);
    ctx.fillText(txt, - maxWidth / 2, 0, maxWidth);
    ctx.restore();
}

InfoState.prototype.resize = function() {
    this.m_fusser.setPosition(this.m_canvas.width / 2, .45 * this.m_canvas.height);
    this.m_fusser.setWidth(this.m_canvas.width / 3);
    this.m_button.setFontSize(this.m_canvas.width / 16);
    this.m_button.setPosition(this.m_canvas.width / 2, 7 * this.m_canvas.height / 8);

    this.m_button.setWidth(this.m_canvas.width / 6);
    this.m_button.setHeight(this.m_canvas.width / 15);
};