function can(x, y, vx, vy, va) {
	
	this.x = x;
	this.y = y;
	
	this.vx = vx;
	this.vy = vy;
	
	this.a = 0;
	this.va = va;
	
	this.show = function() {
		g.translate(this.x, this.y);
		g.rotate(this.a);
		g.fillStyle = "#444444";
		g.fillRect(-10, -20, 20, 40);
		g.fillStyle = "#111111";
		g.lineWidth = 2;
		g.beginPath();
		g.rect(-10, -20, 20, 40);
		g.stroke();
		g.rotate(-this.a);
		g.translate(-this.x, -this.y);
	}
	
	this.update = function() {
		this.x += this.vx;
		this.vy += G;
		this.y += this.vy;
		this.a += this.va;
	}
	
}