var ProjectileGeneratorObject = function() {
    //private vars
    //declare private vars here
    var projectiles = [];

    //private funcs
    function init() {

    }

    function drawProjectile() {
        var projectile = new ProjectileObejct();
        projectiles.push(projectile);
    }

    //public funcs
    this.addProjectile = function() {
        drawProjectile();
    };

    this.fireProjectile = function() {
        createjs.Tween.get(projectiles[0].getShape()).to({x:100}, 500, createjs.Ease.linear);
    };

    this.tick = function() {

    };

    init();
};