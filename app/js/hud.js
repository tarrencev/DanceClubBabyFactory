var HudObject = function(){
    var slomoPowerup,
        drugLordPowerup,
        extenzePowerup,
        scoreText,
        score = 0,
        scoreIcon,
        starsText,
        stars = 0,
        starsIcon;

    function init() {
        drawScore();
        drawStars();
        addPowerUp('slowmo');
        // addPowerUp('drugLord');
        addPowerUp('extenze');

        document.addEventListener("birth", incrementScore, false);
        document.addEventListener("blocked", incrementStars, false);
        document.addEventListener("oneKey", function(){
                                                if(stars >= SLOWDOWNCOST)
                                                    decrementStarsBy(SLOWDOWNCOST);
                                            }, false);
        document.addEventListener("twoKey", function(){
                                                if(stars >= EXTENZECOST)
                                                    decrementStarsBy(EXTENZECOST);
                                            }, false);
        document.addEventListener("threeKey", function(){
                                        if(stars >= SLOWDOWNCOST)
                                            decrementStarsBy(50);
                                    } , false);
    }

    function drawScore() {
        scoreText = new createjs.Text(score.toString(),
                              "bold 24px Helvetica",
                              "#FFFFFF");
        scoreText.alpha = 1.0;
        scoreText.x = CONSTANTS.WIDTH/2 - 30;
        scoreText.y = 38;
        scoreText.textBaseline = "alphabetic";
        stage.addChild(scoreText);
        scoreIcon = new createjs.Shape();
        scoreIcon.graphics
             .beginStroke('#fff')
             .setStrokeStyle(5)
             .beginFill('#ec87b8')
             .drawCircle(CONSTANTS.WIDTH/2 - 50, 30, 8);

        stage.addChild(scoreIcon);
    }

    function drawStars() {
        starsText = new createjs.Text(stars.toString(),
                              "bold 24px Helvetica",
                              "#FFFFFF");
        starsText.alpha = 1.0;
        starsText.x = CONSTANTS.WIDTH/2 + 50;
        starsText.y = 38;
        starsText.textBaseline = "alphabetic";
        stage.addChild(starsText);
        starsIcon = new ProjectileObject();
        starsIcon.setPosition({x: CONSTANTS.WIDTH/2 + 30, y: 30});
    }

    function addPowerUp(powerupName) {
        if(powerupName === 'slowmo') {
            slomoPowerup = new PowerUpHudObject();
            slomoPowerup.drawSlowMotion();
        } else if(powerupName === 'drugLord') {
            drugLordPowerup = new PowerUpHudObject();
            drugLordPowerup.drawDrugLord();
        } else if(powerupName === 'extenze') {
            extenzePowerup = new PowerUpHudObject();
            extenzePowerup.drawExtenze();
        }
    }

    function decrementScoreBy(value) {
        score = value;
        scoreText.text = score.toString();
    }

    function incrementScore() {
        score++;
        scoreText.text = score.toString();
    }

    function decrementStarsBy(value) {
        stars -= value;
        starsText.text = stars.toString();
    }

    function incrementStars() {
        stars++;
        starsText.text = stars.toString();
    }

    //public funs
    this.removePowerUp = function(powerupName) {
        if(powerupName === 'slowmo')
            powerup.destroy();
    };

    // this.drawPowerUpIcon = function() {

    // };

    init();
};