function BabyObject(){
    // The following variables can be modified outside the object so they're not private
    // But this is for the sake of efficiency (and because of scope)
    this.radius = 5;

    //private funcs
    function init() {
        this.drawBaby();
    }

    init();
}

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
BabyObject.prototype.drawBaby = function(position) {
    this.baby.x = position.x;
    this.baby.y = position.y;
};

BabyObject.prototype.drawBaby = function() {
    return {
        x: this.baby.x,
        y: this.baby.y
    };
};

BabyObject.prototype.drawBaby = function() {
    return this.radius;
};