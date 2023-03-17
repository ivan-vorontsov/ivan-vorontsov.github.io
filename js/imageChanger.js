function ImageChanger(images){
    this.m_images = images;
    this.m_idx = [];
    for (let i = 0; i < images.length; i++) {
        this.m_idx.push(i);
    }
    this.PERIOD = null;
    this.m_duration = null;
    this.m_position = null;
    this.m_width = null;
    this.m_opacity = 1;
    this.m_flag = false;
}

ImageChanger.prototype.handleInput = function() {
    if (pointer.check()) {
        let v = {
            x: mousePosition.x - this.m_position.x,
            y: mousePosition.y - this.m_position.y
        };
        if (Math.sqrt(v.x * v.x + v.y * v.y) < this.m_width / 2) {
            pointer.reset();
            this.m_flag = true;
        }
    }
}

ImageChanger.prototype.update = function(elapsed) {
    let dOp = elapsed / this.PERIOD;
    this.m_opacity -= dOp;
    this.m_duration -= elapsed;
    if (this.m_duration <= 0){
        this.m_idx.push(this.m_idx.shift());
        this.m_duration = this.PERIOD;
        this.m_opacity = 1;
    }
}

ImageChanger.prototype.render = function(ctx) {
    ctx.save();
    ctx.translate(this.m_position.x, this.m_position.y);

    ctx.beginPath();
    ctx.arc(0, 0, this.m_width / 2, 0, 2 * Math.PI, false);
    ctx.clip();

    this.draw(ctx, this.m_images[this.m_idx[0]], this.m_opacity);
    this.draw(ctx, this.m_images[this.m_idx[1]], 1 - this.m_opacity);
    

    ctx.restore();
}

ImageChanger.prototype.draw = function(ctx, img, opacity) {
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.drawImage(img,
        0,
        0,
        img.width,
        img.height,
        -this.m_width * 0.5,
        -this.m_width * 0.5,
        this.m_width,
        this.m_width
    );
    ctx.restore();
}

ImageChanger.prototype.setPosition = function (x, y) {
    this.m_position = {x : x, y : y};
}

ImageChanger.prototype.check = function() {
    if (this.m_flag) {
        this.m_flag = false;
        return true;
    }
    return false;
}

ImageChanger.prototype.setWidth = function (x) {
    this.m_width = x;
}

ImageChanger.prototype.setDuration = function (x) {
    this.PERIOD = this.m_duration = x;
}
