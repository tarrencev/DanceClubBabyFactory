function ProjectileObject() {
    this.radius = 14;
    this.dest = 0;
    this.time = 0;
    this.rotTime = 0;

    this.init();
}

ProjectileObject.prototype.init = function() {
    this.drawProjectile();
};

ProjectileObject.prototype.drawProjectile = function() {
    this.projectile = new createjs.Shape();
    this.projectile.x = CONSTANTS.WIDTH/2;
    this.projectile.y = CONSTANTS.HEIGHT/2;
    this.projectile.graphics
                   .beginFill('#fff')
                   .drawPolyStar(0, 0, this.radius, 5, 0.6, 0);
    stage.addChild(this.projectile);
};

//public funs
ProjectileObject.prototype.setPosition = function(position) {
    this.projectile.x = position.x;
    this.projectile.y = position.y;
};

ProjectileObject.prototype.getPosition = function() {
    return {
        x: this.projectile.x,
        y: this.projectile.y
    };
};

ProjectileObject.prototype.getPositionFromCenter = function() {
    return {
        x: this.projectile.x-CONSTANTS.WIDTH/2,
        y: this.projectile.y-CONSTANTS.HEIGHT/2
    };
};

ProjectileObject.prototype.getRadius = function() {
    return this.radius;
};

ProjectileObject.prototype.getShape = function() {
    return this.projectile;
};

ProjectileObject.prototype.pause = function() {
    createjs.Tween.removeTweens(this.projectile);
};

ProjectileObject.prototype.resume = function() {
    createjs.Tween.get(this.projectile).to(this.dest, this.time, createjs.Ease.linear);
    createjs.Tween.get(this.projectile, {loop: true}).to({rotation: 20*Math.PI}, this.rotTime);
};
