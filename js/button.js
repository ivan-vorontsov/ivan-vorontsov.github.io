function Button(text, x = 0, y = 0, width = 60, height = 40, font = "30px puzzler",
    color = "white", hoverBackground = "darkgrey", pressBackground = "lightgray",
    normalBackground = "black") {
    this.text = text;
    this._x = x;
    this._y = y;
    this.width = width;
    this.height = height;
    this.hover = false;
    this.pressed = false;
    this.clicked = false;
    this.fillStyle = undefined;
    this.timer = 0;
    this.font = font;
    this.color = color;
    this.hoverBackground = hoverBackground;
    this.pressBackground = pressBackground;
    this.normalBackground = normalBackground;
    this.parent = null;
}

Button.prototype.render = function(ctx) {
    ctx.save();
    ctx.translate(this._x * APP.scaleX, this._y * APP.scaleY);
    ctx.fillStyle = this.fillStyle;
    ctx.fillRect(0, 0, this.width * APP.scaleX, this.height * APP.scaleY);
    ctx.fillStyle = this.color;
    let fontSize = parseFloat(this.font.split(' ')[0]);
    fontSize = fontSize * APP.scaleY;
    ctx.font = fontSize + "px " + this.font.split(' ')[1];
    ctx.textBaseline = "top";
    let dx = 0, dy = 0,
        textWidth = ctx.measureText(this.text).width,
        textHeight = ctx.measureText("M").width;
    dx = this.width * APP.scaleX / 2 - textWidth / 2;
    dy = this.height * APP.scaleY / 2 - textHeight / 2;
    ctx.fillText(this.text, dx, dy);
    ctx.restore();
}

Button.prototype.update = function() {
    if (this.hover) {
        this.fillStyle = this.hoverBackground;
    } else if (this.pressed) {
        this.fillStyle = this.pressBackground;
    } else {
        this.fillStyle = this.normalBackground;
    }
}

Button.prototype.handleInput = function() {
    this.clicked = false;
    let mx = mousePosition.x,
        my = mousePosition.y;
    if (this.x < mx && this.x + this.width > mx
        && this.y < my && this.y + this.height > my) {
        if (!isTouchDevice) {
            this.hover = true;
        }
        if (mousePressed) {
            this.hover = false;
            this.pressed = true;
            if (this.timer === 0) {
                this.timer = new Date();
            }
        } else {
            if (this.pressed) {
                let dt = new Date() - this.timer;
                if (dt < 200) {
                    this.clicked = true;
                }
                this.timer = 0;
                this.pressed = false;
            }
        }
    } else {
        this.hover = false;
        this.pressed = false;
    }
}

Object.defineProperty(Button.prototype, 'x', {
    get: function() {
        if (!this.parent) return this._x;
        return this.parent.x + this._x;
    }
});

Object.defineProperty(Button.prototype, 'y', {
    get: function() {
        if (!this.parent) return this._y;
        return this.parent.y + this._y;
    }
});
