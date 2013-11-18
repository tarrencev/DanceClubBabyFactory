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
        if(dataDiff > 5 || dataDiff < -5)
            fireProjectile(drawProjectile(), event.dataDiff);

        for(var i = 0; i < projectiles.getNumChildren(); i++) {
            var projectile = projectiles.getChildAt(i).getShape();
            if(projectile.x < 0 || projectile.y < 0 || projectile.x > window.width * 0.8 || projectile.y > window.innerHeight) {
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

    };

    init();
};