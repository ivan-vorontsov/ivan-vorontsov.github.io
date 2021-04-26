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
    textFooter = "driven by HTML5", menu, toggleFullscreenButton, adminButton, intersectionPoint = { x: 0, y: 0 },
    backgrounds = ['#2A99A1', 'red', 'yellow', '#571A99'], backgroudOpacities = [.8, .8, .8, .8], highlightOpacity = 1, colorText = 'rgb(75, 13, 183)', innerRotationMomentum = 0,
    spRotation = 2 * Math.PI / 1600000, phaseStep = 1 / 240000, turn = false, dPhi = .1, turning = false, previousTime = 0,
    lineA = { A: { x: 0, y: 0 }, B: { x: 0, y: 0 } }, lineB = { A: { x: 0, y: 0 }, B: { x: 0, y: 0 } }, highLightIndex = 0;

window.addEventListener('load', () => {
    image = new Image();
    image.onload = () => {
        canvas = makeCanvas();
        APP = new App_Singleton(1280, 1280);

        APP.resize();

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
        window.addEventListener('click', handleClick);
        appLoop();
    };
    image.src = "./images/img.jpg";
});

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

    updateIntersection(elapsed);

    render(canvas.context, elapsed * 0.001);
}

function render(ctx, t) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = APP.getLineWidth();
    ctx.strokeStyle = "white";
    ctx.beginPath();

    ctx.moveTo(0, 0);
    ctx.lineTo(0, positionsHorizontal[0][1]);
    //for (let i = 0; i < intersectionPoint.i - 1; i++) {
    //    ctx.lineTo(positionsHorizontal[i][0], positionsHorizontal[i][1]);
    //}
    //ctx.lineTo(intersectionPoint.x, intersectionPoint.y);
    //for (let i = intersectionPoint.j - 1; i >= 0; i--) {
    //    ctx.lineTo(positionsVertical[i][0], positionsVertical[i][1]);
    //}
    ctx.lineTo(positionsVertical[0][0], 0);
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.fillStyle = backgrounds[0];
    ctx.globalAlpha = backgroudOpacities[0];
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(positionsVertical[0][0], 0);
    //for (let i = 0; i < intersectionPoint.j - 1; i++) {
    //    ctx.lineTo(positionsVertical[i][0], positionsVertical[i][1]);
    //}
    //ctx.lineTo(intersectionPoint.x, intersectionPoint.y);
    //for (let i = intersectionPoint.i + 1; i < positionsHorizontal.length; i++) {
    //    ctx.lineTo(positionsHorizontal[i][0], positionsHorizontal[i][1]);
    //}
    ctx.lineTo(canvas.width, positionsHorizontal[positionsHorizontal.length - 1][1]);
    ctx.lineTo(canvas.width, 0);
    ctx.lineTo(positionsVertical[0][0], 0);
    //ctx.lineTo(positionsVertical[0][0], 0);
    ctx.stroke();
    ctx.fillStyle = backgrounds[1];
    ctx.globalAlpha = backgroudOpacities[1];
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(canvas.width, positionsHorizontal[positionsHorizontal.length - 1][1]);
    //for (let i = intersectionPoint.i + 1; i < positionsHorizontal.length; i++) {
    //    ctx.lineTo(positionsHorizontal[i][0], positionsHorizontal[i][1]);
    //}
    //ctx.lineTo(canvas.width, canvas.height);
    //ctx.lineTo(positionsVertical[positionsVertical.length - 1][0], canvas.height);

    //for (let i = positionsVertical.length - 1; i > intersectionPoint.j; i--) {
    //    ctx.lineTo(positionsVertical[i][0], positionsVertical[i][1]);
    //}

    ctx.lineTo(canvas.width, positionsHorizontal[positionsHorizontal.length - 1][1].x);
    ctx.lineTo(positionsVertical[positionsVertical.length - 1][0], canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();
    ctx.fillStyle = backgrounds[2];
    ctx.globalAlpha = backgroudOpacities[2];
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(positionsVertical[positionsVertical.length - 1][0], canvas.height);
    //for (let i = intersectionPoint.j; i < positionsVertical.length; i++) {
    //    ctx.lineTo(positionsVertical[i][0], positionsVertical[i][1]);
    //}
    ctx.lineTo(0, positionsHorizontal[0][1]);
    ctx.lineTo(0, canvas.height);
    ctx.lineTo(positionsVertical[positionsVertical.length - 1][0], canvas.height);
    //for (let i = 0; i < intersectionPoint.i; i++) {
    //    ctx.lineTo(positionsHorizontal[i][0], positionsHorizontal[i][1]);
    //}

    ctx.stroke();
    ctx.fillStyle = backgrounds[3];
    ctx.globalAlpha = backgroudOpacities[3];
    ctx.fill();

    ctx.beginPath();
    let a = { x: 0, y: 0 },
        b = { x: canvas.width, y: canvas.height },
        c = { x: canvas.width / 8, y: canvas.height / 2 - canvas.height / 8 };

    ctx.moveTo(a.x, a.y);
    let func = elliptic(a, b, c);

    for (let x = 0; x < canvas.width; x += 10) {
        ctx.lineTo(x, func(x));
    }
    ctx.stroke();

    
    a = { x: positionsVertical[0][0], y: 0 };
    b = { x: canvas.width, y: positionsHorizontal[positionsHorizontal.length - 1][1] }; 
    c = { x: canvas.width / 2 + canvas.width / 8, y: canvas.height / 2 - canvas.height / 8 };

    let triangle = {
        A: { x: 0, y: positionsHorizontal[0][1]},
        B: { x: positionsVertical[0][0], y: 0},
        C: { x: canvas.width, y: positionsHorizontal[positionsHorizontal.length - 1][1]}
    };

    let midAB = { x: (triangle.A.x + triangle.B.x) / 2, y: (triangle.A.y + triangle.B.y) / 2 };
    let medABFunc = function (x) {
        return (triangle.C.y - midAB.y) * (x - midAB.x) / (triangle.C.x - midAB.x) + midAB.y;
    }

    let midBC = { x: (triangle.B.x + triangle.C.x) / 2, y: (triangle.B.y + triangle.C.y) / 2 };

    //let midCA = { x: (triangle.C.x + triangle.A.x) / 2, y: (triangle.C.y + triangle.A.y) / 2 };

    ctx.beginPath();
    ctx.moveTo(triangle.C.x, triangle.C.y);
    ctx.lineTo(midAB.x, midAB.y);
    ctx.lineTo(triangle.C.x, triangle.C.y);
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(triangle.A.x, triangle.A.y);
    ctx.lineTo(midBC.x, midBC.y);
    ctx.lineTo(triangle.A.x, triangle.A.y);
    ctx.strokeStyle = "black";
    ctx.stroke();

    /*ctx.beginPath();
    ctx.moveTo(triangle.B.x, triangle.B.y);
    ctx.lineTo(midCA.x, midCA.y);
    ctx.lineTo(triangle.B.x, triangle.B.y);
    ctx.strokeStyle = "black";
    ctx.stroke();*/


    triangle = {
        A: { x: 0, y: positionsHorizontal[0][1] },
        B: { x: canvas.width, y: positionsHorizontal[positionsHorizontal.length - 1][1] },
        C: { x: positionsVertical[positionsVertical.length - 1][0], y: canvas.height }
    };

    let rat1 = Math.sqrt( Math.pow(triangle.A.x - triangle.B.x, 2) + Math.pow(triangle.A.y - triangle.B.y, 2) );
    let rat2 = Math.sqrt( Math.pow(triangle.A.x - triangle.C.x, 2) + Math.pow(triangle.A.y - triangle.C.y, 2));
    let lambda = rat1 / rat2;
    let secBC = { x: (triangle.B.x + lambda * triangle.C.x) / (1 + lambda), y: (triangle.B.y + lambda * triangle.C.y) / (1 + lambda) };

    rat1 = Math.sqrt( Math.pow(triangle.A.x - triangle.B.x, 2) + Math.pow(triangle.A.y - triangle.B.y, 2) );
    rat2 = Math.sqrt( Math.pow(triangle.C.x - triangle.B.x, 2) + Math.pow(triangle.B.y - triangle.B.y, 2) );
    lambda = rat1 / rat2;
    let secCA = { x: (triangle.A.x + lambda * triangle.C.x) / (1 + lambda), y: (triangle.A.y + lambda * triangle.C.y) / (1 + lambda) };

    //let secCA = { x: (triangle.C.x + triangle.A.x) / 2, y: (triangle.C.y + triangle.A.y) / 2 };


    ctx.beginPath();
    ctx.moveTo(triangle.A.x, triangle.A.y);
    ctx.lineTo(secBC.x, secBC.y);
    ctx.lineTo(triangle.A.x, triangle.A.y);
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(triangle.B.x, triangle.B.y);
    ctx.lineTo(secCA.x, secCA.y);
    ctx.lineTo(triangle.B.x, triangle.B.y);
    ctx.strokeStyle = "black";
    ctx.stroke();

    /*ctx.beginPath();
    ctx.moveTo(triangle.B.x, triangle.B.y);
    ctx.lineTo(midCA.x, midCA.y);
    ctx.lineTo(triangle.B.x, triangle.B.y);
    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(triangle.B.x, triangle.B.y);
    ctx.lineTo(midAB.x, midAB.y);
    ctx.lineTo(triangle.B.x, triangle.B.y);
    ctx.strokeStyle = "black";
    ctx.stroke();
    */

    //ctx.moveTo(a.x, a.y);
    //func = elliptic(a, b, c);

    //for (let x = a.x; x < b.x; x += 10) {
    //    ctx.lineTo(x, func(x));
    //}
    //ctx.stroke();


    //for (let i = 0; i < scales.length; i += 1) {
    //    let scale = scales[i];
    //    if (scales[i] > _scaleMax) {
    //        scale = _scaleMax * 2 - scales[i];
    //    }
    //    let pos = starPositions[i];
    //    ctx.fillStyle = "green";
    //    drawStar(pos, scale, ctx);
    //}

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

    updatePhase(elapsed);

    updateIntersection(elapsed);

    updateOpacity(elapsed);
}

