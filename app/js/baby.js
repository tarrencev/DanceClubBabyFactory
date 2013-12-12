function BabyObject(){
    this.radius = 5;
    this.init();
}

BabyObject.prototype.init = function() {
    this.drawBaby();
};

BabyObject.prototype.drawBaby = function() {
    this.baby = new createjs.Shape();
    this.baby.graphics
             .beginStroke('#d49')
             .setStrokeStyle(1.5)
             .beginFill('#fff')//'#231f20')
             .drawCircle(CONSTANTS.WIDTH/2, CONSTANTS.HEIGHT/2, this.radius);

    stage.addChild(this.baby);
};

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