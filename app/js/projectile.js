function ProjectileObject(type) {
    // The following variables can be modified outside the object so they're not private
    // But this is for the sake of efficiency (and because of scope)
    //this.projectile; // DO NOT MODIFY THIS VARIABLE DIRECTLY!
    // radius not used
    this.radius = 14;
    this.type = type;

    this.init();
}

ProjectileObject.prototype.init = function() {
    this.drawProjectile();
};

ProjectileObject.prototype.drawProjectile = function() {
    this.projectile = new createjs.Shape();
    this.projectile.x = CONSTANTS.WIDTH/2;
    this.projectile.y = CONSTANTS.HEIGHT/2;
    if (this.type === LO) {
        this.projectile.graphics
                       .beginFill('#fff')
                       .drawPolyStar(0, 0, this.radius, 5, 0.6, 0);
    } else if (this.type === HUD) {
        this.projectile.graphics
                       .beginFill('#fff')
                       .drawPolyStar(0, 0, this.radius, 5, 0.6, 0);
    }else {
        this.projectile.graphics
                       .beginStroke('#fff')
                       .beginFill('#00F0AB')
                       .drawPolyStar(0, 0, this.radius, 5, 0.6, 0);
    }
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