function updateIntersection(elapsed) {
    let horizotalStart = { x: 0, y: 0 },
        horizontalEnd = { x: canvas.width, y: 0 };
    horizotalStart.y = sineWave(horizotalStart.x, elapsed, phiX);
    horizontalEnd.y = sineWave(horizontalEnd.x, elapsed, phiX);

    let verticalStart = { x: 0, y: 0 },
        verticalEnd = { x: 0, y: canvas.height };
    verticalStart.x = sineWave(verticalStart.y, elapsed, phiY);
    verticalEnd.x = sineWave(verticalEnd.y, elapsed, phiY);

    lineA.A.x = horizotalStart.x;
    lineA.B.x = horizontalEnd.x;
    lineA.A.y = horizotalStart.y;
    lineA.B.y = horizontalEnd.y;
    lineB.A.x = verticalStart.x;
    lineB.B.x = verticalEnd.x;
    lineB.A.y = verticalStart.y;
    lineB.B.y = verticalEnd.y;

    let slopeH = (lineA.B.y - lineA.A.y) / (lineA.B.x - lineA.A.x),
        slopeV = (lineB.B.x - lineB.A.x) / (lineB.B.y - lineB.A.y);

    let x = (slopeV * lineA.A.y + lineB.A.x) / (1 - slopeH * slopeV);
    intersectionPoint.x = x;
    intersectionPoint.y = slopeH * x + lineA.A.y;
    intersectionPoint.i = 0;
    intersectionPoint.j = 0;
    let xRoot = 0, yRoot = 0;
    for (let i = 0; i < positionsHorizontal.length; i++) {
        xRoot = i * step;
        if (xRoot >= intersectionPoint.x) {
            intersectionPoint.i = i;
            break;
        }
    }
    for (let j = 0; j < positionsVertical.length; j++) {
        yRoot = j * step;
        if (yRoot >= intersectionPoint.y) {
            intersectionPoint.j = j;
            break;
        }
    }
}

