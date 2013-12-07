var BackgroundObject = function(){
    //private vars
    //declare private vars her
    var baseBackground, flare, damageMeter;
    var flareRadius = 250;
    var rings = new createjs.Container();

    //private funcs
    function init() {
        drawBaseBackground();
        drawFlare();
        stage.addChild(rings);
        document.addEventListener("lpPulse", lpPulseHandler,false);
    }

    function drawBaseBackground() {
        baseBackground = new createjs.Shape();
        
        baseBackground.graphics
                      .beginFill('rgba(200, 10, 50, 1)')
                      .rect(0, 0, CONSTANTS.WIDTH, CONSTANTS.HEIGHT);
        stage.addChild(baseBackground);
        
        var center = {
            x: CONSTANTS.WIDTH/2,
            y: CONSTANTS.HEIGHT/2
        };
        
        damageMeter = new createjs.Shape();
        damageMeter.x = center.x;
        damageMeter.y = center.y;
        var radius =Math.sqrt(Math.pow(CONSTANTS.WIDTH,2)+Math.pow(CONSTANTS.HEIGHT,2))/2;
        damageMeter.maxRadius = radius;
        damageMeter.minRadius = 75 /*gameObject.getBabyRepo().getRadius()*/;
        damageMeter.graphics
                   .beginRadialGradientFill(["rgba(0,0,0,1)","rgba(0,0,0,0)"], [0.95, 1], 0, 0, 0, 0, 0, radius)
                   .drawCircle(0, 0, radius, radius);
        stage.addChild(damageMeter);
    }

    function drawFlare() {
        //console.log('flare');

        flare = new createjs.Shape();
        var center = {
            x: CONSTANTS.WIDTH/2,
            y: CONSTANTS.HEIGHT/2
        };
        flare.x = center.x;
        flare.y = center.y;
        flare.graphics
            .beginRadialGradientFill(["rgba(241,90,41,0.5)","rgba(241,90,41,0)"], [0, 1], 0, 0, 0, 0, 0, 250)
            .drawCircle(0, 0, flareRadius);
        stage.addChild(flare);
    }

    var count = 0;
    function lpPulseHandler(event) {
        var dataDiff = event.dataDiff;

        if(count === 2) {
            // if(-1 < dataDiff && dataDiff < 1) {
                // console.log(dataDiff);            
                setFlareChangeInRadius(dataDiff);
            // }
            count = 0;
        }
        count++;
        if (dataDiff > 1 && rings.getNumChildren() < 20) {
            //console.log(dataDiff);
            newRing = new createjs.Shape();
            newRing.graphics.beginStroke(colors[Math.floor(Math.random() * colors.length)])
                            .setStrokeStyle(2)
                            .drawCircle(0,0, gameObject.getBabyRepo().getRadius());
            var center = {
                x: CONSTANTS.WIDTH/2,
                y: CONSTANTS.HEIGHT/2
            };
            newRing.x = center.x;
            newRing.y = center.y;
        
            rings.addChild(newRing);
        }
    }

    //public funcs
    function setFlareChangeInRadius(radiusDiff) {
        flareRadius = radiusDiff;
        //console.log(flareRadius);
        flare.scaleX = flareRadius;
        flare.scaleY = flareRadius;
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
        var newScale = (damageMeter.minRadius+(100-damage)/100*(damageMeter.maxRadius-damageMeter.minRadius))/damageMeter.maxRadius;
        createjs.Tween.get(damageMeter).to({scaleX: newScale, scaleY: newScale},
                                           500, createjs.Ease.quartOut);
    };
    
    this.tick = function() {
        for(var i = rings.getNumChildren()-1; i>-1; i--) {
            ring = rings.getChildAt(i);
            ring.scaleX *= 1+(0.1*speedModifier);
            ring.scaleY *= 1+(0.1*speedModifier);
            if (ring.scaleX > CONSTANTS.WIDTH || ring.scaleY > CONSTANTS.HEIGHT) {
                rings.removeChildAt(i);
            }
        }
    };

    init();
};
