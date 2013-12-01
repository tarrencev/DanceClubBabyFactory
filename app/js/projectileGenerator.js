var ProjectileGeneratorObject = function() {
    //private vars
    //declare private vars here
    var projectiles = new createjs.Container();
    var projectileAngle = 0;
    var projectileTarget = { x: -15, y: 0};
    var blocked = 0;

    //private funcs
    function init() {
        
        document.addEventListener("lpPulse", lpPulseHandler,false);
    }

    function lpPulseHandler(event) {
        var dataDiff = event.dataDiff;
        fireProjectile(dataDiff);
    }

    function removeProjectile(index) {
        stage.removeChild(projectiles.getChildAt(index).getShape());
        projectiles.removeChildAt(index);
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

    var count = 0;
    function fireProjectile(dataDiff) {

        if (count === 8) {
            var projectile = drawProjectile();
            var edgePos = calculateProjectileDirection(dataDiff);
            createjs.Tween.get(projectile.getShape()).to(edgePos, 6000 + (500 * dataDiff), createjs.Ease.linear);
            count = 0;
        }
        count++;
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

    };

    init();
};
