var ProjectileGeneratorObject = function() {
    //private vars
    //declare private vars here
    var projectiles = new createjs.Container();

    //private funcs
    function init() {
        document.addEventListener("pulse",pulseHandler,false);
    }

    function pulseHandler(event) {
        var dataDiff = event.dataDiff;
        if ((dataDiff > 5 || dataDiff < -5)/* && projectiles.getNumChildren() < 1*/)
            fireProjectile(drawProjectile(), event.dataDiff);

        for (var i = 0; i < projectiles.getNumChildren(); i++) {
            var projectile = projectiles.getChildAt(i).getShape();
            if (projectile.x < 0 || projectile.y < 0 || projectile.x > window.width * 0.8 || projectile.y > window.innerHeight) {
                stage.removeChild(projectiles.getChildAt(i).getShape());
                projectiles.removeChildAt(i);
            }
        }

    }

    function drawProjectile() {
        var projectile = new ProjectileObejct();
        projectiles.addChild(projectile);

        return projectile;
    }

    function fireProjectile(projectile, dataDiff) {
        var edgePos = getRandomEdgePos();
        createjs.Tween.get(projectile.getShape()).to(edgePos, 500 * (dataDiff * 3), createjs.Ease.linear);
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
        var doorAngle = gameObject.getDoor().getAngle()+360;
        var doorHitArc = {
            min: doorAngle - gameObject.getDoor().getWidth()*180/Math.PI/2,
            max: doorAngle + gameObject.getDoor().getWidth()*180/Math.PI/2
        };

        for(var i = 0; i < projectiles.getNumChildren(); i++) {
            //projectiles.getChildAt(i).tick();
            var projPosition = projectiles.getChildAt(i).getPositionFromCenter();
            var distanceFromCenter = Math.sqrt(Math.pow(projPosition.x, 2)+
                                               Math.pow(projPosition.y, 2));
            
            if (distanceFromCenter > doorRadius-doorThickness/2 &&
                distanceFromCenter < doorRadius+doorThickness/2) {
                var projAngle = Math.atan2(projPosition.y,projPosition.x)*180/Math.PI+360;
                //console.log(projAngle + " " + doorAngle);
                if (projAngle > doorHitArc.min && projAngle < doorHitArc.max) {
                    stage.removeChild(projectiles.getChildAt(i).getShape());
                    projectiles.removeChildAt(i);
                }
            }
        }

    };

    init();
};