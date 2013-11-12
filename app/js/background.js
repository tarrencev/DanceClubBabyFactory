var BackgroundObject = function(){
    //private vars
    //declare private vars her
    var flare, baseBackground;

    //private funcs
    function init() {
        drawBaseBackground();
        drawFlare();
    }

    function drawBaseBackground() {
        baseBackground = new createjs.Shape();
        baseBackground.graphics
            .beginFill('#000')
            .drawRect(0, 0, CONSTANTS.WIDTH, CONSTANTS.HEIGHT);
        stage.addChild(baseBackground);
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