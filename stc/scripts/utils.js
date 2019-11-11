// ## BACKGROUND METHOD ##

function background(color) {
	this.g.fillStyle = color;
	this.g.fillRect(0, 0, this.width, this.height);
}

// ## SPRITE FROM LOCAL IMAGE ##

function sprite(src) {
	var img = new Image();
	img.src = src;
	return img;
}

// ## CHECK IF POINT IS INSIDE POLYGON ##

function inside(x, y, vs) {
    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}

// ## RANDOM FLOAT BETWEEN A AND B ##

function random(a, b) {
	return Math.random()*(b-a)+a
}

// ## STRING VISUAL LENGTH ##

String.prototype.visualLength = function() {
    var ruler = document.getElementById("ruler");
    ruler.innerHTML = this;
    return ruler.offsetWidth;
}