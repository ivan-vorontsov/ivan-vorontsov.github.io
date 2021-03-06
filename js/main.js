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


let T1M, T2M;

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

    ctx.lineTo(positionsVertical[0][0], 0);
    ctx.lineTo(0, 0);
    ctx.stroke();
    ctx.fillStyle = backgrounds[0];
    ctx.globalAlpha = backgroudOpacities[0];
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(positionsVertical[0][0], 0);
    ctx.lineTo(canvas.width, positionsHorizontal[positionsHorizontal.length - 1][1]);
    ctx.lineTo(canvas.width, 0);
    ctx.lineTo(positionsVertical[0][0], 0);
    ctx.stroke();
    ctx.fillStyle = backgrounds[1];
    ctx.globalAlpha = backgroudOpacities[1];
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(canvas.width, positionsHorizontal[positionsHorizontal.length - 1][1]);
    ctx.lineTo(canvas.width, positionsHorizontal[positionsHorizontal.length - 1][1].x);
    ctx.lineTo(positionsVertical[positionsVertical.length - 1][0], canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();
    ctx.fillStyle = backgrounds[2];
    ctx.globalAlpha = backgroudOpacities[2];
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(positionsVertical[positionsVertical.length - 1][0], canvas.height);
    ctx.lineTo(0, positionsHorizontal[0][1]);
    ctx.lineTo(0, canvas.height);
    ctx.lineTo(positionsVertical[positionsVertical.length - 1][0], canvas.height);
    ctx.stroke();
    ctx.fillStyle = backgrounds[3];
    ctx.globalAlpha = backgroudOpacities[3];
    ctx.fill();
    
    a = { x: positionsVertical[0][0], y: 0 };
    b = { x: canvas.width, y: positionsHorizontal[positionsHorizontal.length - 1][1] }; 
    c = { x: canvas.width / 2 + canvas.width / 8, y: canvas.height / 2 - canvas.height / 8 };

    let triangle = {
        A: { x: 0, y: positionsHorizontal[0][1]},
        B: { x: positionsVertical[0][0], y: 0},
        C: { x: canvas.width, y: positionsHorizontal[positionsHorizontal.length - 1][1]}
    };

    let midAB = { x: (triangle.A.x + triangle.B.x) / 2, y: (triangle.A.y + triangle.B.y) / 2 };

    let midBC = { x: (triangle.B.x + triangle.C.x) / 2, y: (triangle.B.y + triangle.C.y) / 2 };

    let midCA = { x: (triangle.C.x + triangle.A.x) / 2, y: (triangle.C.y + triangle.A.y) / 2 };

    let lineAB = line(triangle.C.x, triangle.C.y, midAB.x, midAB.y);
    let linearTime = 0;
    let linearPoint = lineAB(linearTime);
    ctx.beginPath();
    ctx.moveTo(linearPoint.x, linearPoint.y);

    let lineBC = lineY(triangle.A.x, triangle.A.y, midBC.x, midBC.y);
    let lineBCInv = lineY(triangle.A.y, triangle.A.x, midBC.y, midBC.x);
    
    while(linearTime < 1){
        linearTime += 0.067;
        linearPoint = lineAB(linearTime);
        ctx.lineTo(linearPoint.x, linearPoint.y);
        let dy = lineBC(linearPoint.x) - linearPoint.y;
        let dx = lineBCInv(linearPoint.y) - linearPoint.x;
        if (dy > 0 && dx > 0){
            break;
        }
    }
    ctx.strokeStyle = "black";
    ctx.stroke();

    lineBC = line(triangle.A.x, triangle.A.y, midBC.x, midBC.y);
    linearTime = 0;
    linearPoint = lineBC(linearTime);
    ctx.beginPath();
    ctx.moveTo(linearPoint.x, linearPoint.y);

    lineAB = lineY(triangle.C.x, triangle.C.y, midAB.x, midAB.y);
    let lineABInv = lineY(triangle.C.y, triangle.C.x, midAB.y, midAB.x);

    while(linearTime < 1){
        linearTime += 0.067;
        linearPoint = lineBC(linearTime);
        ctx.lineTo(linearPoint.x, linearPoint.y);
        let dy = lineAB(linearPoint.x) - linearPoint.y;
        let dx = lineABInv(linearPoint.y) - linearPoint.x;
        if (dy > 0){
            break;
        }
    }
    ctx.strokeStyle = "black";
    ctx.stroke();

    let medBHalf = line(triangle.B.x, triangle.B.y, midCA.x, midCA.y);
    ctx.beginPath();
    ctx.moveTo(triangle.B.x, triangle.B.y);

    
    let leftLine = line(midBC.x, midBC.y, triangle.A.x, triangle.A.y);
    let rightLine = line(midAB.x, midAB.y, triangle.C.x, triangle.C.y);
    let point = medBHalf(0);

    let time = 0;
    while(time < 1) {
        time += .0167;
        point = medBHalf(time);

        let Ayx = lineY(midBC.x, midBC.y, triangle.A.x, triangle.A.y);
        let dyA = Ayx(point.x) - point.y;
        let Axy = lineY(midBC.y, midBC.x, triangle.A.y, triangle.A.x);
        let dxA = Axy(point.y) - point.x;
    
        let Byx = lineY(midAB.x, midAB.y, triangle.C.x, triangle.C.y);
        let dyB = Byx(point.x) - point.y;
        let Bxy = lineY(midAB.y, midAB.x, triangle.C.y, triangle.C.x);
        let dxB = Bxy(point.y) - point.x;
        if (!(dxA > 0 && dyA > 0 && dxB < 0 && dyB > 0)) {
            ctx.lineTo(point.x, point.y);
            T1M = point;
            break;
        }
    }
    ctx.strokeStyle = "blue";
    ctx.stroke();


    triangle = {
        A: { x: 0, y: positionsHorizontal[0][1] },
        B: { x: canvas.width, y: positionsHorizontal[positionsHorizontal.length - 1][1] },
        C: { x: positionsVertical[positionsVertical.length - 1][0], y: positionsVertical[positionsVertical.length - 1][1] }
    };

    let rat1 = Math.sqrt( Math.pow(triangle.A.x - triangle.B.x, 2) + Math.pow(triangle.A.y - triangle.B.y, 2) );
    let rat2 = Math.sqrt( Math.pow(triangle.A.x - triangle.C.x, 2) + Math.pow(triangle.A.y - triangle.C.y, 2));
    let lambda = rat1 / rat2;
    let secBC = { x: (triangle.B.x + lambda * triangle.C.x) / (1 + lambda), y: (triangle.B.y + lambda * triangle.C.y) / (1 + lambda) };

    rat1 = Math.sqrt( Math.pow(triangle.A.x - triangle.B.x, 2) + Math.pow(triangle.A.y - triangle.B.y, 2) );
    rat2 = Math.sqrt( Math.pow(triangle.C.x - triangle.B.x, 2) + Math.pow(triangle.C.y - triangle.B.y, 2) );
    lambda = rat1 / rat2;
    let secCA = { x: (triangle.A.x + lambda * triangle.C.x) / (1 + lambda), y: (triangle.A.y + lambda * triangle.C.y) / (1 + lambda) };

    rat1 = Math.sqrt( Math.pow(triangle.A.x - triangle.C.x, 2) + Math.pow(triangle.A.y - triangle.C.y, 2) );
    rat2 = Math.sqrt( Math.pow(triangle.C.x - triangle.B.x, 2) + Math.pow(triangle.C.y - triangle.B.y, 2) );
    lambda = rat1 / rat2;
    let secAB = { x: (triangle.A.x + lambda * triangle.B.x) / (1 + lambda), y: (triangle.A.y + lambda * triangle.B.y) / (1 + lambda) };


    let secABHalf = line(triangle.C.x, triangle.C.y, secAB.x, secAB.y);
    let secBCHalf = line(triangle.A.x, triangle.A.y, secBC.x, secBC.y);
    let secCAHalf = line(triangle.B.x, triangle.B.y, secCA.x, secCA.y);
    ctx.beginPath();

    time = 0;
    point = secABHalf(time);
    ctx.moveTo(point.x, point.y);  
    while(time < 1) {
        let prevPoint = point;
        time += .00567;
        point = secABHalf(time);


        let Ayx = lineY(secCA.x, secCA.y, triangle.B.x, triangle.B.y);
        let dyA = Ayx(point.x) - point.y;
        let Axy = lineY(secCA.y, secCA.x, triangle.B.y, triangle.B.x);
        let dxA = Axy(point.y) - point.x;
    
        let Byx = lineY(secBC.x, secBC.y, triangle.A.x, triangle.A.y);
        let dyB = Byx(point.x) - point.y;
        let Bxy = lineY(secBC.y, secBC.x, triangle.A.y, triangle.A.x);
        let dxB = Bxy(point.y) - point.x;
 
        if ((dxA > 0 && dyA > 0 && dxB < 0 && dyB > 0)) {
            ctx.lineTo(prevPoint.x, prevPoint.y);
            T2M = prevPoint;
            break;
        }
    }
    ctx.strokeStyle = "red";
    ctx.stroke();


    ctx.beginPath();

    time = 0;
    point = secBCHalf(time);
    ctx.moveTo(point.x, point.y);

    while(time < 1){
        let prevPoint = point;
        time += .00567;
        point = secBCHalf(time); 

        let Ayx = lineY(triangle.B.x, triangle.B.y, secCA.x, secCA.y);
        let dyA = Ayx(point.x) - point.y; // > 0
        let Axy = lineY(triangle.B.y, triangle.B.x, secCA.y, secCA.x);
        let dxA = Axy(point.y) - point.x; // > 0
    
        let Byx = lineY(triangle.C.x, triangle.C.y, secAB.x, secAB.y);
        let dyB = Byx(point.x) - point.y; // > 0
        let Bxy = lineY(triangle.C.y, triangle.C.x, secAB.y, secAB.x);
        let dxB = Bxy(point.y) - point.x; // > 0

        ctx.lineTo(prevPoint.x, prevPoint.y);
        if ((dxA < 0 && dyA < 0 && dxB < 0)) {
            break;
        }
    }

    ctx.strokeStyle = "black";
    ctx.stroke();

    ctx.beginPath();

    time = 0;
    point = secCAHalf(time);
    ctx.moveTo(point.x, point.y);

    while(time < 1){
        let prevPoint = point;
        time += .00567;
        point = secCAHalf(time);

        let Ayx = lineY(triangle.C.x, triangle.C.y, secAB.x, secAB.y);
        let dyA = Ayx(point.x) - point.y; // > 0
        let Axy = lineY(triangle.C.y, triangle.C.x, secAB.y, secAB.x);
        let dxA = Axy(point.y) - point.x; // > 0
    
        let Byx = lineY(triangle.A.x, triangle.A.y, secBC.x, secBC.y);
        let dyB = Byx(point.x) - point.y; // > 0
        let Bxy = lineY(triangle.A.y, triangle.A.x, secBC.y, secBC.x);
        let dxB = Bxy(point.y) - point.x; // > 0

        ctx.lineTo(prevPoint.x, prevPoint.y);
        if (dxB > 0 && dyB < 0) {
            break;
        }
    }

    ctx.strokeStyle = "black";
    ctx.stroke();

    renderCloud(ctx);


    //menuButton.render(ctx);
    //renderImage(ctx);
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
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 4);
    ctx.font = fontSize + " puzzler";
    let txt = "(" + intersectionPoint.x.toFixed(2) + "," + intersectionPoint.y.toFixed(2) + ")";
    let len = ctx.measureText(txt).width;
    ctx.fillStyle = "black";

    maxWidth = Math.min(canvas.width * 3 / 4, len);
    ctx.fillText(txt, - maxWidth / 2, 0, maxWidth);
    ctx.restore();

    /*let mx = mousePosition.x,
        my = mousePosition.y;
    ctx.save();
    ctx.translate(canvas.width / 2, 3 * canvas.height / 4);
    ctx.font = fontSize + " puzzler";
    txt = "(" + mx + "," + my + ")";
    len = ctx.measureText(txt).width;
    ctx.fillStyle = "black";

    maxWidth = Math.min(canvas.width * 3 / 4, len);
    ctx.fillText(txt, - maxWidth / 2, 0, maxWidth);
    ctx.restore();*/

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

