let mousePosition = { x: 0, y: 0 },
    mousePressed = false,
    time0,
    isTouchDevice = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0;

function handleMouseMove(evt) {
    let canvasBounds = canvas.getBoundingClientRect(),
        offsetLeft = canvasBounds.left,
        offsetTop = canvasBounds.top;

    mousePosition = { x: (evt.clientX - offsetLeft), y: (evt.clientY - offsetTop) };
}

function handleMouseDown(evt) {
    mousePressed = true;
}

function handleMouseUp(evt) {
    mousePressed = false;
}

function handleTouchStart(evt) {
    let canvasBounds = canvas.getBoundingClientRect(),
        offsetLeft = canvasBounds.left,
        offsetTop = canvasBounds.top;
    mousePressed = true;
    mousePosition.x = (evt.touches[0].clientX - offsetLeft) / APP.scaleX;
    mousePosition.y = (evt.touches[0].clientY - offsetTop) / APP.scaleY;
    time0 = new Date();
}

function handleTouchEnd(evt) {
    mousePressed = false;
    let t = new Date();
    let diff = t.getTime() - time0.getTime();
    if (diff < 200) {
        pointer.set();
    }
    pointer.set();
}

function handleClick(evt) {
    pointer.set();
}