function updatePhase(elapsed) {
    let dPhi = (Math.random() * 2 * Math.PI - Math.PI) * Math.PI / 1800;
    phiX = ((phiX + phaseStep * elapsed) % (2 * Math.PI));

    phiY += ((dPhi + phaseStep * elapsed) % (2 * Math.PI));
}

function updateOpacity() {
    // ZERO
    highLightIndex = -1;
    let max = 0;
    let T = {
        A: { x: 0, y: 0 },
        B: { x: positionsVertical[0][0], y: 0 },
        C: { x: intersectionPoint.x, y: intersectionPoint.y },
        D: { x: 0, y: positionsHorizontal[0][1]}
    };
    let measure = squareMeasure(T);
    if (measure > max && highLightIndex === -1) {
        max = measure;
        highLightIndex = 0;
    }

    T = {
        A: { x: positionsVertical[0][0], y: 0 }, B: { x: canvas.width, y: 0 },
        C: { x: canvas.width, y: positionsHorizontal[positionsHorizontal.length - 1][1] },
        D: { x: intersectionPoint.x, y: intersectionPoint.y }
    };
    measure = squareMeasure(T);
    if (measure > max && highLightIndex === 0) {
        max = measure;
        highLightIndex = 1;
    }

    T = {
        A: { x: canvas.width, y: positionsHorizontal[positionsHorizontal.length - 1][1] }, B: { x: canvas.width, y: canvas.height },
        C: { x: positionsVertical[positionsVertical.length - 1][0], y: canvas.height },
        D: { x: intersectionPoint.x, y: intersectionPoint.y }
    };
    measure = squareMeasure(T);

    if (measure > max && highLightIndex === 1) {
        max = measure;
        highLightIndex = 2;
    }

    T = {
        A: { x: 0, y: positionsHorizontal[0][1] }, B: { x: 0, y: canvas.height },
        C: { x: positionsVertical[positionsVertical.length - 1][0], y: canvas.height },
        D: { x: intersectionPoint.x, y: intersectionPoint.y }
    };

    measure = squareMeasure(T);

    if (measure > max && highLightIndex === 2) {
        max = measure;
        highLightIndex = 3;
    }

    backgroudOpacities = [.99, .99, .99, .99];
    backgroudOpacities[highLightIndex] = 1;
    console.log(highLightIndex);
}

