var BackgroundObject = function(){
    //private vars
    //declare private vars her
    var baseBackground, flare, damageMeter;
    var flareRadius = 250;
    var spectrum;
    var rings = new createjs.Container();

    //private funcs
    function init() {
        drawBaseBackground();
        drawSpectrum();
        drawFlare();
        var center = {
            x: CONSTANTS.WIDTH/2,
            y: CONSTANTS.HEIGHT/2
        };
        stage.addChild(spectrum);
        spectrum.x = center.x;
        spectrum.y = center.y;
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
    
    function drawSpectrum() {
        spectrum = new createjs.Shape();
        spectrum.minHeight = 75 /*gameObject.getBabyRepo().getRadius()*/;
        /*
        var sections = 300;
        var barWidth = Math.PI*2/sections*75 /*gameObject.getBabyRepo().getRadius()/;
        var barHeight = 75 /*gameObject.getBabyRepo().getRadius()/;
        for (var i=0; i<sections; i++) {
            var bar = new createjs.Shape();
            bar.graphics.beginFill("rgba(241,90,41,0.3)")
                        .rect(-barWidth/2, 0,
                              barWidth, barHeight);
            bar.rotation = i*360/sections;
        
            spectrum.addChild(bar);
        }
        */
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
            setFlareChangeInRadius(dataDiff);
            count = 0;
        }
        count++;
        if (dataDiff > 1 && rings.getNumChildren() < 15) {
            newRing = new createjs.Shape();
            newRing.graphics.beginStroke(getRandomColorWithOpacity(0.2 * dataDiff))
                            .setStrokeStyle(2 * dataDiff)
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

    function setFlareChangeInRadius(radiusDiff) {
        flareRadius = radiusDiff*3;
        //console.log(flareRadius);
        flare.scaleX = flare.scaleY = flareRadius;
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
    
    this.updateSpectrum = function() {
        var data = gameObject.getAudioPlayer().getSound().getSpectrum();
        for (var last=data.length; last>0; --last) {
            if (data[last] > 0) break;
        }
        spectrum.graphics.clear();
        spectrum.graphics.moveTo(Math.cos(0)*(data[0]*2+spectrum.minHeight),
                                 Math.sin(0)*(data[0]*2+spectrum.minHeight))
                         .setStrokeStyle(1.5)
                         .beginStroke('rgba(255,255,255,0.3)')
                         .beginFill('rgba(238,42,123,0.3)');
        for (var i=0; i<last; i++) {
            var angle = i*2*Math.PI/last;
            spectrum.graphics.lineTo(Math.cos(angle)*(data[i]*2+spectrum.minHeight),
                                     Math.sin(angle)*(data[i]*2+spectrum.minHeight));
        }
        spectrum.graphics.endFill()
                         .endStroke();
        /*total = 0;
        var dataSections = data.length/4*3;
        var lol=0;
        for (var i=0; i<spectrum.getNumChildren(); i++) {
            var sectionTotal = 0;
            var part = i*dataSections/spectrum.getNumChildren();
            do {
              sectionTotal += data[part];
              part++;
            } while (part < (i+1)*dataSections/spectrum.getNumChildren());
            sectionTotal /= dataSections/spectrum.getNumChildren();
            total += sectionTotal;
            spectrum.getChildAt(i).scaleY = 1+sectionTotal/255*4;
            lol++;
        }*/
        spectrum.rotation += 0.5;
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
        this.updateSpectrum();
    };

    init();
};
