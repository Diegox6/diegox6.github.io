var canvas;
var width, height;
var canvasX, canvasY;
var g;
var interval;

var debugUI = false;

var G = 0.1;
var c;

var fireDelay;
var maxFireDelay = 10;
var triggerReleased = true;

var score;

var mouseOut;

// ## GAME STATE ##
// - 0: Wait for start
// - 1: Playing
// - 2: Game over

const gameStates = {
	WAIT: 0,
	PLAYING: 1,
	GAMEOVER: 2
};
var gameState = 0;

// ## INIT CANVAS ##

function start() {
	canvas = document.getElementById("frame");

	canvas.width = 1000;
	canvas.height = canvas.width/8*5;

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
	
}

// ## INIT GAME ##

function startGame() {
	gameState = gameStates.PLAYING;
	score = 0;
	fireDelay = maxFireDelay;
	
	var canX = random(-width/2, width/2);
	var canY = height +	20;
	var canVY = -Math.sqrt((canY-random(height/2, 50))*2*G);
	var canVX = G*canX/canVY;
	
	c = new can(canX + width/2, canY, canVX, canVY, 0.05);
}

// ## GAME OVER	 ##

function gameOver() {
	gameState = gameStates.GAMEOVER;
}

// ## UPDATE AND RENDER ##

function update() {
	mouseOut = mouse.x < 0 || mouse.x > width || mouse.y < 0 || mouse.y > height;
	render();
	
	if (gameState == gameStates.WAIT || gameState == gameStates.GAMEOVER){
		document.getElementById("frame").style.cursor = "auto";
		if (mouse.click == 0 && !mouseOut) startGame();
	} else if (gameState == gameStates.PLAYING) {
		document.getElementById("frame").style.cursor = "none";
		c.update();
		if (c.y > height + 30) gameOver();
		
		if (isKeyPressed(68)) debugUI = !debugUI;
		clearKeyInput();
		
		if (mouse.click == 0 && triggerReleased && !mouseOut && fireDelay <= 0) {
			shoot();
			triggerReleased = false;
		}
		if (fireDelay > 0) fireDelay--;
		if (mouse.click != 0) triggerReleased = true;
	}
}

function render() {
	background("#CCC");
	
	if (gameState == gameStates.PLAYING) {
		g.font = "50px Consolas";
		g.fillStyle = "#222222";
		g.fillText(score, 500 - String(score).visualLength()*50/32, 500/8*5);
		
		c.show();
		
		g.drawImage(sprite("res/img/crosshair.png"), mouse.x - 8, mouse.y - 8);
		
		if (debugUI) {
			g.fillStyle = "#444"
			g.font = "10px Consolas";
			g.fillText("KeyHeld: " + (heldKeys.length > 0 ? heldKeys : "none"), 5, 10);
			g.fillText("MouseClick: " + (mouse.click != -1 ? mouse.click : "none"), 5, 20);
			g.fillText("MousePos: " + mouse.x + " - " + mouse.y, 5, 30);
			g.fillText("FireDelay: " + fireDelay, 5, 40);
		}
	} else if (gameState == gameStates.WAIT) {
		g.font = "50px Consolas";
		g.fillStyle = "#222222";
		g.fillText("Click to start", 500 - "Click to start".visualLength()*50/32, height/2);
	} else if (gameState == gameStates.GAMEOVER) {
		g.font = "50px Consolas";
		g.fillStyle = "#222222";
		g.fillText("Game Over!", 500 - "Game Over!".visualLength()*50/32, height/2);
		
		g.font = "20px Consolas";
		scoreMsg = "Your score: " + score;
		g.fillText(scoreMsg, 500 - scoreMsg.visualLength()*20/32, height/2+30);
		
		g.fillText("Click to try again", 500 - "Click to try again".visualLength()*20/32, height/2+60);
	}
}

// ## SHOOT ##

function shoot(x, y) {
	fireDelay = maxFireDelay;
	new Audio("res/sound/gunshot.wav").play();
	
	var vs = [
		[Math.cos(c.a)*10-Math.sin(c.a)*20+c.x,Math.sin(c.a)*10+Math.cos(c.a)*20+c.y],
		[Math.cos(c.a)*10+Math.sin(c.a)*20+c.x,Math.sin(c.a)*10-Math.cos(c.a)*20+c.y],
		[-Math.cos(c.a)*10+Math.sin(c.a)*20+c.x,-Math.sin(c.a)*10-Math.cos(c.a)*20+c.y],
		[-Math.cos(c.a)*10-Math.sin(c.a)*20+c.x,-Math.sin(c.a)*10+Math.cos(c.a)*20+c.y]
	];
	if (inside(mouse.x, mouse.y, vs)) {
		new Audio("res/sound/bang.wav").play();
		c.vx = random(-1,1);
		c.vy = random(-3,-1);
		c.va = random(-0.1, 0.1);
		score++;
	}
}

