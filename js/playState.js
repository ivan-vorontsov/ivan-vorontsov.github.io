function ImageButton(images) {
    ImageChanger.call(this, images);
    this.m_background = 'transparent';
    this.m_flag = false;
}

ImageButton.prototype = Object.create(ImageChanger.prototype);

ImageButton.prototype.handleInput = function() {
    if (POINTER.tapped) {
        let v = {
            x: POINTER.x - this.m_position.x,
            y: POINTER.y - this.m_position.y
        };
        if (Math.sqrt(v.x * v.x + v.y * v.y) < .6 * this.m_width) {
            POINTER.tapped = false;
            this.m_flag = true;
        }
    }
}

ImageButton.prototype.render = function(ctx) {
    ctx.save();
    ctx.translate(this.m_position.x, this.m_position.y);

    ctx.beginPath();
    ctx.arc(0, 0, .55 * this.m_width, 0, 2 * Math.PI, false);
    ctx.fillStyle = this.m_background;
    ctx.fill();
    ctx.restore();

    ImageChanger.prototype.render.call(this, ctx);
}

ImageButton.prototype.check = function() {
    if (this.m_flag) {
        this.m_flag = false;
        return true;
    }
    return false;
}

ImageButton.prototype.setBackground = function (color) {
    this.m_background = color;
}

function PlayState(app,canvas) {
    AppState.call(this, app, canvas);
    this.backgrounds = ['green', 'red', 'yellow', '#571A99'];
    this.backgroudOpacities = [.8, .8, .8, .8];
    this.alphaCurve = {
        points: [],
        side: null
    };

    this.betaCurve = {
        points: [],
        side: null
    };

    this.alpha = new Alpha(0, 0, 1 / 2, 0);
    this.beta = new Beta(0, 0, 1 / 3, 2 * Math.PI / 3);
    this.m_button = new ImageButton(faces);
    this.m_button.setDuration(1);
    this.m_button.setBackground('571A99');
    this.resize();
}

PlayState.prototype = Object.create(AppState.prototype);

PlayState.prototype.handleInput = function() {
    this.m_button.handleInput();
}

PlayState.prototype.update = function(elapsed) {
    
    if (this.m_button.check()) {
        this.m_app.goToInfo();        
    }
    else if (POINTER.tapped) {
        toggleFullscreeen();
        POINTER.tapped = false;
    }

    this.m_button.update(elapsed);

    let phi =  elapsed * Math.PI / 3;
    let phiA = phi; 
    let oAlpha = {x : 0, y : this.m_canvas.height / 2};
    
    this.alpha.addPhase(phiA);
    this.alphaCurve.points = this.alpha.set(oAlpha);


    let phiB = phi; 
    let oBeta = {x : this.m_canvas.width / 2, y : 0};
    this.beta.addPhase(phiB);
    this.betaCurve.points = this.beta.set(oBeta);

    let p = this.alphaCurve.points[0];
    let t = this.beta.t(p.y, oBeta);
    let T = this.beta.T(t);
    let q = this.beta.value(t, oBeta);
    let S = {x : p.x - q.x, y: p.y - q.y};
    let cross0 = S.x * T.y - S.y * T.x;
    for (let i = 1; i < this.alphaCurve.points.length; i++) {
        p = this.alphaCurve.points[i];
        t = this.beta.t(p.y, oBeta);
        T = this.beta.T(t);
        q = this.beta.value(t, oBeta);
        S = {x : p.x - q.x, y: p.y - q.y};
        let cross = S.x * T.y - S.y * T.x;
        if (cross * cross0 <= 0) 
        {
            this.alphaCurve.side = i - 1;
            break;
        } 
    }

    p = this.betaCurve.points[0];
    t = this.alpha.t(p.x, oAlpha);
    T = this.alpha.T(t);
    q = this.alpha.value(t, oAlpha);
    S = {x : p.x - q.x , y: p.y - q.y};
    cross0 = S.x * T.y - S.y * T.x;
    for (let i = 1; i < this.betaCurve.points.length; i++) {
        p = this.betaCurve.points[i];
        t = this.alpha.t(p.x, oAlpha);
        T = this.alpha.T(t);
        q = this.alpha.value(t, oAlpha);
        S = {x : p.x - q.x, y: p.y - q.y};
        let cross = S.x * T.y - S.y * T.x;
        if (cross * cross0 <= 0) 
        {
            this.betaCurve.side = i - 1;
            break;
        } 
    }
}

