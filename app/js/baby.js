var BabyObject = function(){
    //private vars
    //declare private vars her
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
            .drawCircle(CONSTANTS.WIDTH/2, CONSTANTS.HEIGHT/2, 5);

        baby.cache(CONSTANTS.WIDTH/2 - 8, CONSTANTS.HEIGHT/2 - 8, 16, 16);
        stage.addChild(baby);
    }

    //public funs
    this.log = function(event) {
        console.log('log public func called');
    };

    init();
};