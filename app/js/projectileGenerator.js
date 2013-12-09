var ProjectileGeneratorObject = function() {
    //private vars
    //declare private vars here
    var projectiles = new createjs.Container();
    var powerUps = new createjs.Container();
    var projectileAngle = 0;
    var projectileTarget = { x: -15, y: 0};
    var ticksSinceProjectile = 0;
    var rotateDirection = 1;
    var violationEvt;
    var blockedEvt;
    var stars = 0;
    var marijuanaActive = false;
    var mushroomsActive = false;
    var cocaineActive = false;
    
    var marijuanaTimer;

    //private funcs
    function init() {
        violationEvt = document.createEvent('Event');
        violationEvt.initEvent('violation', true, true);
        blockedEvt = document.createEvent('Event');
        blockedEvt.initEvent('blocked', true, true);

        document.addEventListener("lpPulse", lpPulseHandler, false);
        document.addEventListener("hpPulse", hpPulseHandler, false);
        document.addEventListener("oneKey", activateMarijuana, false);
        // document.addEventListener("fourKey", activateMushrooms, false);
        document.addEventListener("fourKey", activateCocaine, false);
    }

    function lpPulseHandler(event) {
        var dataDiff = event.dataDiff;
        fireProjectile(dataDiff, LO);
    }

    function hpPulseHandler(event) {
        var dataDiff = event.dataDiff;
        fireProjectile(dataDiff, HI);
    }
    function removeProjectile(index) {
        stage.removeChild(projectiles.getChildAt(index).getShape());
        projectiles.removeChildAt(index);
    }

    function removePowerUp(index) {
        stage.removeChild(powerUps.getChildAt(index).getShape());
        powerUps.removeChildAt(index);
    }

    function noiseViolation(index) {
        var juice = new JuicySplosion(projectiles.getChildAt(index).getPosition(), 500, "rgba(255,0,0,0.4)");
        removeProjectile(index);
        document.dispatchEvent(violationEvt);
    }

    function drawProjectile(type) {
        var projectile = new ProjectileObject(type);
        projectiles.addChild(projectile);
        
        return projectile;
    }

    function drawPowerUp() {
        var powerUp = new PowerUpObject();
        powerUps.addChild(powerUp);
        
        return powerUp;
    }

    var projectileCounter = 0;
    function fireProjectile(dataDiff, type) {
        if (ticksSinceProjectile > MINTICKSPERPROJECTILE/(volumeModifier/100) && dataDiff > 0.25) {
            if(dataDiff > 4) dataDiff = 4;
            if(dataDiff < -4) dataDiff = -4;
            var projectile = drawProjectile(type);
            var edgePos = calculateProjectileDirection(rotateDirection*dataDiff*5);
            var offsetPosition = {
                x: CONSTANTS.WIDTH/2+gameObject.getBabyRepo().getRadius()*Math.cos(projectileAngle), 
                y: CONSTANTS.HEIGHT/2+gameObject.getBabyRepo().getRadius()*Math.sin(projectileAngle)
            };
            projectile.setPosition(offsetPosition);
            createjs.Tween.get(projectile.getShape()).to(edgePos, (4500 + (500 * dataDiff)) * 100/volumeModifier * 1/speedModifier * 1/PROGRESSMODIFIER, createjs.Ease.linear);
            createjs.Tween.get(projectile.getShape(), {loop:true}).to({rotation: 20*Math.PI}, 80 + (250 * dataDiff) * 100/volumeModifier * 1/speedModifier);
            ticksSinceProjectile = 0;
            if (projectileCounter++%10 === 0) {
                rotateDirection *= getRandomSign(); // maybe direction every 10 shots
            }
        }
    }

    var easeIn = false;
    var easeOut = false;
    function activateMarijuana() {
        if(gameObject.getHud().getStars() >= SLOWDOWNCOST && !marijuanaActive) {
            console.log("Marijuana activated");
            easeIn = true;
            marijuanaActive = true;
            marijuanaCount = 0;
            gameObject.getHud().renderTextAlert("Marijuana");
            gameObject.getHud().decrementStarsBy(SLOWDOWNCOST);
        }
    }

    // function activateMushrooms() {
    //     if(stars >= MUSHROOMSCOST && !mushroomsActive) {
    //         stars = stars - MUSHROOMSCOST;
    //         mushroomsActive = true;
    //         mushroomsCount = 0;
    //         gameObject.getHud().renderTextAlert("Mushrooms");
    //         gameObject.getHud().decrementStarsBy(MUSHROOMSCOST);
    //     }
    // }

    function activateCocaine() {
        if(gameObject.getHud().getStars() >= COCAINECOST && !cocaineActive) {
            cocaineActive = true;
            cocaineCount = 0;
            gameObject.getHud().renderTextAlert("Cocaine");
            gameObject.getHud().decrementStarsBy(COCAINECOST);
        }
    }

    function calculateProjectileDirection(dataDiff) {

        projectileAngle = projectileAngle + Math.PI/8 * Math.sqrt(Math.abs(dataDiff)) * dataDiff/Math.abs(dataDiff) * Math.sqrt(ticksSinceProjectile) / 10;

        var newPosition = {
            x: window.innerWidth/2 + 2 * window.innerHeight * Math.cos(projectileAngle),
            y: window.innerHeight/2 + 2 * window.innerHeight * Math.sin(projectileAngle)
        };

        return newPosition;
    }
    
    function blockProjectile(index) {
        var juice = new JuicySplosion(projectiles.getChildAt(index).getPosition(), 50, getRandomColorWithOpacity(1.0));
        document.dispatchEvent(blockedEvt);
        removeProjectile(index);
    }

    function mushroomsEffect(index) {

        var projectile = projectiles.getChildAt(index);
        var radius = gameObject.getDoor().getRadius();
        var angle = gameObject.getDoor().getAngle() * Math.PI/180;

        var distanceFromCenter = Math.sqrt(Math.pow(projectile.getPositionFromCenter().x, 2)+ Math.pow(projectile.getPositionFromCenter().y, 2));
        if(distanceFromCenter <= radius) {
            var x = CONSTANTS.WIDTH/2 + radius * Math.cos(angle);
            var y = CONSTANTS.HEIGHT/2 + radius * Math.sin(angle);
            createjs.Tween.removeTweens(projectile.getShape());
            createjs.Tween.get(projectile.getShape()).to({x:x, y:y}, (30000 * 1/speedModifier * 1/volumeModifier), createjs.Ease.linear);
        }
    }

    //public funcs
    // NOT USED?
    this.addProjectile = function() {
        drawProjectile();
    };

    this.reset = function() {
        stars = 0;
        for (var i = 0; i < projectiles.getNumChildren(); i++) {
            stage.removeChild(projectiles.getChildAt(i).getShape());
            projectiles.removeChildAt(i);
        }
        for (i = 0; i < powerUps.getNumChildren(); i++) {
            stage.removeChild(powerUps.getChildAt(i).getShape());
            powerUps.removeChildAt(i);
        }
    };
    
    var cocaineCount = 0;
    var mushroomsCount = 0;
    var marijuanaCount = 0;
    this.tick = function() {
        // Checks for when to remove projectiles
        for (var i = 0; i < projectiles.getNumChildren(); i++) {
            var projPosition = projectiles.getChildAt(i).getPositionFromCenter();

            // outside stage
            var projectile = projectiles.getChildAt(i).getShape();
            if (projectile.x < 0 || projectile.y < 0 || projectile.x > CONSTANTS.WIDTH || projectile.y > CONSTANTS.HEIGHT) {
                noiseViolation(i);
                continue;
            }
            
            // blocked by door
            if(mushroomsActive) {
                mushroomsEffect(i);
            }
            
            if (gameObject.getDoor().detectCollision(projPosition.x, projPosition.y)) {
                blockProjectile(i);
            }

            if(cocaineActive) {
                blockProjectile(i);
            }
        }
        if(cocaineActive && cocaineCount > 10) {
            cocaineActive = false;
            cocaineCount = 0;
        }

        // if(mushroomsActive && mushroomsCount > 120) {
        //     mushroomsActive = false;
        //     mushroomsCount = 0;
        // }

        if(marijuanaActive) {
            if (marijuanaCount%3 === 0 && easeIn) {
                console.log('easing in ' + speedModifier.toString());
                speedModifier = speedModifier * 0.99 + 0.75 * 0.001;
                if (speedModifier < 0.76) {
                    console.log('eased in');
                    speedModifier = 0.75;
                    easeIn = false;
                    easeOut = true;
                    marijuanaCount = 0;
                }
                document.LOLaudio.playbackRate.value = speedModifier;
            } else if (marijuanaCount > 70 && marijuanaCount%5 === 0 && easeOut) {
                console.log('easing out' + speedModifier.toString());
                speedModifier = (speedModifier-0.5*0.001)/0.99;
                if (speedModifier > 0.98) {
                    console.log('eased out');
                    speedModifier = 1;
                    marijuanaActive = false;
                    easeOut = false;
                    marijuanaCount = 0;
                }
                document.LOLaudio.playbackRate.value = speedModifier;
            }
        }
        marijuanaCount++;
        cocaineCount++;
        mushroomsCount++;
        ticksSinceProjectile++;
    };

    this.getProjectiles = function() {
        return projectiles;
    };

    this.getMarijuanaStatus = function() {
        return marijuanaActive;
    };

    init();
};
