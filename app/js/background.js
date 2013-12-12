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
        spectrum.minHeight = 75;
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
        if (rings.getNumChildren() < 10) {
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
    
    this.updateSpectrum = function() {
        var data = sound.getSpectrum();
        for (var last=data.length; last>0; --last) {
            if (data[last] > 0) break;
        }
        spectrum.graphics.clear();
        spectrum.graphics.moveTo(Math.cos(0)*(data[0]*2+spectrum.minHeight),
                                 Math.sin(0)*(data[0]*2+spectrum.minHeight))
                         .setStrokeStyle(1.5)
                         .beginStroke(getRandomColorWithOpacity(0.3))
                         .beginFill(getRandomColorWithOpacity(0.3));
        for (var i=0; i<last; i++) {
            var angle = i*2*Math.PI/last;
            spectrum.graphics.lineTo(Math.cos(angle)*(data[i]*2+spectrum.minHeight),
                                     Math.sin(angle)*(data[i]*2+spectrum.minHeight));
        }
        spectrum.graphics.endFill()
                         .endStroke();
        spectrum.rotation += 0.5;
    };
    
    this.reset = function() {
        rings.removeAllChildren();
        spectrum.graphics.clear();
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
