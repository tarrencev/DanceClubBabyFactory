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
        var position = {
            x: CONSTANTS.WIDTH/2,
            y: CONSTANTS.HEIGHT/2
        };
        baseBackground.x = position.x;
        baseBackground.y = position.y;
        
        var radius = Math.max(CONSTANTS.WIDTH, CONSTANTS.HEIGHT);
        baseBackground.graphics
                      .beginFill('#000')
                      .drawCircle(0, 0, radius, radius);
        stage.addChild(baseBackground);
    }

    function drawFlare() {
        //console.log('flare');
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
    
    this.drawDamage = function(damage) {
        baseBackground.graphics.clear();
        var radius = Math.max(CONSTANTS.WIDTH, CONSTANTS.HEIGHT);
        baseBackground.graphics
                      .beginRadialGradientFill(['rgba(0,0,0,1)', 'rgba(255,0,0,1)'], [0, 1], 0,0,0,0,0,radius*100/(damage+1))
                      .drawCircle(0, 0, radius*100/(damage+1), radius*100/(damage+1));
    };

    init();
};
