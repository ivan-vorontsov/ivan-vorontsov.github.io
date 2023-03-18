function makeCanvas() {
    let canvas = document.createElement("canvas");
    let appArea = document.querySelector("#appArea");
    canvas.context = canvas.getContext("2d");
    canvas.setAttribute('id', 'appCanvas');
    appArea.appendChild(canvas);
    return canvas;
}

function Clicker(){
    this.m_flag = false;
}

Clicker.prototype.set = function(){
    this.m_flag = true;
}

Clicker.prototype.reset = function(){
    this.m_flag = false;
}

Clicker.prototype.check = function() {
    if (this.m_flag) {
        this.m_flag = false;
        return true;
    }
    return false;
}

let pointer = new Clicker();

function AppState(app, canvas){
    this.m_app = app;
    this.m_canvas = canvas;
}

AppState.prototype.handleInput = function() {
    throw new Error();
};

AppState.prototype.update = function(elapsed) {
    throw new Error();
};

AppState.prototype.render = function(ctx) {
    throw new Error();
};

AppState.prototype.resize = function() {
    throw new Error();
};

let canvas, APP, t0, POINTER;

let faces = [];


function loadimage(path) {
    loadimage.imagesLoading++;
    let image = new Image();
    image.onload = () => {
        loadimage.imagesLoading--;
    };
    image.src = './images/' + path;
    return image;
}

loadimage.imagesLoading = 0;


window.addEventListener('load', () => {

    for (let i = 11; i <= 14; i++) {
        faces.push(loadimage('face_' + i + ".jpeg"));
    }

    imageLoadingLoop();
});

function imageLoadingLoop() {

    if (loadimage.imagesLoading > 0) {
        requestAnimationFrame(imageLoadingLoop);
    }
    else {
        canvas = makeCanvas();
        APP = new App_Singleton(1280, 1280);
        
        APP.resize();

        POINTER = new Pointer(canvas);

        appLoop();
    }
}

function appLoop(elapsed) {
    requestAnimationFrame(appLoop);

    let t = (elapsed - t0) * 0.001;
    t0 = elapsed;

    if (t > 0.2) {
        return;
    }

    APP.handleInput();

    APP.update(t || 0);

    APP.render(canvas.context);
}


function toggleFullscreeen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}