PlayState.prototype.drawTile = function(ctx, idx, alphapoints, alpha0, alphaN, alphaStep,
                                            betapoints, beta0, betaN, betaStep, cornerx, cornery) {
    ctx.beginPath();
    ctx.moveTo(alphapoints[alpha0].x, alphapoints[alpha0].y);

    let i;

    for (i = alpha0 + alphaStep; i != alphaN - alphaStep; i += alphaStep) {
        ctx.lineTo(alphapoints[i].x, alphapoints[i].y);
    }

    for (i = beta0; i != betaN; i += betaStep) {
        ctx.lineTo(betapoints[i].x, betapoints[i].y);
    }

    ctx.lineTo(cornerx, cornery);

    ctx.lineTo(alphapoints[alpha0].x, alphapoints[alpha0].y);

    ctx.fillStyle = this.backgrounds[idx];
    ctx.fill();
}

PlayState.prototype.drawCurve = function(ctx, points, l, r, step) {
    ctx.save();
    ctx.lineWidth = 2 * this.m_app.getLineWidth();
    ctx.strokeStyle = 'black';

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    let skip = false;
    for(let i = l + 1; i < r; i++) {
        if (i % step === 0) {
            skip = !skip;
        }
        if (!skip) ctx.lineTo(points[i].x, points[i].y);
        else ctx.moveTo(points[i].x, points[i].y);
    }

    ctx.stroke();

    ctx.restore();
} 

PlayState.prototype.render = function(ctx) {
    ctx.lineWidth = .1 * this.m_app.getLineWidth();
    let idx = 0;
    

    this.drawTile(ctx, idx++, this.alphaCurve.points, 0, this.alphaCurve.side, 1, this.betaCurve.points,
        this.betaCurve.side, -1, -1, 0, 0);

    this.drawTile(ctx, idx++, this.betaCurve.points, 0, this.betaCurve.side, 1, 
        this.alphaCurve.points, this.alphaCurve.side, this.alphaCurve.points.length, 1, this.m_canvas.width, 0);

    this.drawTile(ctx, idx++, this.betaCurve.points, this.betaCurve.points.length - 1, this.betaCurve.side + 1, -1, 
        this.alphaCurve.points, this.alphaCurve.side + 1, this.alphaCurve.points.length, 1, this.m_canvas.width, this.m_canvas.height);

    this.drawTile(ctx, idx, this.alphaCurve.points, 0, this.alphaCurve.side, 1, 
        this.betaCurve.points, this.betaCurve.side, this.betaCurve.points.length, 1, 0, this.m_canvas.height);

    this.drawCurve(ctx, this.alphaCurve.points, 0, this.alphaCurve.points.length, 10);
    this.drawCurve(ctx, this.betaCurve.points, 0, this.betaCurve.points.length, 10);

    this.m_button.render(ctx);
}

PlayState.prototype.resize = function() {
    let alphaA = this.m_canvas.width, alphaB = this.m_canvas.height / 12;
    let  betaA = this.m_canvas.height, betaB = this.m_canvas.width / 12;
        
    this.alpha.a = alphaA; 
    this.alpha.b = alphaB;
    this.beta.a = betaA; 
    this.beta.b = betaB;

    this.m_button.setWidth(.2 * this.m_canvas.width);
    this.m_button.setPosition(.8 * this.m_canvas.width, .8 * this.m_canvas.height);
}