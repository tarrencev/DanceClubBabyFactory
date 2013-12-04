var PartyGoerObject = function(type_) {
    //private vars
    //declare private vars here
    this.type = type_;
    this.radius = 8;
    this.beenToParty = false;

    this.init();
};

//private funcs
PartyGoerObject.prototype.init = function() {
    if (this.type === "DrugDealer")
        this.drawDrugDealer();
    /*else if (this.type === "Underage")
        this.drawUnderAge();*/
    else
        this.drawGoer();

    var pos = getRandomEdgePos(this.goer);
    this.goer.x = pos.x;
    this.goer.y = pos.y;
};

PartyGoerObject.prototype.drawGoer = function() {
    this.goer = new createjs.Shape();
    this.goer.graphics
             .beginStroke('#aaa')
             .setStrokeStyle(5)
             .beginFill('#000')
             .drawCircle(0, 0, this.radius);

    stage.addChild(this.goer);
};

PartyGoerObject.prototype.drawDrugDealer = function() {
    this.goer = new createjs.Shape();
    this.goer.graphics
             .beginStroke('#a0a0a0')
             .setStrokeStyle(5)
             .beginFill('#ff0000')
             .drawCircle(0, 0, this.radius);

    stage.addChild(this.goer);
};

PartyGoerObject.prototype.drawUnderAge = function() {
    this.goer = new createjs.Shape();
    this.goer.graphics
             .beginStroke('#a0a0a0')
             .setStrokeStyle(5)
             .beginFill('#ffff00')
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

PartyGoerObject.prototype.checkHasBeenToParty = function() {
    return this.beenToParty;
};

PartyGoerObject.prototype.hasBeenToParty = function() {
    this.beenToParty = true;
};

PartyGoerObject.prototype.removeFromStage = function() {
    stage.removeChild(this.goer);
};
