var HudObject = function(){
    var slomoPowerup,
        extenzePowerup,
        ecstasyPowerup,
        mushroomsPowerup,
        cocainePowerup,
        scoreText,
        score = 0,
        scoreIcon,
        starsText,
        stars = 0,
        starsIcon,
        heat = 0,
        heatText,
        heatMeter;
    var LoseEvt;

    function init() {
        drawScore();
        drawStars();
        drawHeat();
        addPowerUps();
        drawInstructions();
        
        LoseEvt = document.createEvent('Event');
        LoseEvt.initEvent('lose', true, true);

        document.addEventListener("birth", incrementScore, false);
        document.addEventListener("blocked", incrementStars, false);
        document.addEventListener("violation", violationHandler, false);
    }
    
    function violationHandler(event) {
        if (gameObject.getAudioPlayer().isPlaying()) {
            heat += 5.9;
            var siren = gameObject.getAudioPlayer().getSound().getSiren();
            if (heat < 118) {
                createjs.Tween.get(siren, {override: true})
                              .to({volume: 1}, 500).call(function() {
                                  createjs.Tween.get(siren)
                                                .to({volume: 0.2*heat/118}, 1500);
                });
            } else {
                heat = 118;
                gameObject.getAudioPlayer().stopPlayback();
                createjs.Tween.get(siren, {override: true})
                              .to({volume: 1}, 1000).call(function() {
                                  createjs.Tween.get(siren).to({volume: 0}, 3000);
                });
                displayScoreScreen();
                document.dispatchEvent(LoseEvt);
            }
            updateHeat();
        }
    }
    
    function handleSongEnd() {
        gameObject.getAudioPlayer().stopPlayback();
        displayScoreScreen();
    }


    function displayScoreScreen() {
        $('#winState').show();
        var scoreValue = $('#playerScoreValue');
        var starsValue = $('#starsScoreValue');
        var babiesValue = $('#babiesScoreValue');
        
        var babiesCounter = 0;
        var scoreCounter = 0;
        var babiesInterval = setInterval(function() {
            if (babiesCounter > 0) scoreCounter = scoreCounter + 1000;
            scoreValue.text("$" + commaSeparateNumber(scoreCounter));
            babiesValue.text(babiesCounter.toString() + " x $1000");
            if(babiesCounter === score) {
                var starsCounter = 0;
                var starsInterval = setInterval(function() {
                    if (starsCounter > 0) scoreCounter = scoreCounter + 100;
                    scoreValue.text("$" + commaSeparateNumber(scoreCounter));
                    starsValue.text(starsCounter.toString());
                    if(starsCounter === stars) {
                        clearInterval(starsInterval);
                    }
                    starsCounter++;
                }, 100/stars);
                clearInterval(babiesInterval);
            }
            babiesCounter++;
        }, 100/babiesCounter);
    }

    function commaSeparateNumber(val){
        while (/(\d+)(\d{3})/.test(val.toString())){
            val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
        }
        return val;
    }
    function drawHeat() {
        heatText = new createjs.Text("Heat",
                              "27px Helvetica",
                              "#FFFFFF");
        heatText.alpha = 1.0;
        heatText.x = CONSTANTS.WIDTH/2 - 165;
        heatText.y = 39;
        heatText.textBaseline = "alphabetic";
        stage.addChild(heatText);

        var heatOutline = new createjs.Shape();
        heatOutline.graphics.setStrokeStyle(2).beginStroke("#fff")
                            .drawRect(CONSTANTS.WIDTH/2 - 95, 17, 120, 25);
        stage.addChild(heatOutline);

        heatMeter = new createjs.Shape();
        heatMeter.x = CONSTANTS.WIDTH/2 - 94;
        heatMeter.y = 18;
        heatMeter.graphics.beginFill("#FF0A0A").drawRect(0, 0, 1, 23);
        stage.addChild(heatMeter);
    }
    
    function updateHeat() {
        console.log(heat);
        createjs.Tween.get(heatMeter).to({scaleX: heat, scaleY: 1}, 500, createjs.Ease.quartIn);
    }

    function drawScore() {
        scoreText = new createjs.Text(score.toString(),
                              "32px Helvetica",
                              "#FFFFFF");
        scoreText.alpha = 1.0;
        scoreText.x = CONSTANTS.WIDTH/2 + 80;
        scoreText.y = 41;
        scoreText.textBaseline = "alphabetic";
        stage.addChild(scoreText);
        scoreIcon = new createjs.Shape();
        scoreIcon.graphics
             .beginStroke('#d49')
             .setStrokeStyle(2.5)
             .beginFill('#fff')
             .drawCircle(CONSTANTS.WIDTH/2 + 55, 30, 12);

        stage.addChild(scoreIcon);
    }

    function drawStars() {
        starsText = new createjs.Text(stars.toString(),
                              "32px Helvetica",
                              "#FFFFFF");
        starsText.alpha = 1.0;
        starsText.x = CONSTANTS.WIDTH/2  + 165;
        starsText.y = 41;
        starsText.textBaseline = "alphabetic";
        stage.addChild(starsText);
        starsIcon = new ProjectileObject();
        starsIcon.setPosition({x: CONSTANTS.WIDTH/2 + 140, y: 30});
    }

    function addPowerUps() {
            slomoPowerup = new PowerUpHudObject();
            slomoPowerup.drawSlowMotion();

            extenzePowerup = new PowerUpHudObject();
            extenzePowerup.drawExtenze();

            ecstasyPowerup = new PowerUpHudObject();
            ecstasyPowerup.drawEcstasy();

            cocainePowerup = new PowerUpHudObject();
            cocainePowerup.drawCocaine();
    }

    function drawInstructions() {
        document.getElementById("instructions").style.display = "block";
        var steps = ["repoInstruct", "scoreInstruct", "doorInstruct", "heatInstruct", "bonusInstruct", "powerupsInstruct", "drugs", "startInstruct"];
        var currentStep = 0;
        document.getElementById(steps[currentStep]).style.display = "inline";
        document.getElementById("next").addEventListener("click", function(){
            document.getElementById(steps[currentStep++]).style.display = "none";
            document.getElementById(steps[currentStep]).style.display = "inline";
            if (currentStep >= steps.length-1) {
                document.getElementById("next").style.display = "none";
                document.getElementById("instructions").style.pointerEvents = "none";
            }
        });
    }

    function incrementScore() {
        score++;
        scoreText.text = score.toString();
    }

    function decrementStarsBy(value) {
        stars -= value;
        starsText.text = stars.toString();
    }

    document.addEventListener("fiveKey", incrementStars, false);
    function incrementStars() {
        stars++;
        starsText.text = stars.toString();
    }

    //public funs
    function renderTextAlert(text) {
        var alert = new createjs.Text(text,
                              "bold 24px Helvetica",
                              "#FFFFFF");
        alert.alpha = 0.8;
        alert.textAlign = "center";
        alert.textBaseline = "middle";
        alert.x = CONSTANTS.WIDTH/2;
        alert.y = CONSTANTS.HEIGHT/2;
        createjs.Tween.get(alert).to({scaleX: 20, scaleY: 20, alpha:0}, 900).call(function() {stage.removeChild(alert);});
        stage.addChild(alert);
    }

    this.displayScoreScreen = function() {
        displayScoreScreen();
    };

    this.getStars = function() {
        return stars;
    };
    
    this.resetHeat = function() {
        heat = 0.001;
        updateHeat();
    };

    this.renderStartTimer = function(){
        var second = 3;
        renderTextAlert(second.toString());
        gameObject.getAudioPlayer().countingDown = true;
        var enterEasing = setInterval(function() {
            second--;
            if (second === 0) {
                clearInterval(enterEasing);
                renderTextAlert("Go!");
                gameObject.getAudioPlayer().countingDown = false;
                gameObject.getAudioPlayer().play();
                gameObject.getAudioPlayer().getSound().getSong().addEventListener("complete", handleSongEnd, false);
            } else renderTextAlert(second.toString());
            
        }, 1000);
    };
    
    this.tick = function() {
        if (heat > 0) {
            heat -= 0.05 * speedModifier;
            updateHeat();
        }
    };

    this.reset = function() {
        console.log("Hud RESET");
        heat = 0.001;
        updateHeat();
        stars = 0;
        starsText.text = "0";
        score = 0;
        scoreText.text = "0";
    };

    this.renderTextAlert = function(text) {
        renderTextAlert(text);
    };

    this.decrementStarsBy = function(value) {
        console.log(value);
        stars -= value;
        starsText.text = stars.toString();
    };

    init();
};