function renderCloud(ctx){
    let a = Math.random(),
        b = Math.random();

    ctx.save();
    ctx.beginPath();

    let origin = {x: a, y: b};
    let A = {x: positionsHorizontal[0][0], y: positionsHorizontal[0][1]},
        B = {x: T1M.x, y: T1M.y},
        C = {x: positionsHorizontal[positionsHorizontal.length - 1][0], y: positionsHorizontal[positionsHorizontal.length - 1][1]},
        D = {x: T2M.x, y: T2M.y};

    for(let x = .1; x < 0.9; x += 0.1){
        for(let y = .1; y < .9; y += 0.1){
            let AB = {x: A.x + y * (B.x - A.x),y: A.y + y * (B.y - A.y)};
            let DC = {x: D.x + y * (C.x - D.x),y: D.y + y * (C.y - D.y)};
            ctx.moveTo(AB.x, AB.y);
            ctx.lineTo(DC.x, DC.y);
        }
        let AD = {x: A.x + x * (D.x - A.x),y: A.y + x * (D.y - A.y)};
        let BC = {x: B.x + x * (C.x - B.x),y: B.y + x * (C.y - B.y)};
        ctx.moveTo(AD.x, AD.y);
        ctx.lineTo(BC.x, BC.y);
    }
    ctx.strokeStyle = 'green';
    ctx.stroke();

    ctx.beginPath();
    let ULW = {x: positionsVertical[0][0], y: positionsVertical[0][1]};
    for(let y = 0.1; y < 0.9; y += 0.1) {
        let AB = {x: A.x + y * (B.x - A.x),y: A.y + y * (B.y - A.y)};
        let AU = {x: A.x + y * (ULW.x - A.x), y: A.y + y * (ULW.y - A.y)};
        ctx.moveTo(AB.x, AB.y);
        ctx.lineTo(AU.x, AU.y);
        for(let z = 0.1; z < 0.9; z += 0.1){
            let AB = {x: A.x + z * (ULW.x - A.x),y: A.y + z * (ULW.y - A.y)};
            let BU = {x: B.x + z * (ULW.x - B.x), y: B.y + z * (ULW.y - B.y)};
            ctx.moveTo(BU.x, BU.y);
            ctx.lineTo(AB.x, AB.y);
        }
    }
    ctx.strokeStyle = 'purple';
    ctx.stroke();

    ctx.beginPath();
    let URW = {x: positionsVertical[0][0], y: positionsVertical[0][1]};
    for(let y = 0.9; y > 0.1; y -= 0.1) {
        let CB = {x: C.x + y * (B.x - C.x),y: C.y + y * (B.y - C.y)};
        let CU = {x: C.x + y * (URW.x - C.x), y: C.y + y * (URW.y - C.y)};
        ctx.moveTo(CB.x, CB.y);
        ctx.lineTo(CU.x, CU.y);
        for(let z = 0.1; z < 0.9; z += 0.1){
            let CU = {x: C.x + z * (URW.x - C.x),y: C.y + z * (URW.y - C.y)};
            let BU = {x: B.x + z * (URW.x - B.x), y: B.y + z * (URW.y - B.y)};
            ctx.moveTo(BU.x, BU.y);
            ctx.lineTo(CU.x, CU.y);
        }
    }
    ctx.strokeStyle = 'orange';
    ctx.stroke();

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

function line(x0, y0, x1, y1) {
    
    return function(t) {
        if(t < 0) t = 0;
        if(t > 1) t = 1;
        return {x: x0 + t * (x1 - x0), y: y0 + t * (y1 - y0) };
    }
}

function lineY(x0, y0, x1, y1){
    return function(x){
        return y0 + (y1 - y0) * ((x - x0) / (x1 - x0));
    }
}
