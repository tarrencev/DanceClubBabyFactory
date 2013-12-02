var PowerUpHudObject = function(){
    this.titleColor = "#FF00FF";
    this.font = "Arial";
    this.top = 100;
};

PowerUpHudObject.prototype.drawSlowMotion = function() {
    this.drawPowerUpTitle("1 Slow Motion");
    this.drawPowerUpCost(50);
    this.animateIn();
};

PowerUpHudObject.prototype.drawPowerUpTitle = function(text) {
    this.title = new createjs.Text(text,
                              "20px " + this.font,
                              this.titleColor);
    this.title.alpha = 0.2;
    this.title.x = CONSTANTS.WIDTH - 150;
    this.title.y = this.top+40;
    this.title.textBaseline = "alphabetic";
};

PowerUpHudObject.prototype.drawPowerUpCost = function(cost) {
    this.subtext = new createjs.Text('x ' + cost,
                              "16px " + this.font,
                              "#FFFFFF");
    this.subtext.alpha = 0.2;
    this.subtext.x = CONSTANTS.WIDTH - 100;
    this.subtext.y = this.top+65;
    this.subtext.textBaseline = "alphabetic";
    this.star = new ProjectileObject();
    this.star.setPosition({x: CONSTANTS.WIDTH - 120, y: this.top+60});
};

PowerUpHudObject.prototype.animateIn = function() {
    createjs.Tween.get(this.title).to({alpha:1}, 1000);
    createjs.Tween.get(this.subtext).to({alpha:1}, 1000);
    stage.addChild(this.title);
    stage.addChild(this.subtext);
};

PowerUpHudObject.prototype.destroy = function() {
    createjs.Tween.get(this.title).to({alpha:0}, 1000);
    createjs.Tween.get(this.subtext).to({alpha:0}, 1000);
    stage.removeChild(this.title);
    stage.removeChild(this.subtext);
    stage.removeChild(this.star.getShape());
};
