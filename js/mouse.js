let mousePosition = { x: 0, y: 0 },
    mousePressed = false,
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
}

function handleTouchEnd(evt) {
    mousePressed = false;
    toggleFullscreeen();
}

function handleClick(evt) {
    toggleFullscreeen();
}
