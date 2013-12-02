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

    //low pass filter
    var lowPassFilter;
    var lowPassEnabled = true;
    var lpEvt;
    var lowPassAnalyserNode;
    var lpFreqByteData, lpTimeByteData;  // arrays to retrieve data from lowPassAnalyserNode

    //band pass filter 1
    var bandPass1Filter;
    var bandPass1Enabled = true;
    var bp1Evt;
    var bandPass1AnalyserNode;
    var bp1FreqByteData, bp1TimeByteData;

    //band pass filter 2
    var bandPass2Filter;
    var bandPass2Enabled = true;
    var bp2Evt;
    var bandPass2AnalyserNode;
    var bp2FreqByteData, bp2TimeByteData;
    
    //high pass filter
    var highPassFilter;
    var highPassEnabled = true;
    var hpEvt;
    var highPassAnalyserNode;
    var hpFreqByteData, hpTimeByteData;  // arrays to retrieve data from highPassAnalyserNode

    var dataAverage = [42,42,42,42,42,42];   // an array recording data for the last 4 ticks
    var freqChunk;    // The chunk of freqByteData array that is computed

    //private funcs
    function init() {
        
        initEvents();

        if (!createjs.Sound.registerPlugin(createjs.WebAudioPlugin)) { return; }
        var manifest = [
                {
                    id: "Song",
                    src: sound_path+track
                }
            ];
         
        createjs.Sound.addEventListener("fileload", createjs.proxy(handleLoad, this));
        console.log(src);
        createjs.Sound.registerSound(src);
        audio = createjs.Sound.activePlugin;
    }

    function handleLoad(event) {
        // createjs.Sound.play("Song");
        var context = createjs.WebAudioPlugin.context;

        // attach visualizer node to our existing dynamicsCompressorNode, which was connected to context.destination
        var dynamicsNode = createjs.WebAudioPlugin.dynamicsCompressorNode;
        dynamicsNode.disconnect();  // disconnect from destination

        //init filters
        initLowPassFilter(context, dynamicsNode);
        initBandPassFilter1(context, dynamicsNode);
        initBandPassFilter2(context, dynamicsNode);
        initHighPassFilter(context, dynamicsNode);

        // calculate the number of array elements that represent each circle
        freqChunk = bandPass1AnalyserNode.frequencyBinCount;
    }

    function initLowPassFilter(context, dynamicsNode) {
        //create lowpass filter
        lowPassFilter = context.createBiquadFilter();
        lowPassFilter.type = 0; // Low-pass filter. See BiquadFilterNode docs
        lowPassFilter.frequency.value = 170; // Set cutoff to 440 HZ
        lowPassFilter.connect(context.destination);

        // create an lowpass analyser node
        lowPassAnalyserNode = context.createAnalyser();
        lowPassAnalyserNode.fftSize = FFTSIZE;  //The size of the FFT used for frequency-domain analysis. This must be a power of two
        lowPassAnalyserNode.smoothingTimeConstant = 0.85;  //A value from 0 -> 1 where 0 represents no time averaging with the last analysis frame
        lowPassAnalyserNode.connect(lowPassFilter);  // connect to the context.destination, which outputs the audio

        dynamicsNode.connect(lowPassAnalyserNode);

        // set up the arrays that we use to retrieve the lowPassAnalyserNode data
        lpFreqByteData = new Uint8Array(lowPassAnalyserNode.frequencyBinCount);
        lpTimeByteData = new Uint8Array(lowPassAnalyserNode.frequencyBinCount);
    }

    function initBandPassFilter1(context, dynamicsNode) {
        bandPass1Filter = context.createBiquadFilter();
        bandPass1Filter.type = 2;
        bandPass1Filter.frequency.value = 345;
        bandPass1Filter.Q = 165;
        bandPass1Filter.connect(context.destination);

        bandPass1AnalyserNode = context.createAnalyser();
        bandPass1AnalyserNode.fftSize = FFTSIZE;  //The size of the FFT used for frequency-domain analysis. This must be a power of two
        bandPass1AnalyserNode.smoothingTimeConstant = 0.85;  //A value from 0 -> 1 where 0 represents no time averaging with the last analysis frame
        bandPass1AnalyserNode.connect(bandPass1Filter);  // connect to the context.destination, which outputs the audio

        dynamicsNode.connect(bandPass1AnalyserNode);

        // set up the arrays that we use to retrieve the bandPass1AnalyserNode data
        bp1FreqByteData = new Uint8Array(bandPass1AnalyserNode.frequencyBinCount);
        bp1TimeByteData = new Uint8Array(bandPass1AnalyserNode.frequencyBinCount);
    }

    function initBandPassFilter2(context, dynamicsNode) {
        bandPass2Filter = context.createBiquadFilter();
        bandPass2Filter.type = 2;
        bandPass2Filter.frequency.value = 1250;
        bandPass2Filter.Q = 750;
        bandPass2Filter.connect(context.destination);

        bandPass2AnalyserNode = context.createAnalyser();
        bandPass2AnalyserNode.fftSize = FFTSIZE;  //The size of the FFT used for frequency-domain analysis. This must be a power of two
        bandPass2AnalyserNode.smoothingTimeConstant = 0.85;  //A value from 0 -> 1 where 0 represents no time averaging with the last analysis frame
        bandPass2AnalyserNode.connect(bandPass2Filter);  // connect to the context.destination, which outputs the audio

        dynamicsNode.connect(bandPass2AnalyserNode);

        // set up the arrays that we use to retrieve the bandPass1AnalyserNode data
        bp2FreqByteData = new Uint8Array(bandPass2AnalyserNode.frequencyBinCount);
        bp2TimeByteData = new Uint8Array(bandPass2AnalyserNode.frequencyBinCount);
    }

    function initHighPassFilter(context, dynamicsNode) {
        //create highpass filter
        highPassFilter = context.createBiquadFilter();
        highPassFilter.type = 1; // Low-pass filter. See BiquadFilterNode docs
        highPassFilter.frequency.value = 2000;
        highPassFilter.connect(context.destination);

        // create an highpass analyser node
        highPassAnalyserNode = context.createAnalyser();
        highPassAnalyserNode.fftSize = FFTSIZE;  //The size of the FFT used for frequency-domain analysis. This must be a power of two
        highPassAnalyserNode.smoothingTimeConstant = 0.85;  //A value from 0 -> 1 where 0 represents no time averaging with the last analysis frame
        highPassAnalyserNode.connect(highPassFilter);  // connect to the context.destination, which outputs the audio

        dynamicsNode.connect(highPassAnalyserNode);

        // set up the arrays that we use to retrieve the highPassAnalyserNode data
        hpFreqByteData = new Uint8Array(highPassAnalyserNode.frequencyBinCount);
        hpTimeByteData = new Uint8Array(highPassAnalyserNode.frequencyBinCount);
    }

    function initEvents() {
        lpEvt = document.createEvent('Event');
        lpEvt.initEvent('lpPulse', true, true);

        bp1Evt = document.createEvent('Event');
        bp1Evt.initEvent('bp1Pulse', true, true);

        bp2Evt = document.createEvent('Event');
        bp2Evt.initEvent('bp2Pulse', true, true);

        hpEvt = document.createEvent('Event');
        hpEvt.initEvent('hpPulse', true, true);
    }

    function updateAnalysers() {
        lowPassAnalyserNode.getByteFrequencyData(lpFreqByteData);  // this gives us the frequency
        lowPassAnalyserNode.getByteTimeDomainData(lpTimeByteData);  // this gives us the waveform

        bandPass1AnalyserNode.getByteFrequencyData(bp1FreqByteData);
        bandPass1AnalyserNode.getByteTimeDomainData(bp1TimeByteData);

        bandPass2AnalyserNode.getByteFrequencyData(bp2FreqByteData);
        bandPass2AnalyserNode.getByteTimeDomainData(bp2TimeByteData);

        highPassAnalyserNode.getByteFrequencyData(hpFreqByteData);
        highPassAnalyserNode.getByteTimeDomainData(hpTimeByteData);
    }

    function startPlayback() {
        playing = true;
        if (soundInstance) {
            if (!soundInstance.resume()) {
                soundInstance.play();
            }
        } else {
            soundInstance = createjs.Sound.play(src);
        }
    }

    function pausePlayback() {
        playing = false;
        soundInstance.pause();
    }

    function refreshFilters() {
        var dynamicsNode = createjs.WebAudioPlugin.dynamicsCompressorNode;
        if (lowPassEnabled) {
            dynamicsNode.connect(lowPassAnalyserNode);
        }
        if (bandPass1Enabled) {
            dynamicsNode.connect(bandPass1AnalyserNode);
        }
        if (bandPass2Enabled) {
            dynamicsNode.connect(bandPass2AnalyserNode);
        }
        if (highPassEnabled) {
            dynamicsNode.connect(highPassAnalyserNode);
        }
    }

    function calculateDiff(freqByteData, timeByteData) {
        var lastRadius = 0;  // we use this to store the radius of the last circle, making them relative to each other
        var freqSum = 0;
        var timeSum = 0;

        for(var x = freqChunk; x; x--) {
            var index = freqChunk - x;
            freqSum += freqByteData[index];
            timeSum += timeByteData[index];
        }

        freqSum = freqSum / freqChunk / 255;  // gives us a percentage out of the total possible value
        timeSum = timeSum / freqChunk / 255;  // gives us a percentage out of the total possible value

        // update our dataAverage, by removing the first element and pushing in the new last element
        dataAverage.shift();
        dataAverage.push(freqSum);

        // get our average data for the last 3 ticks
        var dataSum = 0;
        for(var i = dataAverage.length-1; i; i--) {
            dataSum += dataAverage[i-1];
        }
        dataSum = dataSum / (dataAverage.length-1);

        // calculate latest change
        var dataDiff = (dataAverage[dataAverage.length-1] - dataSum) * 100;
        
        return dataDiff;
    }

    //public funs
    this.playPause = function() {
        console.log("was playing"+playing);
        if (playing)
            pausePlayback();
        else
            startPlayback();
        console.log("now playing"+playing);
    };
    
    this.stop = function() {
        soundInstance.stop();
        playing = false;
    };

    this.setVolume = function(value) {
        soundInstance.setVolume(value);
    };

    this.toggleLowPassFilter = function() {
        if(lowPassEnabled) {
            var dynamicsNode = createjs.WebAudioPlugin.dynamicsCompressorNode;
            dynamicsNode.disconnect(0);  // disconnect from destination
            lowPassEnabled = false;
        } else {
            lowPassEnabled = true;
        }
        refreshFilters();
    };

    this.toggleBandPass1Filter = function() {
        if(bandPass1Enabled) {
            var dynamicsNode = createjs.WebAudioPlugin.dynamicsCompressorNode;
            dynamicsNode.disconnect(0);  // disconnect from destination
            bandPass1Enabled = false;
        } else {
            bandPass1Enabled = true;
        }
        refreshFilters();
    };

    this.toggleBandPass2Filter = function() {
        if(bandPass2Enabled) {
            var dynamicsNode = createjs.WebAudioPlugin.dynamicsCompressorNode;
            dynamicsNode.disconnect(0);  // disconnect from destination
            bandPass2Enabled = false;
        } else {
            bandPass2Enabled = true;
        }
        refreshFilters();
    };

    this.toggleHighPassFilter = function() {
        if(highPassEnabled) {
            var dynamicsNode = createjs.WebAudioPlugin.dynamicsCompressorNode;
            dynamicsNode.disconnect(0);  // disconnect from destination
            highPassEnabled = false;
        } else {
            highPassEnabled = true;
        }
        refreshFilters();
    };

    this.tick = function() {
        if(playing) {
            updateAnalysers();

            if (lowPassEnabled) {
                lpEvt.dataDiff = calculateDiff(lpFreqByteData, lpTimeByteData);
                document.dispatchEvent(lpEvt);
            }
            if (bandPass1Enabled) {
                bp1Evt.dataDiff = calculateDiff(bp1FreqByteData, bp1TimeByteData);
                document.dispatchEvent(bp1Evt);
            }
            if (bandPass2Enabled) {
                bp2Evt.dataDiff = calculateDiff(bp2FreqByteData, bp2TimeByteData);
                document.dispatchEvent(bp2Evt);
            }
            if (highPassEnabled) {
                hpEvt.dataDiff = calculateDiff(hpFreqByteData, hpTimeByteData);
                document.dispatchEvent(hpEvt);
            }
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
