var PowerUpHudObject = function(){
    this.powerUps = new createjs.Container();
};

PowerUpHudObject.prototype.drawSlowMotion = function() {
    this.slowmoTitle = this.drawPowerUpTitle(0, "1 Slow Motion", "#ff00ff");
    this.slowmoSubtext = this.drawPowerUpCost(0, SLOWDOWNCOST);
};

// PowerUpHudObject.prototype.drawDrugLord = function() {
//     this.drugLordTitle = this.drawPowerUpTitle(2, "2 Drug Lord", "#33ff00");
//     this.drugLordSubtext = this.drawPowerUpCost(2, 50);
// };

PowerUpHudObject.prototype.drawExtenze = function() {
    this.extenzeTitle = this.drawPowerUpTitle(1, "2 ExtenZe", "#00ffff");
    this.extenzeSubtext = this.drawPowerUpCost(1, EXTENZECOST);
};

PowerUpHudObject.prototype.drawPowerUpTitle = function(index, text, color) {
    var title = new createjs.Text(text,
                              "20px Helvetica",
                              color);
    title.x = CONSTANTS.WIDTH - 150;
    title.y = 40 + index * 70;
    title.textBaseline = "alphabetic";
    stage.addChild(title);

    return title;
};

PowerUpHudObject.prototype.drawPowerUpCost = function(index, cost) {
    var subtext = new createjs.Text('x ' + cost,
                              "16px Helvetica",
                              "#FFFFFF");
    subtext.x = CONSTANTS.WIDTH - 100;
    subtext.y = 65 + index * 70;
    subtext.textBaseline = "alphabetic";
    var star = new ProjectileObject(HUD);
    star.setPosition({x: CONSTANTS.WIDTH - 120, y: 60 + index * 70});
    stage.addChild(subtext);

    return {subtext: subtext, star: star};
};

PowerUpHudObject.prototype.destroy = function() {

};
