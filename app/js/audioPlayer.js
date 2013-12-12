function AudioPlayerObject() {
    var stopped = true;
    var playing = false;
    this.audioControlsOpen = false;
    this.countingDown = true;

    this.track = {
        artist: 'Brahj',
        title: 'Delusional Confusion, Welome',
        src: 'Brahj - Delusional Confusion, Welome.mp3',
        cover: 'brahj.png'
    };

    this.getStopped = function() { return stopped;};
    this.setStopped = function(stopped_) { stopped = stopped_;};
    this.getPlaying = function() { return playing;};
    this.setPlaying = function(playing_) { playing = playing_;};

    this.playHandler = function(event) {
        if (stopped) {
            $('#winState').hide();
            gameObject.resetGame();
            document.getElementById("instructions").style.display = "none";
            gameObject.getHud().renderStartTimer();
        } else {
            if (!this.countingDown) {
                if(playing) {
                    console.log("pause");
                    sound.pause();
                    playing = false;
                    gameObject.pause();
                } else {
                    console.log("play");
                    sound.play();
                    playing = true;
                    gameObject.resume();
                }
            }
        }
        stopped = false;
    };

    this.setVolume = function(event) {
        if(playing) {
            if(10 < event.target.value) {
                volumeModifier = event.target.value;
            } else {
                volumeModifier = 10;
            }
            sound.setVolume(volumeModifier/100);
        }
    };

    this.increaseVolume = function(event) {
        if(playing) {
            if(volumeModifier < 100) {
                volumeModifier += 10;
            } else {
                volumeModifier = 100;
            }
            sound.setVolume(volumeModifier/100);
            $('#volumeSlider').val(volumeModifier);
        }
    };

    this.decreaseVolume = function(event) {
        if(playing) {
            if(volumeModifier > 10) {
                volumeModifier -= 10;
            } else {
                volumeModifier = 10;
            }
            sound.setVolume(volumeModifier/100);
            $('#volumeSlider').val(volumeModifier);
        }
    };

    this.stopPlayback = function() {
        var enterEasing = setInterval(function() {
            speedModifier = speedModifier*0.95;
            if (speedModifier < 0.1) {
                speedModifier = 1;
                clearInterval(enterEasing);
                sound.stop();
                sound.getSiren().volume = 0;
                createjs.Sound.play("Rewind");
            }
            sound.getSong().LOLaudio.playbackRate.value = speedModifier;
        }, 10);
        playing = false;
        stopped = true;
    };

    this.init();
}

AudioPlayerObject.prototype.init = function() {
    this.setSongInfo();

    this.settingsButton = $('#settingsButton');
    this.settingsButton.click(this.settingsButtonHandler);

    //hook into volume slider
    $('#volumeSlider').change(this.setVolume);
    $('.onoffswitch-checkbox').change(this.switchHandler);
    document.addEventListener("upKey", this.increaseVolume, false);
    document.addEventListener("downKey", this.decreaseVolume, false);
    document.addEventListener("spaceKey", this.playHandler, false);
};
    
AudioPlayerObject.prototype.switchHandler = function(event) {
    if (event.target.id === 'lowPassSwitch') {
        sound.toggleLowPassFilter();
    } else if (event.target.id === 'bandPass1Switch') {
        sound.toggleBandPass1Filter();
    } else if (event.target.id === 'bandPass2Switch') {
        sound.toggleBandPass2Filter();
    } else if (event.target.id === 'highPassSwitch') {
        sound.toggleHighPassFilter();
    }
};

AudioPlayerObject.prototype.settingsButtonHandler = function(event) {
    var audioControlsPane = $('.audioControlsPane')[0];
    if(this.audioControlsOpen) {
        audioControlsPane.style.opacity = 0;
        this.audioControlsOpen = false;
    } else {
        audioControlsPane.style.opacity = 1;
        this.audioControlsOpen = true;
    }
};

AudioPlayerObject.prototype.setSongInfo = function() {
    $('#songTitle').text(this.track.title);
    $('#songArtist').text(this.track.artist);
    $('.albumCover')[0].src = '../music/covers/' + this.track.cover;
};

AudioPlayerObject.prototype.tick = function() {
    sound.tick();
};