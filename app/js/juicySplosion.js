function JuicySplosion(position, scale, color) {
    this.init(position, scale, color);
}

JuicySplosion.prototype.init = function(position, scale, color) {
    this.shape = new createjs.Shape();
    this.shape.x = position.x;
    this.shape.y = position.y;
    this.shape.graphics
              .beginFill(color)
              .drawCircle(0, 0, 1);

    createjs.Tween.get(this.shape).to({scaleX: scale, scaleY: scale, alpha:0}, 1000).call(this.destroy, [], this);
    stage.addChild(this.shape);
};

JuicySplosion.prototype.destroy = function() {
    stage.removeChild(this.shape);
};