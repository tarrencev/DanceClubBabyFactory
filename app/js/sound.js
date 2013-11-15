var SoundObject = function(track){
    //private vars
    //declare private vars her
    var FFTSIZE = 32;      // number of samples for the analyser node FFT, min 32
    var RADIUS_FACTOR = 120; // the radius of the circles, factored for which ring we are drawing
    var MIN_RADIUS = 1;     // the minimum radius of each circle
    var COLOR_CHANGE_THRESHOLD = 10;    // amount of change before we change color
    var circleHue = 300;   // the base color hue used when drawing circles, which can change
    var HUE_VARIANCE = 120;  // amount hue can vary by

    var audio,
        playing,
        sound_path = 'music/',
        src = sound_path + track;
    var soundInstance;      // the sound instance we create
    var analyserNode;       // the analyser node that allows us to visualize the audio
    var freqFloatData, freqByteData, timeByteData;  // arrays to retrieve data from analyserNode
    var dataAverage = [42,42,42,42];   // an array recording data for the last 4 ticks
    var circleFreqChunk;    // The chunk of freqByteData array that is computed per circle

    //private funcs
    function init() {
        if (!createjs.Sound.registerPlugin(createjs.WebAudioPlugin)) { return; }
        var manifest = [
                {
                    id: "Song",
                    src: sound_path+track
                }
            ];
         
        createjs.Sound.addEventListener("fileload", createjs.proxy(handleLoad, this));
        createjs.Sound.registerSound(src);
        audio = createjs.Sound.activePlugin;
    }

    function handleLoad(event) {
        // createjs.Sound.play("Song");
        var context = createjs.WebAudioPlugin.context;

        // create an analyser node
        analyserNode = context.createAnalyser();
        analyserNode.fftSize = FFTSIZE;  //The size of the FFT used for frequency-domain analysis. This must be a power of two
        analyserNode.smoothingTimeConstant = 0.85;  //A value from 0 -> 1 where 0 represents no time averaging with the last analysis frame
        analyserNode.connect(context.destination);  // connect to the context.destination, which outputs the audio

        // attach visualizer node to our existing dynamicsCompressorNode, which was connected to context.destination
        var dynamicsNode = createjs.WebAudioPlugin.dynamicsCompressorNode;
        dynamicsNode.disconnect();  // disconnect from destination
        dynamicsNode.connect(analyserNode);

        // set up the arrays that we use to retrieve the analyserNode data
        freqFloatData = new Float32Array(analyserNode.frequencyBinCount);
        freqByteData = new Uint8Array(analyserNode.frequencyBinCount);
        timeByteData = new Uint8Array(analyserNode.frequencyBinCount);

        // calculate the number of array elements that represent each circle
        circleFreqChunk = analyserNode.frequencyBinCount;
        console.log(analyserNode.frequencyBinCount);
        // startPlayback();
    }

    function startPlayback() {
        playing = true;
        if (soundInstance)
            soundInstance.play();
        else
            soundInstance = createjs.Sound.play(src);
    }

    function stopPlayback() {
        playing = false;
        soundInstance.pause();
    }

    //public funs
    this.playPause = function() {
        if (playing)
            stopPlayback();
        else
            startPlayback();
    };

    this.setVolume = function(value) {
        soundInstance.setVolume(value);
    };

    this.tick = function() {
        if(playing) {
            analyserNode.getFloatFrequencyData(freqFloatData);  // this gives us the dBs
            analyserNode.getByteFrequencyData(freqByteData);  // this gives us the frequency
            analyserNode.getByteTimeDomainData(timeByteData);  // this gives us the waveform
            
            var lastRadius = 0;  // we use this to store the radius of the last circle, making them relative to each other
            var freqSum = 0;
            var timeSum = 0;

            for(var x = circleFreqChunk; x; x--) {
                var index = circleFreqChunk-x;
                freqSum += freqByteData[index];
                timeSum += timeByteData[index];
            }
            freqSum = freqSum / circleFreqChunk / 255;  // gives us a percentage out of the total possible value
            timeSum = timeSum / circleFreqChunk / 255;  // gives us a percentage out of the total possible value
            // NOTE in testing it was determined that i 1 thru 4 stay 0's most of the time

            // draw circle
            lastRadius += freqSum*RADIUS_FACTOR + MIN_RADIUS;

            // update our dataAverage, by removing the first element and pushing in the new last element
            dataAverage.shift();
            dataAverage.push(lastRadius);

            // get our average data for the last 3 ticks
            var dataSum = 0;
            for(var i = dataAverage.length-1; i; i--) {
                dataSum += dataAverage[i-1];
            }
            dataSum = dataSum / (dataAverage.length-1);

            // calculate latest change
            var dataDiff = dataAverage[dataAverage.length-1] - dataSum;

            // change color based on large enough changes
            if(dataDiff>COLOR_CHANGE_THRESHOLD || dataDiff<COLOR_CHANGE_THRESHOLD) {circleHue = circleHue + dataDiff;}
            // gameObject.getBackground().setFlareColor(hslToRgb((HUE_VARIANCE+circleHue)%360, 50, 10));
            gameObject.getBackground().setFlareChangeInRadius(dataDiff * 0.5);
        }
    };

    function hue2rgb(p, q, t){
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }

    function hslToRgb(h, s, l){
        var r, g, b;

        if(s === 0){
            r = g = b = l; // achromatic
        } else {
            var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            var p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return [r * 255, g * 255, b * 255];
    }

    init();
};