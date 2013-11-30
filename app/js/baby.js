function BabyObject(){
    // The following variables can be modified outside the object so they're not private
    // But this is for the sake of efficiency (and because of scope)
    this.radius = 5;

    this.init();
}

BabyObject.prototype.init = function() {
    this.drawBaby();
};

BabyObject.prototype.drawBaby = function() {
    this.baby = new createjs.Shape();
    this.baby.graphics
             .beginStroke('#fff')
             .setStrokeStyle(5)
             .beginFill('#231f20')
             .drawCircle(CONSTANTS.WIDTH/2, CONSTANTS.HEIGHT/2, this.radius);

    stage.addChild(this.baby);
};

//public funs
BabyObject.prototype.setPosition = function(position) {
    this.baby.x = position.x;
    this.baby.y = position.y;
};

BabyObject.prototype.getPosition = function() {
    return {
        x: this.baby.x,
        y: this.baby.y
    };
};

BabyObject.prototype.getRadius = function() {
    return this.radius;
};