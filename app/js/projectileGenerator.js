var ProjectileGeneratorObject = function() {
    //private vars
    //declare private vars here
    var projectiles = new createjs.Container();
    var powerUps = new createjs.Container();
    var projectileAngle = 0;
    var projectileTarget = { x: -15, y: 0};
    var violationEvt;
    var blockedEvt;
    var stars = 0;
    var sloMoActive = false;
    
    var slowPowerTimer;

    //private funcs
    function init() {
        violationEvt = document.createEvent('Event');
        violationEvt.initEvent('violation', true, true);
        blockedEvt = document.createEvent('Event');
        blockedEvt.initEvent('blocked', true, true);

        document.addEventListener("lpPulse", lpPulseHandler, false);
        document.addEventListener("oneKey", firePowerUp, false);
    }

    function lpPulseHandler(event) {
        var dataDiff = event.dataDiff;
        fireProjectile(dataDiff);
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

    function drawProjectile() {
        var projectile = new ProjectileObject();
        projectiles.addChild(projectile);
        
        return projectile;
    }

    function drawPowerUp() {
        var powerUp = new PowerUpObject();
        powerUps.addChild(powerUp);
        
        return powerUp;
    }

    var count = 0;
    function fireProjectile(dataDiff) {
        if (800 < count && count <= 900) {
            var projectile = drawProjectile();
            var edgePos = calculateProjectileDirection(dataDiff);
            var offsetPosition = {
                x: CONSTANTS.WIDTH/2+gameObject.getBabyRepo().getRadius()*Math.cos(projectileAngle), 
                y: CONSTANTS.HEIGHT/2+gameObject.getBabyRepo().getRadius()*Math.sin(projectileAngle)
            };
            projectile.setPosition(offsetPosition);
            createjs.Tween.get(projectile.getShape()).to(edgePos, (4500 + (500 * dataDiff)) * 100/volumeModifier * 1/speedModifier, createjs.Ease.linear);
            count = 0;
        }
        count += parseInt(volumeModifier, 10);
    }

    function firePowerUp() {
        if(stars >= SLOWDOWNCOST && !sloMoActive) {
            gotPowerUp();
        }
    }

    function calculateProjectileDirection(dataDiff) {

        projectileAngle = projectileAngle + Math.PI/8 * dataDiff;

        var newPosition = {
            x: window.innerWidth/2 + 2 * window.innerHeight * Math.cos(projectileAngle),
            y: window.innerHeight/2 + 2 * window.innerHeight * Math.sin(projectileAngle)
        };

        return newPosition;
    }
    
    function blockProjectile(index) {
        var juice = new JuicySplosion(projectiles.getChildAt(index).getPosition(), 25, "#ABF000");
        document.dispatchEvent(blockedEvt);
        stars++;
        removeProjectile(index);
    }

    function gotPowerUp() {
        // var juice = new JuicySplosion(powerUps.getChildAt(index).getPosition(), 50, "#FF00FF");
        // gameObject.incrementStars();
        // removePowerUp(index);
        sloMoActive = true;
        var enterEasing = setInterval(function() {
            speedModifier = speedModifier*0.99 + 0.75*0.01;
            if (speedModifier < 0.76) {
                speedModifier = 0.75;
                clearInterval(enterEasing);
            }
            document.LOLaudio.playbackRate.value = speedModifier;
        }, 10);
        clearTimeout(slowPowerTimer);
        slowPowerTimer = setTimeout(function() {
            speedModifier = 0.76;
            var exitEasing = setInterval(function() {
                speedModifier = (speedModifier-0.5*0.01)/0.99;
                if (speedModifier > 0.99) {
                    speedModifier = 1;
                    clearInterval(exitEasing);
                }
                document.LOLaudio.playbackRate.value = speedModifier;
            }, 10);
        }, 10000);
        sloMoActive = false;
    }

    //public funcs
    // NOT USED?
    this.addProjectile = function() {
        drawProjectile();
    };
    
    // NOT USED?
    this.spawnAndFire = function(dataDiff) {
        fireProjectile(dataDiff);
    };

    this.reset = function() {
        for (var i = 0; i < projectiles.getNumChildren(); i++) {
            stage.removeChild(projectiles.getChildAt(i).getShape());
            projectiles.removeChildAt(i);
        }
        for (i = 0; i < powerUps.getNumChildren(); i++) {
            stage.removeChild(powerUps.getChildAt(i).getShape());
            powerUps.removeChildAt(i);
        }
    };

    this.tick = function() {
        // Checks for when to remove projectiles
        for (var i = 0; i < projectiles.getNumChildren(); i++) {
            // outside stage
            var projectile = projectiles.getChildAt(i).getShape();
            if (projectile.x < 0 || projectile.y < 0 || projectile.x > CONSTANTS.WIDTH || projectile.y > CONSTANTS.HEIGHT) {
                noiseViolation(i);
                continue;
            }
            
            // blocked by door
            var projPosition = projectiles.getChildAt(i).getPositionFromCenter();
            if (gameObject.getDoor().detectCollision(projPosition.x, projPosition.y)) {
                blockProjectile(i);
            }
        }
    };

    this.getProjectiles = function() {
        return projectiles;
    };

    init();
};
