var BabyObject = function(){
    //private vars
    //declare private vars her
    var radius = 5;
    var baby;

    //private funcs
    function init() {
        drawBaby();
    }

    function drawBaby() {
        baby = new createjs.Shape();
        baby.graphics
            .beginStroke('#fff')
            .setStrokeStyle(5)
            .beginFill('#231f20')
            .drawCircle(CONSTANTS.WIDTH/2, CONSTANTS.HEIGHT/2, radius);

        stage.addChild(baby);
    }

    //public funs
    this.setPosition = function(position) {
        baby.x = position.x;
        baby.y = position.y;
    };

    this.getPosition = function() {
        return {
            x: baby.x,
            y: baby.y
        };
    };

    this.getRadius = function() {
        return radius;
    };

    init();
};