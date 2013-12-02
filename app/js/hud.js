var HudObject = function(){
    var powerup;
    //public funs
    this.addPowerUp = function(powerupName) {
        if(powerupName == 'slowmo') {
            powerup = new PowerUpHudObject();
            powerup.drawSlowMotion();
        }
    };

    this.removePowerUp = function(powerupName) {
        if(powerupName === 'slowmo')
            powerup.destroy();
    };

    this.drawPowerUpIcon = function() {

    };

    // init();
};