function makeCanvas() {
    let canvas = document.createElement("canvas");
    let appArea = document.querySelector("#appArea");
    canvas.context = canvas.getContext("2d");
    canvas.setAttribute('id', 'appCanvas');
    appArea.appendChild(canvas);
    return canvas;
}

// ------------

let canvas, radius, offset, step = 5, positionsHorizontal = [], positionsVertical = [], A = AInitial = 0, D, k = 0.001,
    omega = 0.001, phi = 1, phiX = Math.PI / 4, phiY = -Math.PI / 4, p = 0.0005, starPositions = [], scales = [],
    dencity = 400, _scaleMax = 1, _scaleStep = 0.05, menuButton, image, imageWidth, pan = 1, APP,
    text = "Ivan Vorontsov - Web Developer / Game Designer", 
    textFooter = "driven by HTML5", menu, toggleFullscreenButton, adminButton,
    backgrounds = ['#2A99A1', 'red', 'yellow', '#571A99'], colorText = 'rgb(75, 13, 183)', innerRotationMomentum = 0,
    spRotation = 2 * Math.PI / 1600000, phaseStep = 1 / 240000, turn = false, dPhi = .1, turning = false, previousTime = 0;

window.addEventListener('load', () => {
    image = new Image();
    image.onload = () => {
        canvas = makeCanvas();
        APP = new App_Singleton(1280, 1280);
        APP.onresize = onResize;
        onResize();
        for (let i = 0; i < dencity; i++) {
            starPositions.push(createRandomPosition(canvas));
            scales.push(0);
        }
        A = AInitial = canvas.width / 10;
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
    image.src = "./images/img.jpg";
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
    radius = Math.max(canvas.width, canvas.height) / 120;
    offset = canvas.width / 16;
    D = canvas.height / 2;
    A = AInitial * APP.scaleY;
    imageWidth = canvas.width / 3;
}

function appLoop(elapsed) {
    requestAnimationFrame(appLoop);

    positionsHorizontal = [];
    positionsVertical = [];

    let t = (elapsed - previousTime) * 0.001;
    previousTime = elapsed;
    if (t > 0.2) {
        return;
    }
    for (let x = 0; x <= canvas.width; x += step) {
        let y = sineWave(x, elapsed, phiX);
        if (Math.random() < 0.01) {
            //y += sineWave(x * x, t, phiX);
        }
        positionsHorizontal.push([x, y]);
    }

    for (let y = 0; y <= canvas.height; y += step) {
        let x = sineWave(y, elapsed, phiY);
        if (Math.random() < 0.01) {
            //x += sineWave(y * y, t, phiY);
        }
        positionsVertical.push([x, y]);
    }

    handleInput();

    update(t || 0);

    render(canvas.context, elapsed * 0.001);
}

function render(ctx, t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgrounds[3];
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 3;
    ctx.strokeStyle = "white";
    ctx.beginPath();

    ctx.moveTo(0, 0);
    ctx.lineTo(positionsHorizontal[0][0], positionsHorizontal[0][1]);
    for (let i = 1; i < Math.floor(positionsHorizontal.length / 2) + 1; i++) {
        ctx.lineTo(positionsHorizontal[i][0], positionsHorizontal[i][1]);
    }
    for (let i = Math.floor(positionsVertical.length / 2) + 1; i > 0; i--) {
        ctx.lineTo(positionsVertical[i][0], positionsVertical[i][1]);
    }
    ctx.lineTo(positionsVertical[0][0], 0);
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.fillStyle = backgrounds[0];
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(positionsVertical[0][0], positionsVertical[0][1]);
    for (let i = 1; i < Math.floor(positionsVertical.length / 2) + 1; i++) {
        ctx.lineTo(positionsVertical[i][0], positionsVertical[i][1]);
    }
    for (let i = Math.floor(positionsHorizontal.length / 2) + 1; i < positionsHorizontal.length; i++) {
        ctx.lineTo(positionsHorizontal[i][0], positionsHorizontal[i][1]);
    }
    ctx.lineTo(canvas.width, 0);
    ctx.lineTo(positionsVertical[0][0], positionsVertical[0][1]);
    ctx.stroke();
    ctx.fillStyle = backgrounds[1];
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(positionsHorizontal[positionsVertical.length - 1][0], positionsVertical[positionsVertical.length - 1][1]);
    for (let i = positionsHorizontal.length - 1; i > Math.floor(positionsHorizontal.length / 2); i--) {
        ctx.lineTo(positionsHorizontal[i][0], positionsHorizontal[i][1]);
    }
    for (let i = Math.floor(positionsVertical.length / 2) + 1; i < positionsVertical.length; i++) {
        ctx.lineTo(positionsVertical[i][0], positionsVertical[i][1]);
    }
    
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(positionsHorizontal[positionsHorizontal.length - 1][0], positionsHorizontal[positionsHorizontal.length - 1][1]);
    ctx.stroke();
    ctx.fillStyle = backgrounds[2];
    ctx.fill();



    for (let i = 0; i < scales.length; i += 1) {
        let scale = scales[i];
        if (scales[i] > _scaleMax) {
            scale = _scaleMax * 2 - scales[i];
        }
        let pos = starPositions[i];
        /*if (pos.y < sineWave(pos.x, t)) {
            ctx.fillStyle = "green";
        } else {
            ctx.fillStyle = "green";
        }*/
        ctx.fillStyle = "green";
        drawStar(pos, scale, ctx);
    }

    //menuButton.render(ctx);
    renderImage(ctx);
    renderText(ctx);
    //menu.render(ctx);
}

function handleInput() {
    let mx = mousePosition.x,
        my = mousePosition.y;
}

function update(elapsed) {
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

    //let dk = Math.random() * 2 * dPhi / 3 - dPhi / 3;

    let theta = 10 * dPhi * (1 - Math.abs(spRotation));
    if (turning) {
        spRotation += theta * elapsed;
        if (1 - Math.abs(spRotation) < 0.01) {
            turning = true;
        } else {
            turning = false;
        }
    } else {
        spRotation += theta * elapsed;
    }

    

    if (((1 - Math.abs(spRotation)) < 0.01) && !turning) {
        if (1 - Math.abs(spRotation) < 0.01) {
            dPhi *= -1;
            turning = true;
        }
    }


    innerRotationMomentum += 2 * Math.PI * (spRotation / 100);
    innerRotationMomentum = innerRotationMomentum % (2 * Math.PI);

    console.log(spRotation);

    updatePhase(elapsed);
}

function updatePhase(elapsed) {
    let dPhi = (Math.random() * 2 * Math.PI - Math.PI) * Math.PI / 1800;
    phiX = ((phiX + phaseStep * elapsed) % (2 * Math.PI)); 

    phiY += ((dPhi + phaseStep * elapsed) % (2 * Math.PI));
}

function renderImage(ctx) {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);

    ctx.beginPath();
    ctx.arc(0, 0, imageWidth / 2, 0, 2 * Math.PI, false);
    ctx.clip();
    ctx.rotate(innerRotationMomentum);
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
    let fontSize = canvas.width / 5 / 6 + "px";
    
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 8);
    ctx.font = fontSize + " puzzler";
    let len = ctx.measureText(text).width;
    ctx.fillStyle = "white";

    let maxWidth = Math.min(canvas.width * 3 / 4, len);
    // ctx.fillText(text, - maxWidth / 2, 0, maxWidth); 

    ctx.restore();

    ctx.save();
    fontSize = canvas.width / 5 / 6 / 1.66 + "px";
    
    ctx.font = fontSize + " puzzler";
    ctx.shadowColor = colorText;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0; 
    ctx.shadowBlur = 10;

    len = ctx.measureText(textFooter).width;
    ctx.fillStyle = 'black';

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 4);

    
    for (let i = 0; i < textFooter.length; i++) {
        ctx.save();
        ctx.rotate(-i * Math.PI / 4 / textFooter.length + Math.PI / 8);
        ctx.translate(0, len * (1 + 6 / 7));
        ctx.fillText(textFooter[i], 0, 0);
        ctx.restore();
    }

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


function sineWave(x, t, phi) {
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
