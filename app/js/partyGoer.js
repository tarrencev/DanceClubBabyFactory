var PartyGoerObject = function(type_) {
    //private vars
    this.type = type_;
    this.radius = 7;
    this.wantToParty = false;

    this.init();
};

//private funcs
PartyGoerObject.prototype.init = function() {
    this.drawGoer();

    var pos = getRandomEdgePos(this.goer);
    this.goer.x = pos.x;
    this.goer.y = pos.y;
};

// PartyGoerObject.prototype.ecstasy = function() {
//     this.goer.graphics.clear();
//     this.goer.graphics
//              .beginFill(getRandomColorWithOpacity(1.0))
//              .drawCircle(this.goer.x, this.goer.y, this.radius);
// };

PartyGoerObject.prototype.drawGoer = function() {
    this.goer = new createjs.Shape();
    this.goer.graphics
             .beginStroke('#555')
             .setStrokeStyle(1.5)
             .beginFill('#000')
             .drawCircle(0, 0, this.radius);

    stage.addChild(this.goer);
};

//public funs
PartyGoerObject.prototype.setPosition = function(position) {
    this.goer.x = position.x;
    this.goer.y = position.y;
};

PartyGoerObject.prototype.getPosition = function() {
    return {
        x: this.goer.x,
        y: this.goer.y
    };
};

PartyGoerObject.prototype.getRadius = function() {
    return this.radius;
};

PartyGoerObject.prototype.getShape = function() {
    return this.goer;
};

PartyGoerObject.prototype.checkWantToParty = function() {
    return this.wantToParty;
};

PartyGoerObject.prototype.likeParty = function() {
    this.wantToParty = true;
};

PartyGoerObject.prototype.hateParty = function() {
    this.wantToParty = false;
};

/*PartyGoerObject.prototype.checkLeaving = function() {
    return this.leaving;
};

PartyGoerObject.prototype.isLeaving = function() {
    this.leaving = true;
};

PartyGoerObject.prototype.notLeaving = function() {
    this.leaving = false;
};*/

PartyGoerObject.prototype.removeFromStage = function() {
    stage.removeChild(this.goer);
};
