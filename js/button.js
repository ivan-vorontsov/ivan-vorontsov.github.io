function Button(){
    this.m_position = null;
    this.m_width = null;
    this.m_height = null;
    this.m_color = "white";
    this.m_background = "black";
    this.m_flag = false;
    this.m_txt = null;
    this.m_fontSize = null;
}

Button.prototype.handleInput = function() {
    if (pointer.check() && mousePosition.x > this.m_position.x - this.m_width / 2 
            && mousePosition.x < this.m_position.x + this.m_width / 2
            && mousePosition.y > this.m_position.y - this.m_height / 2 
            && mousePosition.y <  this.m_position.y + this.m_height / 2) {
            this.m_flag = true;
    }
}

Button.prototype.update = function(elapsed) {

}

Button.prototype.render = function(ctx) {
    ctx.save();
    ctx.translate(this.m_position.x, this.m_position.y);
    ctx.fillStyle = this.m_background;
    ctx.fillRect(-this.m_width / 2, -this.m_height / 2, this.m_width, this.m_height);

    ctx.font = this.m_fontSize  + "px toontime";
    let len = ctx.measureText(this.m_txt).width;
    ctx.fillStyle = this.m_color;

    let maxWidth = Math.min(this.m_width, len);
    ctx.fillText(this.m_txt, - maxWidth / 2, 0, maxWidth);

    ctx.restore();
}

Button.prototype.check = function() {
    if (this.m_flag){
        this.m_flag = false;
        return true;
    }
    return false;
}

Button.prototype.setText = function(text) {
    this.m_txt = text;
}

Button.prototype.setWidth = function(x) {
    this.m_width = x;
}

Button.prototype.setHeight = function(x) {
    this.m_height = x;
}

Button.prototype.setPosition = function(x, y) {
    this.m_position = {
        x : x,
        y : y
    };
}

Button.prototype.setFontSize = function(x) {
    this.m_fontSize = x;
}