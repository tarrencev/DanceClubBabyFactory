function PowerUpObject() {
    this.radius = 20;

    this.init();
}

PowerUpObject.prototype.init = function() {
    this.drawProjectile();
};

PowerUpObject.prototype.drawProjectile = function() {
    this.projectile = new createjs.Shape();
    this.projectile.x = CONSTANTS.WIDTH/2;
    this.projectile.y = CONSTANTS.HEIGHT/2;
    this.projectile.graphics
                   .beginStroke('#33FFFF')
                   .beginFill('#FF00FF')
                   .drawPolyStar(0, 0, this.radius, 5, 0.6, 0);
    stage.addChild(this.projectile);
};

//public funs
PowerUpObject.prototype.setPosition = function(position) {
    this.projectile.x = position.x;
    this.projectile.y = position.y;
};

PowerUpObject.prototype.getPosition = function() {
    return {
        x: this.projectile.x,
        y: this.projectile.y
    };
};

PowerUpObject.prototype.getPositionFromCenter = function() {
    return {
        x: this.projectile.x-CONSTANTS.WIDTH/2,
        y: this.projectile.y-CONSTANTS.HEIGHT/2
    };
};

PowerUpObject.prototype.getRadius = function() {
    return this.radius;
};

PowerUpObject.prototype.getShape = function() {
    return this.projectile;
};

PowerUpObject.prototype.pause = function() {
    
};

PowerUpObject.prototype.resume = function() {
    
};
