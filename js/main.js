function makeCanvas() {
    let canvas = document.createElement("canvas");
    let appArea = document.querySelector("#appArea");
    canvas.context = canvas.getContext("2d");
    canvas.setAttribute('id', 'appCanvas');
    appArea.appendChild(canvas);
    return canvas;
}

// ------------

let canvas, radius, offset, step = 5, positions = [], A = 55, D, k = 0.001,
    omega = 1, phi = 1, p = 0.0005, starPositions = [], scales = [],
    dencity = 400, _scaleMax = 1, _scaleStep = 0.05, menuButton, image, imageWidth, pan = 1, APP,
    text = "Ivan Vorontsov - Web Developer / Game Designer", menu, toggleFullscreenButton, adminButton;

window.addEventListener('load', () => {
    image = new Image();
    image.onload = () => {
        canvas = makeCanvas();
        APP = new App_Singleton(591, 1280);
        APP.onresize = onResize;
        onResize();
        for (let i = 0; i < dencity; i++) {
            starPositions.push(createRandomPosition(canvas));
            scales.push(0);
        }
        /*menuButton = new Button("+", 30, 30, 50, 50, "30px puzzler", "black", "lightgrey", "darkgrey", "white");
        menu = new Menu(15, 81);
        toggleFullscreenButton = new Button("+- Fullscreen", 0, 0, 250, 30, "14px puzzler", "black", "lightgrey", "darkgrey", "white");
        menu.addItem(toggleFullscreenButton);
        adminButton = new Button("Admin", 0, 31, 250, 30, "14px puzzler", "black", "lightgrey", "darkgrey", "white");
        menu.addItem(adminButton);
        menu.addItem(new Button("Dummy 2", 0, 62, 250, 30, "14px puzzler", "black", "lightgrey", "darkgrey", "white"));*/
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchend', handleTouchEnd);
        appLoop();
    };
    image.src = "./images/IMG_1232.jpg";
});

function onResize() {
    let appArea = document.querySelector("#appArea");
    appArea.style.width = APP.width + "px";
    appArea.style.height = APP.height + "px";
    if (window.innerWidth > APP.width) {
        let margin = (window.innerWidth - APP.width) / 2;
        appArea.style.marginLeft = margin + 'px';
        appArea.style.marginRight = margin + 'px';
        appArea.style.marginTop = 0 + 'px';
        appArea.style.marginBottom = 0 + 'px';
    } else {
        let margin = (window.innerHeight - APP.height) / 2;
        appArea.style.marginTop = margin + 'px';
        appArea.style.marginBottom = margin + 'px';
        appArea.style.marginLeft = 0 + 'px';
        appArea.style.marginRight = 0 + 'px';
    }
    canvas.width = APP.width;
    canvas.height = APP.height;
    radius = Math.max(canvas.width, canvas.height) / 180;
    offset = canvas.width / 16;
    D = canvas.height / 2;
    A = A * APP.scaleY;
    imageWidth = canvas.width / 5;
}

function appLoop(elapsed) {
    requestAnimationFrame(appLoop);

    positions = [];

    for (let x = 0; x <= canvas.width; x += step) {
        let t = elapsed * 0.001;
        let y = sineWave(x, t);
        positions.push([x, y]);
    }

    handleInput();

    update(elapsed);

    render(canvas.context, elapsed * 0.001);
}

function render(ctx, t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "blue";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(positions[0][0], positions[0][1]);
    for (let i = 1; i < positions.length; i++) {
        ctx.lineTo(positions[i][0], positions[i][1]);
    }
    ctx.lineTo(canvas.width, 0);
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.fill();

    for (let i = 0; i < scales.length; i += 1) {
        let scale = scales[i];
        if (scales[i] > _scaleMax) {
            scale = _scaleMax * 2 - scales[i];
        }
        let pos = starPositions[i];
        if (pos.y < sineWave(pos.x, t)) {
            ctx.fillStyle = "white";
        } else {
            ctx.fillStyle = "blue";
        }
        drawStar(pos, scale, ctx);
    }

    //menuButton.render(ctx);
    renderImage(ctx);
    renderText(ctx);
    //menu.render(ctx);
}

