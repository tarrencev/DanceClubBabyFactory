var PowerUpHudObject = function(){
    this.powerUps = new createjs.Container();
};

PowerUpHudObject.prototype.drawSlowMotion = function() {
    this.slowmoTitle = this.drawPowerUpTitle(0, "1 Marijuana", "#56FC35");
    this.slowmoSubtext = this.drawPowerUpCost(0, SLOWDOWNCOST);
};

PowerUpHudObject.prototype.drawExtenze = function() {
    this.extenzeTitle = this.drawPowerUpTitle(1, "2 Extenze", "#00ffff");
    this.extenzeSubtext = this.drawPowerUpCost(1, EXTENZECOST);
};

PowerUpHudObject.prototype.drawEcstasy = function() {
    this.extenzeTitle = this.drawPowerUpTitle(2, "3 Ecstasy", "#ff00ff");
    this.extenzeSubtext = this.drawPowerUpCost(2, ECSTACYCOST);
};

PowerUpHudObject.prototype.drawMushrooms = function() {
    this.extenzeTitle = this.drawPowerUpTitle(3, "4 Mushrooms", "#0066FF");
    this.extenzeSubtext = this.drawPowerUpCost(3, MUSHROOMSCOST);
};

PowerUpHudObject.prototype.drawPowerUpTitle = function(index, text, color) {
    var title = new createjs.Text(text,
                              "bold 22px Helvetica",
                              color);
    title.x = CONSTANTS.WIDTH - 150;
    title.y = 35 + index * 80;
    title.textBaseline = "alphabetic";
    stage.addChild(title);

    return title;
};

PowerUpHudObject.prototype.drawPowerUpCost = function(index, cost) {
    var subtext = new createjs.Text('x ' + cost,
                              "16px Helvetica",
                              "#FFFFFF");
    subtext.x = CONSTANTS.WIDTH - 100;
    subtext.y = 65 + index * 80;
    subtext.textBaseline = "alphabetic";
    var star = new ProjectileObject(HUD);
    star.setPosition({x: CONSTANTS.WIDTH - 120, y: 60 + index * 80});
    stage.addChild(subtext);

    return {subtext: subtext, star: star};
};

PowerUpHudObject.prototype.destroy = function() {

};
