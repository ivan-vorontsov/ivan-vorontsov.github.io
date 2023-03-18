
function Pointer(element){
    this.isDown = false;
    this.isUp = true;
    this.tapped = false;
    this.m_x = 0;
    this.m_y = 0;
    this.downTime = 0;
    this.elapsedTime = 0;

    element.addEventListener('mousemove', this.moveHandler.bind(this), false);
    element.addEventListener('mousedown', this.downHandler.bind(this), false);
    window.addEventListener('mouseup', this.upHandler.bind(this), false);
    element.addEventListener('touchmove', this.touchmoveHandler.bind(this), false);
    element.addEventListener('touchstart', this.touchstartHandler.bind(this), false);
    window.addEventListener('touchend', this.touchendHandler.bind(this), false);

    element.style.touchAction = 'none';
}

Pointer.prototype.downHandler = function(evt) {
    this.isDown = true;
    this.isUp = false;
    this.tapped = false;

    this.downTime = Date.now();
    evt.preventDefault();
}

Pointer.prototype.upHandler = function(evt) {
    this.elapsedTime = Math.abs(this.downTime - Date.now());
    if (this.elapsedTime <= 200 && this.tapped === false) {
        this.tapped = true;
    }

    this.isDown = false;
    this.isUp = true;

    evt.preventDefault();
}

Pointer.prototype.moveHandler = function(evt) {
    let el = evt.target.getBoundingClientRect();
    
    this.x = (evt.pageX - el.left);
    this.y = (evt.pageY - el.top);

    evt.preventDefault();
}

Pointer.prototype.touchmoveHandler = function(evt) {
    let el = evt.target.getBoundingClientRect();
    
    this.x = (evt.targetTouches[0].pageX - el.left);
    this.y = (evt.targetTouches[0].pageY - el.top);

    evt.preventDefault();
}

Pointer.prototype.touchstartHandler = function(evt) {
    let el = evt.target.getBoundingClientRect();

    
    this.x = (evt.targetTouches[0].pageX - el.left);
    this.y = (evt.targetTouches[0].pageY - el.top);

    this.isDown = true;
    this.isUp = false;
    this.tapped = false;

    this.downTime = Date.now();

    evt.preventDefault();
}

Pointer.prototype.touchendHandler = function(evt) {
    this.elapsedTime = Math.abs(this.downTime - Date.now());
    if (this.elapsedTime <= 200 && this.tapped === false) {
        this.tapped = true;
    }

    this.isDown = false;
    this.isUp = true;

    evt.preventDefault();
}