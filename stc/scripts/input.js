// ## KEYBOARD INPUT ##

window.addEventListener("keydown", keyPressed);
window.addEventListener("keyup", keyReleased);

var heldKeys = [];
var pressedKeys = [];
var releasedKeys = [];

function keyPressed(e) {
	var k = e.keyCode;
	if (!isKeyHeld(k)) {
		heldKeys.push(k);
		pressedKeys.push(k);
	}
}

function keyReleased(e) {
	var k  = e.keyCode;
	heldKeys.splice(heldKeys.indexOf(k), 1);
	releasedKeys.push(k);
}

function isKeyHeld(k) {
  return heldKeys.includes(k);
}

function isKeyPressed(k) {
  return pressedKeys.includes(k);
}

function isKeyReleased(k) {
  return releasedKeys.includes(k);
}

function clearKeyInput() {
	pressedKeys = [];
	releasedKeys = [];
}

// ## MOUSE INPUT ##

window.addEventListener("mousemove", mouseMoved);
window.addEventListener("mousedown", mouseDown);
window.addEventListener("mouseup", mouseUp);

var mouse = {
  x : null,
  y : null,
  click : -1
}

function mouseMoved(e) {
  mouse.x = e.x - canvasX;
  mouse.y = e.y - canvasY;
}

function mouseDown(e) {
  mouse.click = e.button;
}

function mouseUp(e) {
  mouse.click = -1;
}
