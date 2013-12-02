var ProjectileGeneratorObject = function() {
    //private vars
    //declare private vars here
    var projectiles = new createjs.Container();
    var powerUps = new createjs.Container();
    var projectileAngle = 0;
    var projectileTarget = { x: -15, y: 0};
    var blocked = 0;

    //private funcs
    function init() {
        
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
        gameObject.setDamage(5);
        blocked = 0;
        if (gameObject.getDamage() > 100) {
            gameObject.getAudioPlayer().playPause();
        }
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
            createjs.Tween.get(projectile.getShape()).to(edgePos, (6000 + (500 * dataDiff)) * 100/volumeModifier * 1/speedModifier, createjs.Ease.linear);
            count = 0;
        }
        count += parseInt(volumeModifier, 10);
    }

    function firePowerUp() {
        console.log('fire powerup');
        var stars = gameObject.getNumStars();
        if(stars >= 25) {
            var dataDiff = 1;
            var powerUp = drawPowerUp();
            var edgePos = calculateProjectileDirection(dataDiff);
            createjs.Tween.get(powerUp.getShape()).to(edgePos, (6000 + (500 * dataDiff)) * 100/volumeModifier * 1/speedModifier, createjs.Ease.linear);
            gameObject.setNumStars(stars - 50);
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
        gameObject.incrementStars();
        removeProjectile(index);
        blocked++;
    }

    function gotPowerUp(index) {
        var juice = new JuicySplosion(powerUps.getChildAt(index).getPosition(), 50, "#FF00FF");
        speedModifier = 0.5;
        gameObject.incrementStars();
        removePowerUp(index);
        setTimeout(function() {
            speedModifier = 1;
        }, 10000);
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

    this.tick = function() {
        // Checks for when to remove projectiles
        for (var i = 0; i < projectiles.getNumChildren(); i++) {
            var projectile = projectiles.getChildAt(i).getShape();
            if (projectile.x < 0 || projectile.y < 0 || projectile.x > CONSTANTS.WIDTH || projectile.y > CONSTANTS.HEIGHT) {
                noiseViolation(i);
                continue;
            }
            
            var projPosition = projectiles.getChildAt(i).getPositionFromCenter();
            if (gameObject.getDoor().detectCollision(projPosition.x, projPosition.y)) {
                blockProjectile(i);
            }
        }

        for (i = 0; i < powerUps.getNumChildren(); i++) {
            var powerUp = powerUps.getChildAt(i).getShape();
            if (powerUp.x < 0 || powerUp.y < 0 || powerUp.x > CONSTANTS.WIDTH || powerUp.y > CONSTANTS.HEIGHT) {
                removePowerUp(i);
            }
            
            var powerUpPosition = powerUps.getChildAt(i).getPositionFromCenter();
            if (gameObject.getDoor().detectCollision(powerUpPosition.x, powerUpPosition.y)) {
                gotPowerUp(i);
            }
        }

    };

    init();
};
