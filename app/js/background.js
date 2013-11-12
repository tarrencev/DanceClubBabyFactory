var BackgroundObject = function(){
    //private vars
    //declare private vars her
    var flare;

    //private funcs
    function init() {
        drawFlare();
    }

    function drawFlare() {
        var position = {
            x: CONSTANTS.WIDTH/2,
            y: CONSTANTS.HEIGHT/2
        };

        flare = new createjs.Shape();
        flare.graphics
            .beginRadialGradientFill(["#f15a29","#000"], [0, 1], position.x, position.y, 0, position.x, position.y, 250)
            .drawCircle(position.x, position.y, 250);
        stage.addChild(flare);
    }

    init();
};