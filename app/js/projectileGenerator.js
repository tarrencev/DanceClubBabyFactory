MINTICKSPERPROJECTILE = 5;

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
        //document.addEventListener("hpPulse", hpPulseHandler, false);
        document.addEventListener("oneKey", activateMarijuana, false);
        document.addEventListener("fourKey", activateMushrooms, false);
        document.addEventListener("fiveKey", activateCocaine, false);
    }

    function lpPulseHandler(event) {
        var dataDiff = event.dataDiff;
        fireProjectile(dataDiff, LO);
    }

    function hpPulseHandler(event) {
        var dataDiff = event.dataDiff;
        fireProjectile(dataDiff, HI);
        //console.log(dataDiff);
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
        var juice = new JuicySplosion(projectiles.getChildAt(index).getPosition(), 500, "rgba(255,0,0,0.2)");
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

    var count = 0;
    function fireProjectile(dataDiff, type) {
        if (ticksSinceProjectile > MINTICKSPERPROJECTILE/(volumeModifier/100) && dataDiff > 0.25) {
            var projectile = drawProjectile(type);
            var edgePos = calculateProjectileDirection(rotateDirection*dataDiff*4);
            var offsetPosition = {
                x: CONSTANTS.WIDTH/2+gameObject.getBabyRepo().getRadius()*Math.cos(projectileAngle), 
                y: CONSTANTS.HEIGHT/2+gameObject.getBabyRepo().getRadius()*Math.sin(projectileAngle)
            };
            projectile.setPosition(offsetPosition);
            if(dataDiff > 3) dataDiff = 3;
            if(dataDiff < -3) dataDiff = -3;
            createjs.Tween.get(projectile.getShape()).to(edgePos, (4500 + (500 * dataDiff)) * 100/volumeModifier * 1/speedModifier, createjs.Ease.linear);
            createjs.Tween.get(projectile.getShape(), {loop:true}).to({rotation: 20*Math.PI}, 80 + (250 * dataDiff) * 100/volumeModifier * 1/speedModifier);
            ticksSinceProjectile = 0;
            if (count++%10 === 0) {
                rotateDirection *= getRandomSign(); // maybe direction every 10 shots
            }
        }
    }

    var easeIn = false;
    var easeOut = false;
    function activateMarijuana() {
        if(stars >= SLOWDOWNCOST && !marijuanaActive) {
            stars = stars - SLOWDOWNCOST;
            easeIn = true;
            easeOut = true;
            marijuanaActive = true;
            this.marijuanaCount = 0;
        }
    }

    function activateMushrooms() {
        if(stars >= MUSHROOMSCOST && !mushroomsActive) {
            stars = stars - MUSHROOMSCOST;
            mushroomsActive = true;
            this.mushroomsCount = 0;
        }
    }

    function activateCocaine() {
        if(stars >= COCAINECOST && !cocaineActive) {
            stars = stars - COCAINECOST;
            cocaineActive = true;
            this.cocaineCount = 0;
        }
    }

    function calculateProjectileDirection(dataDiff) {

        projectileAngle = projectileAngle + Math.PI/8 * dataDiff/25*Math.sqrt(ticksSinceProjectile);

        var newPosition = {
            x: window.innerWidth/2 + 2 * window.innerHeight * Math.cos(projectileAngle),
            y: window.innerHeight/2 + 2 * window.innerHeight * Math.sin(projectileAngle)
        };

        return newPosition;
    }
    
    function blockProjectile(index) {
        var juice = new JuicySplosion(projectiles.getChildAt(index).getPosition(), 25, getRandomColorWithOpacity(1.0));
        document.dispatchEvent(blockedEvt);
        stars++;
        removeProjectile(index);
    }

    function mushroomsEffect(index) {

        var projectile = projectiles.getChildAt(index);
        var radius = gameObject.getDoor().getRadius() ;
        var angle = gameObject.getDoor().getAngle() * Math.PI/180;

        var distanceFromCenter = Math.sqrt(Math.pow(projectile.getPositionFromCenter().x, 2)+ Math.pow(projectile.getPositionFromCenter().y, 2));
        if(distanceFromCenter <= radius) {
            var x = CONSTANTS.WIDTH/2 + radius * Math.cos(angle);
            var y = CONSTANTS.HEIGHT/2 + radius * Math.sin(angle);
            createjs.Tween.removeTweens(projectile.getShape());
            createjs.Tween.get(projectile.getShape()).to({x:x, y:y}, (10000 * 1/speedModifier * 1/volumeModifier), createjs.Ease.linear);
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

    this.count = 0;
    this.cocaineCount = 0;
    this.mushroomsCount = 0;
    this.marijuanaCount = 0;
    this.tick = function() {
        // Checks for when to remove projectiles
        for (var i = 0; i < projectiles.getNumChildren(); i++) {
            var projPosition = projectiles.getChildAt(i).getPositionFromCenter();

            if(cocaineActive) {
                blockProjectile(i);
            }

            if(mushroomsActive) {
                mushroomsEffect(i);
            }

            // outside stage
            var projectile = projectiles.getChildAt(i).getShape();
            if (projectile.x < 0 || projectile.y < 0 || projectile.x > CONSTANTS.WIDTH || projectile.y > CONSTANTS.HEIGHT) {
                noiseViolation(i);
                continue;
            }
            
            // blocked by door
            
            if (gameObject.getDoor().detectCollision(projPosition.x, projPosition.y)) {
                blockProjectile(i);
            }
        }
        if(cocaineActive && this.cocaineCount%30 === 0) {
            cocaineActive = false;
            this.cocaineCount = 0;
        }

        if(mushroomsActive && this.mushroomsCount%60 === 0) {
            mushroomsActive = false;
            this.mushroomsCount = 0;
        }

        if(marijuanaActive) {
            console.log('mj active');
            if (this.marijuanaCount%5 === 0 && easeIn) {
                console.log('easing in');
                speedModifier = speedModifier * 0.99 + 0.75 * 0.001;
                if (speedModifier < 0.76) {
                    console.log('eased in');
                    speedModifier = 0.75;
                    easeIn = false;
                }
                document.LOLaudio.playbackRate.value = speedModifier;
            } else if (this.marijuanaCount > 280 && this.marijuanaCount%5 === 0 && easeOut) {
                speedModifier = (speedModifier-0.5*0.001)/0.99;
                console.log('easing out');
                if (speedModifier > 0.99) {
                    speedModifier = 1;
                    marijuanaActive = false;
                    easeOut = false;
                    this.marijuanaCount = 0;
                }
                document.LOLaudio.playbackRate.value = speedModifier;
            }
        }
        this.marijuanaCount++;
        this.cocaineCount++;
        this.count++;
        ticksSinceProjectile++;
    };

    this.getProjectiles = function() {
        return projectiles;
    };

    init();
};