function squareMeasure(T) {
    return Math.sqrt(Math.pow((T.A.x - T.C.x), 2) + Math.pow((T.A.y - T.C.y), 2)) + Math.sqrt(Math.pow((T.B.x - T.D.x), 2) + Math.pow((T.B.y - T.D.y), 2));
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

    //ctx.save();
    //ctx.translate(canvas.width / 2, canvas.height / 8);
    //ctx.font = fontSize + " puzzler";
    //let txt = 
    //let len = ctx.measureText(txt).width;
    //ctx.fillStyle = "black";

    //let maxWidth = Math.min(canvas.width * 3 / 4, len);
    //ctx.fillText(txt, - maxWidth / 2, 0, maxWidth);

    //ctx.restore();
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 4);
    ctx.font = fontSize + " puzzler";
    let txt = "(" + intersectionPoint.x.toFixed(2) + "," + intersectionPoint.y.toFixed(2) + ")";
    let len = ctx.measureText(txt).width;
    ctx.fillStyle = "black";

    maxWidth = Math.min(canvas.width * 3 / 4, len);
    ctx.fillText(txt, - maxWidth / 2, 0, maxWidth);
    ctx.restore();

    let mx = mousePosition.x,
        my = mousePosition.y;
    ctx.save();
    ctx.translate(canvas.width / 2, 3 * canvas.height / 4);
    ctx.font = fontSize + " puzzler";
    txt = "(" + mx + "," + my + ")";
    len = ctx.measureText(txt).width;
    ctx.fillStyle = "black";

    maxWidth = Math.min(canvas.width * 3 / 4, len);
    ctx.fillText(txt, - maxWidth / 2, 0, maxWidth);
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

    let jangle = Math.PI / 9 / 2,
        stepPhi = Math.PI / jangle

    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(-Math.PI / 4 - stepPhi);

    maxWidth = ctx.measureText(text).width;
    let lenOfCirca = 2 * Math.PI * canvas.width * 7 / 2 / 8,
        angel = 2 * Math.PI * len / lenOfCirca;

    for (let i = 0; i < textFooter.length; i++) {
        ctx.save();
        ctx.rotate(-i * angel - jangle);
        ctx.translate(0, canvas.width * 7 / 2 / 8);
        ctx.fillText(textFooter[i], 0, 0, maxWidth);
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

function elliptic(A, B, C) {
    return function (x) {
        let a = (A.x * (C.y - B.y) + B.x * (A.y - C.y) + C.x * (B.y - A.y)) / ((A.x - B.x) * (A.x - C.x) * (B.x - C.x));
        let b = (B.y - A.y) / (B.x - A.x) - a * (A.x + B.x);
        let c = A.y - a * Math.pow(A.x, 2) - b * A.x;

        return a * Math.pow(x, 2) + b * x + c;
    }
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
