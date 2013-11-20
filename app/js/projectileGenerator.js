var ProjectileGeneratorObject = function() {
    //private vars
    //declare private vars here
    var projectiles = new createjs.Container();
    var projectileAngle = 0;
    var projectileTarget = { x: -15, y: 0};
    var evt;

    //private funcs
    function init() {
        evt = document.createEvent('Event');
        evt.initEvent('noiseViolation', true, true);
        
        document.addEventListener("lpPulse", lpPulseHandler,false);
        document.addEventListener("noiseViolation", noiseViolationHandler);
    }

    function lpPulseHandler(event) {
        var dataDiff = event.dataDiff * 100;

        fireProjectile(drawProjectile(), dataDiff);

        for (var i = 0; i < projectiles.getNumChildren(); i++) {
            var projectile = projectiles.getChildAt(i).getShape();
            if (projectile.x < 0 || projectile.y < 0 || projectile.x > CONSTANTS.WIDTH || projectile.y > CONSTANTS.HEIGHT) {
                evt.projectileIndex = i;
                document.dispatchEvent(evt);
            }
        }
    }

    function removeProjectile(index) {
        stage.removeChild(projectiles.getChildAt(index).getShape());
        projectiles.removeChildAt(index);
    }

    function noiseViolationHandler(event) {
        removeProjectile(event.projectileIndex);
        gameObject.setDamage(5);
        gameObject.getBackground().applyTintToBase(gameObject.getDamage()/100); // TEMP REMOVE ME better way to denote health
    }

    function drawProjectile() {
        var projectile = new ProjectileObejct();
        projectiles.addChild(projectile);

        return projectile;
    }

    var count = 0;
    function fireProjectile(projectile, dataDiff) {

        if (count === 5) {
            var edgePos = calculateProjectileDirection(dataDiff);
            createjs.Tween.get(projectile.getShape()).to(edgePos, 3000, createjs.Ease.linear);
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

    //public funcs
    this.addProjectile = function() {
        drawProjectile();
    };

    this.spawnAndFire = function(dataDiff) {
        fireProjectile(drawProjectile(), dataDiff);
    };

    this.tick = function() {
        var doorRadius = gameObject.getDoor().getRadius();
        var doorThickness = gameObject.getDoor().getThickness();
        var doorAngle = gameObject.getDoor().getAngle();
        var doorHitArc = {
            min: doorAngle - gameObject.getDoor().getWidth()*180/Math.PI/2,
            max: doorAngle + gameObject.getDoor().getWidth()*180/Math.PI/2
        };
        //document.getElementById("debug").innerHTML = doorHitArc.min+", "+doorHitArc.max;
        if (doorHitArc.min < -180) {
            doorHitArc.min = 360+doorHitArc.min;
        }
        if (doorHitArc.max > 180) {
            doorHitArc.max = doorHitArc.max-360;
        }
        //document.getElementById("debug").innerHTML = doorAngle+"<br/>"+ doorHitArc.min+", "+doorHitArc.max;

        for(var i = 0; i < projectiles.getNumChildren(); i++) {
            //projectiles.getChildAt(i).tick();
            var projPosition = projectiles.getChildAt(i).getPositionFromCenter();
            var distanceFromCenter = Math.sqrt(Math.pow(projPosition.x, 2)+
                                               Math.pow(projPosition.y, 2));
            
            if (distanceFromCenter > doorRadius-doorThickness/2 &&
                distanceFromCenter < doorRadius+doorThickness/2) {
                var projAngle = Math.atan2(projPosition.y,projPosition.x)*180/Math.PI;
                //console.log(projAngle + " " + doorAngle);
                if (doorHitArc.min > doorHitArc.max) {
                    /*if (projAngle > doorHitArc.min && projAngle < 180 &&
                        projAngle < doorHitArc.max && projAngle > -180) {
                        removeProjectile(i);
                    }*/
                    if (projAngle > doorHitArc.min || projAngle < doorHitArc.max) {
                        removeProjectile(i);
                    }
                } else if (projAngle > doorHitArc.min && projAngle < doorHitArc.max) {
                    removeProjectile(i);
                }
            }
        }

    };

    init();
};
