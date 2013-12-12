function AudioPlayerObject() {
    this.audioControlsOpen = false;
    this.stopped = true;
    this.playing = false;
    // this.instance = this;
    this.countingDown = false;

    this.track = {
        artist: 'Flight Facilities',
        title: 'Crave You (Adventure Club Dubstep Remix)',
        src: 'Flight Facilities - Crave You (Adventure Club Dubstep Remix).mp3',
        cover: 'Ratatat-Classics.png'
    };

    this.init();
}

AudioPlayerObject.prototype.init = function() {
    this.setSongInfo();
    this.playButton = $('#playButton');
    this.playButton.click(this.playButtonHandler);

    this.settingsButton = $('#settingsButton');
    this.settingsButton.click(this.settingsButtonHandler);

    //hook into volume slider
    $('#volumeSlider').change(this.setVolume);
    $('.onoffswitch-checkbox').change(this.switchHandler);
    document.addEventListener("upKey", this.increaseVolume, false);
    document.addEventListener("downKey", this.decreaseVolume, false);
    document.addEventListener("spaceKey", this.playButtonHandler, false);
};
    
AudioPlayerObject.prototype.playButtonHandler = function(event) {
    if (this.stopped) {
        $('#winState').hide();
        gameObject.resetGame();
        document.getElementById("instructions").style.display = "none";
        gameObject.getHud().renderStartTimer();
    } else {
        if (!this.countingDown) {
            sound.playPause();
            if(this.playing) {
                this.playing = false;
                gameObject.pause();
                this.playButton.children().removeClass('glyphicon-pause')
                                            .addClass('glyphicon-play');
            } else {
                this.playing = true;
                gameObject.resume();
                this.playButton.children().removeClass('glyphicon-play')
                                        .addClass('glyphicon-pause');
            }
        }
    }
    this.stopped = false;
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

AudioPlayerObject.prototype.setVolume = function(event) {
    if(this.playing) {
        if(10 < event.target.value) {
            volumeModifier = event.target.value;
        } else {
            volumeModifier = 10;
        }
        sound.setVolume(volumeModifier/100);
    }
};

AudioPlayerObject.prototype.increaseVolume = function(event) {
    if(this.playing) {
        if(volumeModifier < 100) {
            volumeModifier += 10;
        } else {
            volumeModifier = 100;
        }
        sound.setVolume(volumeModifier/100);
        $('#volumeSlider').val(volumeModifier);
    }
};

AudioPlayerObject.prototype.decreaseVolume = function(event) {
    if(this.playing) {
        if(volumeModifier > 10) {
            volumeModifier -= 10;
        } else {
            volumeModifier = 10;
        }
        sound.setVolume(volumeModifier/100);
        $('#volumeSlider').val(volumeModifier);
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
    
AudioPlayerObject.prototype.isPlaying = function() {
    return this.playing;
};

AudioPlayerObject.prototype.stopPlayback = function() {
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
    this.playing = false;
    this.stopped = true;
    this.playButton.children().removeClass('glyphicon-pause')
                            .addClass('glyphicon-play');
};

AudioPlayerObject.prototype.play = function() {
    this.playButtonHandler();
};