var canvas;
var width, height;
var canvasX, canvasY;
var g;
var interval;

var proportion = 8/5;

var debugUI = false;

var cam = new vector3(0, 0, -3);
var camRx = 0;
var camRy = 0;
var fov = Math.PI / 3;

// ## INIT CANVAS ##

function start() {
	canvas = document.getElementById("frame");

	canvas.width = 1200;
	canvas.height = canvas.width / proportion;

	width = canvas.width;
	height = canvas.height;

	canvasX = canvas.getBoundingClientRect().left;
	canvasY = canvas.getBoundingClientRect().top;
	window.addEventListener("resize", function(e) {
	  canvasX = canvas.getBoundingClientRect().left;
	  canvasY = canvas.getBoundingClientRect().top;
	});

	g = canvas.getContext("2d");
	interval = setInterval(update, 20);

	canvas.requestPointerLock();
	loadModel("res/test.obj");
}

function update() {
	mouseOut = mouse.x < 0 || mouse.x > width || mouse.y < 0 || mouse.y > height;
	render();

	if (isKeyPressed(112)) debugUI = !debugUI;

	let move = new vector3(0, 0, 0)

	if (isKeyHeld(68)) move.x += 1;
	if (isKeyHeld(65)) move.x -= 1;

	if (isKeyHeld(87)) move.z += 1;
	if (isKeyHeld(83)) move.z -= 1;

	if (isKeyHeld(39)) camRx += 0.03;
	if (isKeyHeld(37)) camRx -= 0.03;

	if (isKeyHeld(38)) camRy += 0.03;
	if (isKeyHeld(40)) camRy -= 0.03;

	if (move.mod() != 0) cam.add(move.unit().rotateY(camRx).scale(0.03));

	clearKeyInput();
	updateMouseMovement();
}

function render() {
	background("#000");

	let transformedVertices = [];
	let verticesInScreen = [];
	let distances = [];
	for (let i = 0; i < vertices.length; i++) {
		let v3 = vertices[i].copy().sub(cam);

		v3.rotateY(-camRx);
		v3.rotateX(camRy);

		transformedVertices.push(v3);
		let v2 = new vector2(0,0);
		v2.x = 2*Math.atan(v3.x/v3.z)/fov;
		v2.y = 2*Math.atan(v3.y/v3.z)/fov;
		v2 = screentoframe(v2);
		verticesInScreen.push(v2);
		distances.push(v3.z);
	}
	sortTriangles(transformedVertices);

	for (let i = 0; i < triangles.length; i++) {
		let avgdist = 0;
		let behind = false;
		g.beginPath();
		for (let j = 0; j <= 3; j++) {
			v = verticesInScreen[triangles[i][j%3]];
			d = distances[triangles[i][j%3]];
			if (j < 3) avgdist += d/3;
			if (d < 0) behind = true;

			g.lineTo(v.x, v.y);
		}
		if (!behind) {
			let gray = map(avgdist, 0, 10, 255, 0);
			g.fillStyle = grayscale(gray);
			g.strokeStyle = "#000";
			g.fill();
			g.stroke();
		}
	}
}

function screentoframe(v) {
	return new vector2((v.x+proportion) * height/2, (-v.y+1) * height/2);
}

function sortTriangles(transformedVertices) {
	triangles.sort(function(a,b) {
		let aa = 0;
		let bb = 0;

		for (let i = 0; i < 3; i++) {
			let va = transformedVertices[a[i]];
			let vb = transformedVertices[b[i]];

			aa += va.mod();
			bb += vb.mod();
		}

		return bb - aa;
	});
}
