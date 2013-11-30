function JuicySplosion(position) {
    this.shape = new createjs.Shape();
    this.shape.x = position.x;
    this.shape.y = position.y;
    this.shape.graphics
              .beginFill("rgba(255,0,0,0.2)")
              .drawCircle(0, 0, 1);

    this.destroy = function() {
        stage.removeChild(this.shape);
    };
    createjs.Tween.get(this.shape).to({scaleX:1000, scaleY:1000, alpha:0}, 1000).call(this.destroy, [], this);
    stage.addChild(this.shape);
}