function handleInput() {
    //menuButton.handleInput();

    /*if (menuButton.clicked) {
        if (soundBuffer) {
            let soundNode = actx.createBufferSource();
            let volumeNode = actx.createGain();
            let panNode = actx.createStereoPanner();

            soundNode.buffer = soundBuffer;

            soundNode.connect(volumeNode);
            volumeNode.connect(panNode);
            panNode.connect(actx.destination);

            volumeNode.gain.value = 0.5;
            panNode.pan.value = pan;
            pan *= -1;

            soundNode.start(actx.currentTime);
        }
        menu.visible = !menu.visible;
    }
    if (adminButton.clicked) {
        window.location = "/Home/Admin";
    }
    menu.handleInput();
    if (toggleFullscreenButton.clicked) {
        toggleFullscreeen();
        menu.visible = false;
        toggleFullscreenButton.clicked = false;
    }*/

    let mx = mousePosition.x,
        my = mousePosition.y;
    /*if (menu.visible && mousePressed &&
        !(mx > menu.x && mx < menu.x + menu.width && my > menu.y && my < menu.y + menu.height) &&
        !(mx > menuButton.x && mx < menuButton.x + menuButton.width && my > menuButton.y && my < menuButton.y + menuButton.height)) {
        menu.visible = false;
    }*/
}

function update() {
    for (let i = 0; i < scales.length; i += 1) {
        if (scales[i] === 0 && Math.random() < 0.01) {
            scales[i] += _scaleStep;
        } else if (scales[i] !== 0) {
            scales[i] += _scaleStep;
        }
        if (scales[i] >= _scaleMax * 2) {
            scales[i] = 0;
            starPositions[i] = createRandomPosition(canvas);
        }
    }
    //menuButton.update();
    /*if (!menu.visible) {
        menuButton.text = "+";
    } else {
        menuButton.text = "-";
    }
    menu.update();*/
}

function renderImage(ctx) {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.beginPath();
    ctx.arc(0, 0, imageWidth / 2, 0, 2 * Math.PI, false);
    ctx.clip();
    ctx.drawImage(image,
        0,
        0,
        image.width,
        image.height,
        -imageWidth * 0.5,
        -imageWidth * 0.5,
        imageWidth,
        imageWidth
    );
    ctx.restore();
}

function renderText(ctx) {
    let fontSize = Math.min(canvas.width, canvas.height) / 40 + "px";
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 8);
    ctx.font = fontSize + " puzzler";
    let offsetX = ctx.measureText(text).width;
    ctx.fillStyle = "white";
    ctx.fillText(text, -offsetX / 2, 0);
    ctx.restore();
}

function createRandomPosition(canvas) {
    let dr = Math.random() * imageWidth * 0.2 + imageWidth / 2,
        omega = Math.random() * 2 * Math.PI,
        x = dr * Math.cos(omega) + canvas.width / 2,
        y = dr * Math.sin(omega) + canvas.height / 2;
    return { x: x, y: y };
}

function drawStar(pos, scale, ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pos.x + radius * scale, pos.y);
    ctx.quadraticCurveTo(pos.x, pos.y, pos.x, pos.y + radius * scale);
    ctx.quadraticCurveTo(pos.x, pos.y, pos.x - radius * scale, pos.y);
    ctx.quadraticCurveTo(pos.x, pos.y, pos.x, pos.y - radius * scale);
    ctx.quadraticCurveTo(pos.x, pos.y, pos.x + radius * scale, pos.y);
    ctx.fill();
    ctx.restore();
}


function sineWave(x, t) {
    let y = A * Math.sin(k * x - omega * t + phi) + D;
    return y;
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
