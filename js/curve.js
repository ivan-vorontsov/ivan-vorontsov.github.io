function Curve(a, b, c, p) {
    this.a = a; //canvas.width;
    this.b = b; //canvas.width / 8;
    this.c = c; //4 / 5.0;
    this.phase = p;
    this.forward = true;
}

Curve.prototype.addPhase = function(x) {
    if (this.forward) x *= -1;
    this.phase += x;
     if (this.phase > 2 * Math.PI)
        this.phase = 0;
}

Curve.prototype.reverse = function() {
    this.forward = !this.forward;
}

Curve.prototype.value = function(t, origin) {
    throw new Error();
}

Curve.prototype.set = function(origin){
    let points = [];
    let step = 1.00 / 1000;
    for (let t = 0; t <= 1 + step; t += step)
    {
        points.push(this.value(t, origin));
    }
    return points;
}

function Alpha(a, b, c, p) {
    Curve.call(this, a, b, c, p);
}

Alpha.prototype = Object.create(Curve.prototype);

Alpha.prototype.value = function(t, origin) {
    return {x : origin.x + this.a * t, y : origin.y + this.b * Math.sin(2 * Math.PI * this.c * t + this.phase)}
}

Alpha.prototype.t = function (x, origin) {
    return (x - origin.x) / this.a;
}

Alpha.prototype.T = function(t) {
    let x = this.a;
    let y = this.b * 2 * Math.PI * this.c * Math.sin(2 * Math.PI * this.c * t + this.phase);
    let norm = Math.sqrt(x * x + y * y);
    return {x : x / norm, y : y / norm};
}

function Beta(a, b, c, p) {
    Curve.call(this, a, b, c, p);
}

Beta.prototype = Object.create(Curve.prototype);

Beta.prototype.value = function(t, origin) {
    return {x : origin.x + this.b * Math.cos(2 * Math.PI * this.c * t + this.phase), y : origin.y + this.a * t};
}

Beta.prototype.t = function (y, origin) {
    return (y - origin.y) / this.a;
}

Beta.prototype.T = function(t) {
    let x = -this.b * 2 * Math.PI * this.c * Math.sin(2 * Math.PI * this.c * t + this.phase);
    let y = this.a;
    let norm = Math.sqrt(x * x + y * y);
    return {x : x / norm, y : y / norm};
}