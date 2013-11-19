var ProjectileObejct = function(){
    //private vars
    //declare private vars her
    var projectile;
    var radius = 10;

    //private funcs
    function init() {
        drawProjectile();
    }

    function drawProjectile() {
        projectile = new createjs.Shape();
        projectile.x = CONSTANTS.WIDTH/2;
        projectile.y = CONSTANTS.HEIGHT/2;
        projectile.graphics
            .beginStroke('#fff')
            .beginFill('#ABF000')
            .drawPolyStar(0, 0, radius, 5, 0.6, 0);
        stage.addChild(projectile);
    }

    //public funs
    this.setPosition = function(position) {
        projectile.x = position.x;
        projectile.y = position.y;
    };

    this.getPosition = function() {
        return {
            x: projectile.x,
            y: projectile.y
        };
    };

    this.getPositionFromCenter = function() {
        return {
            x: projectile.x-CONSTANTS.WIDTH/2,
            y: projectile.y-CONSTANTS.HEIGHT/2
        };
    };

    this.getRadius = function() {
        return radius;
    };

    this.getShape = function() {
        return projectile;
    };
    
    this.tick = function() {
    };

    init();
};