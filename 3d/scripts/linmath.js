function vector2(x, y) {

  this.x = x;
  this.y = y;

  this.copy = function() {
    return new vector2(this.x, this.y);
  }

  this.mod = function() {
    return Math.sqrt(this.x*this.x + this.y*this.y);
  }

  this.arg = function() {
    return Math.atan2(this.y, this.x);
  }

  this.neg = function() {
    this.x *= -1;
    this.y *= -1;
    return this;
  }

  this.add = function(v) {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  this.sub = function(v) {
    return this.add(v.copy().neg());
  }

  this.scale = function(k) {
    this.x *= k;
    this.y *= k;
    return this;
  }

  this.unit = function() {
    return this.scale(1/this.mod());
  }

}

function vector3(x, y, z) {

  this.x = x;
  this.y = y;
  this.z = z;

  this.copy = function() {
    return new vector3(this.x, this.y, this.z);
  }

  this.mod = function() {
    return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
  }

  this.neg = function() {
    this.x *= -1;
    this.y *= -1;
    this.z *= -1;
    return this;
  }

  this.add = function(v) {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  this.sub = function(v) {
    return this.add(v.copy().neg());
  }

  this.scale = function(k) {
    this.x *= k;
    this.y *= k;
    this.z *= k;
    return this;
  }

  this.unit = function() {
    return this.scale(1/this.mod());
  }

  this.rotateX = function(a) {
    let y = Math.cos(a) * this.y - Math.sin(a) * this.z;
    let z = Math.sin(a) * this.y + Math.cos(a) * this.z;

    this.y = y;
    this.z = z;

    return this;
  }

  this.rotateY = function(a) {
    let x = Math.cos(a) * this.x + Math.sin(a) * this.z;
    let z = -Math.sin(a) * this.x + Math.cos(a) * this.z;

    this.x = x;
    this.z = z;

    return this;
  }

  this.rotateZ = function(a) {
    let x = Math.cos(a) * this.x - Math.sin(a) * this.y;
    let y = Math.sin(a) * this.x + Math.cos(a) * this.y;

    this.x = x;
    this.y = y;

    return this;
  }

}

function vec3tovec2(v) {
  return new vector2(v.x, v.y);
}
