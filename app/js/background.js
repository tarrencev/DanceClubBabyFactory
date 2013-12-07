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
                      .beginFill('rgba(0, 0, 0, 1)')
                      .rect(0, 0, CONSTANTS.WIDTH, CONSTANTS.HEIGHT);
        stage.addChild(baseBackground);
        
        var center = {
            x: CONSTANTS.WIDTH/2,
            y: CONSTANTS.HEIGHT/2
        };
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

    function lpPulseHandler(event) {
        var dataDiff = event.dataDiff;
        if(dataDiff > 4) dataDiff = 4;
        if(dataDiff > 1) fireRing(dataDiff);
    }

    function hpPulseHandler(event) {
        var dataDiff = event.dataDiff;
        if(dataDiff > 4) dataDiff = 4;
        if(dataDiff > 1) fireRing(dataDiff);
    }

    function fireRing(dataDiff) {
        if (rings.getNumChildren() < 15) {
            newRing = new createjs.Shape();
            newRing.graphics.beginStroke(getRandomColorWithOpacity(0.2 * dataDiff))
                            .setStrokeStyle(4 * dataDiff)
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
        spectrum.graphics.moveTo(Math.cos(0)*(data[0]+spectrum.minHeight)*2,
                                 Math.sin(0)*(data[0]+spectrum.minHeight)*2)
                         .setStrokeStyle(1.5)
                         .beginStroke(getRandomColorWithOpacity(0.3))
                         .beginFill(getRandomColorWithOpacity(0.3));
        for (var i=0; i<last; i++) {
            var angle = i*2*Math.PI/last;
            spectrum.graphics.lineTo(Math.cos(angle)*(data[i]+spectrum.minHeight)*2,
                                     Math.sin(angle)*(data[i]+spectrum.minHeight)*2);
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
