function BabyRepoObject() {
    this.radius = 75;
    this.strokeWidth = 4;
    this.babies = new createjs.Container();
    this.init();
}

BabyRepoObject.prototype.init = function() {
    this.drawContainer();
    this.birthEvt = document.createEvent('Event');
    this.birthEvt.initEvent('birth', true, true);
};

BabyRepoObject.prototype.drawContainer = function() {
    this.container = new createjs.Shape();
    this.container.x = CONSTANTS.WIDTH/2;
    this.container.y = CONSTANTS.HEIGHT/2;
    this.container.graphics
        .beginStroke('#df2b90')
        .setStrokeStyle(this.strokeWidth)
        .beginFill('#ec87b8')
        .drawCircle(0, 0, this.radius);

    stage.addChild(this.container);
};

BabyRepoObject.prototype.drawBaby = function() {
    var baby = new BabyObject();
    var tries = 0;
    while (this.checkForCollisions(baby) && tries++ < 10) {
        baby.setPosition(this.getRandomPos(baby));
    }
    this.babies.addChild(baby);
    document.dispatchEvent(this.birthEvt);
};

BabyRepoObject.prototype.checkForCollisions = function(baby_) {
    for (var i = 0; i < this.babies.getNumChildren(); i++) {
        if(circlesDoCollide(this.babies.getChildAt(i), baby_))
            return true;
    }
    return false;
};

BabyRepoObject.prototype.getRandomPos = function(baby) {
    var angle = Math.PI*2*Math.random();
    var distance = Math.random()*(this.radius - this.strokeWidth);
    var position = {
        x: Math.cos(angle)*distance,
        y: Math.sin(angle)*distance
    };
    return position;
};

BabyRepoObject.prototype.addBaby = function() {
    this.drawBaby();
};

BabyRepoObject.prototype.getPosition = function() {
    return {
        x: this.container.x,
        y: this.container.y
    };
};

BabyRepoObject.prototype.getRadius = function() {
    return this.radius;
};

BabyRepoObject.prototype.getNumBabies = function() {
    return this.babies.getNumChildren();
};

BabyRepoObject.prototype.reset = function() {
    for (var i = 0; i < this.babies.getNumChildren(); i++) {
        stage.removeChild(this.babies.getChildAt(i).baby);
    }
    this.babies.removeAllChildren();
};
