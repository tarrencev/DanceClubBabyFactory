var HudObject = function(){
    var slomoPowerup,
        extenzePowerup,
        ecstasyPowerup,
        scoreText,
        score = 0,
        scoreIcon,
        starsText,
        stars = 0,
        starsIcon;

    function init() {
        drawScore();
        drawStars();
        addPowerUps('slowmo');

        document.addEventListener("birth", incrementScore, false);
        document.addEventListener("blocked", incrementStars, false);
        document.addEventListener("oneKey", function(){
                                                if(stars >= SLOWDOWNCOST) {
                                                    renderTextAlert('Slow Motion');
                                                    decrementStarsBy(SLOWDOWNCOST);
                                                }
                                            }, false);
        document.addEventListener("twoKey", function(){
                                                if(stars >= EXTENZECOST) {
                                                    renderTextAlert('Extenze');
                                                    decrementStarsBy(EXTENZECOST);
                                                }
                                            }, false);
        document.addEventListener("threeKey", function(){
                                        if(stars >= SLOWDOWNCOST)
                                            decrementStarsBy(50);
                                    } , false);
    }

    function drawScore() {
        scoreText = new createjs.Text(score.toString(),
                              "32px Helvetica",
                              "#FFFFFF");
        scoreText.alpha = 1.0;
        scoreText.x = CONSTANTS.WIDTH/2 - 30;
        scoreText.y = 40;
        scoreText.textBaseline = "alphabetic";
        stage.addChild(scoreText);
        scoreIcon = new createjs.Shape();
        scoreIcon.graphics
             .beginStroke('#d49')
             .setStrokeStyle(2.5)
             .beginFill('#fff')
             .drawCircle(CONSTANTS.WIDTH/2 - 50, 30, 12);

        stage.addChild(scoreIcon);
    }

    function drawStars() {
        starsText = new createjs.Text(stars.toString(),
                              "32px Helvetica",
                              "#FFFFFF");
        starsText.alpha = 1.0;
        starsText.x = CONSTANTS.WIDTH/2 + 50;
        starsText.y = 40;
        starsText.textBaseline = "alphabetic";
        stage.addChild(starsText);
        starsIcon = new ProjectileObject(HUD);
        starsIcon.setPosition({x: CONSTANTS.WIDTH/2 + 30, y: 30});
    }

    function addPowerUps() {
            slomoPowerup = new PowerUpHudObject();
            slomoPowerup.drawSlowMotion();

            extenzePowerup = new PowerUpHudObject();
            extenzePowerup.drawExtenze();

            ecstasyPowerup = new PowerUpHudObject();
            ecstasyPowerup.drawEcstasy();
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

    function renderTextAlert(text) {
        var alert = new createjs.Text(text,
                              "bold 24px Helvetica",
                              "#FFFFFF");
        alert.alpha = 0.8;
        alert.textAlign = "center";
        alert.textBaseline = "middle";
        alert.x = CONSTANTS.WIDTH/2;
        alert.y = CONSTANTS.HEIGHT/2;
        createjs.Tween.get(alert).to({scaleX: 20, scaleY: 20, alpha:0}, 900).call(this.destroy, [], this);
        stage.addChild(alert);
    }

    this.renderStartTimer = function(){
        var second = 3;
        renderTextAlert(second.toString());
        var enterEasing = setInterval(function() {
            second--;
            if (second === 0) {
                clearInterval(enterEasing);
                renderTextAlert("Go!");
                gameObject.getAudioPlayer().play();
            } else renderTextAlert(second.toString());
            
        }, 1000);
    };

    this.renderTextAlert = function(text) {
        renderTextAlert(text);
    };

    init();
};