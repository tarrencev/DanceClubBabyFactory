var BackgroundObject = function(){
    //private vars
    //declare private vars her
    var flare, baseBackground;

    //private funcs
    function init() {
        drawBaseBackground();
        drawFlare();
        document.addEventListener("lpPulse", lpPulseHandler,false);

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
        flare.x = position.x;
        flare.y = position.y;
        flare.graphics
            .beginRadialGradientFill(["rgba(241,90,41,0.5)","rgba(241,90,41,0)"], [0, 1], 0, 0, 0, 0, 0, 250)
            .drawCircle(0, 0, 250);
        stage.addChild(flare);
    }

    function lpPulseHandler(event) {
        setFlareChangeInRadius(event.dataDiff);
    }

    //public funcs
    function setFlareChangeInRadius(radiusDiff) {
        flare.scaleX = radiusDiff * 75;
        flare.scaleY = radiusDiff * 75;
    }

    this.setFlareColor = function(ambientColorFilter) {
        flare.graphics
            .beginRadialGradientFill(["#123456","#000"], [0, 1], 0, 0, 0, 0, 0, 250);
        /*flare.filters = [
            new createjs.ColorFilter(1,1,1,1, 
                                     ambientColorFilter[0], 
                                     ambientColorFilter[1], 
                                     ambientColorFilter[2], 0)
        ];*/
        flare.cache(-CONSTANTS.WIDTH/2, -CONSTANTS.HEIGHT/2, CONSTANTS.WIDTH, CONSTANTS.HEIGHT);
        // .getHSL((i/CIRCLES*HUE_VARIANCE+circleHue)%360, 100, 50);
    };
    
    this.applyTintToBase = function(alpha) { // TEMPORARY SOLUTION REMOVE ME; should have better way to denote health
        /*baseBackground.graphics
            .beginFill('#000')
            .drawRect(0, 0, CONSTANTS.WIDTH, CONSTANTS.HEIGHT);
        baseBackground.graphics
            .beginFill('rgba(255,255,255,'+alpha+')')
            .drawRect(0, 0, CONSTANTS.WIDTH, CONSTANTS.HEIGHT);*/
    };

    init();
};