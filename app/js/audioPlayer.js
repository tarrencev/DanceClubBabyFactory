var AudioPlayerObject = function(){
    //private vars
    //declare private vars her
    var sound,
        playButton,
        settingsButton,
        audioControlsOpen = false,
        playing = false;

    var track = {
        artist: 'Ratatat',
        title: 'Loud Pipes',
        src: '06 Loud Pipes.m4a',
        cover: 'Ratatat-Classics.png'
    };

    //private funcs
    function init() {
        sound = new SoundObject(track.src);
        setSongInfo(track);
        playButton = $('#playButton');
        playButton.click(playButtonHandler);

        settingsButton = $('#settingsButton');
        settingsButton.click(settingsButtonHandler);

        //hook into volume slider
        $('#volumeSlider').change(setVolume);
        $('.onoffswitch-checkbox').change(switchHandler);
         
    }

    function handleEvent(event) {
        console.log('event received');
    }

    function playButtonHandler(event) {
        console.log('play button clicked');
        sound.playPause();
        if(playing) {
            playing = false;
            playButton.children().removeClass('glyphicon-pause').addClass('glyphicon-play');
        } else {
            playing = true;
            playButton.children().removeClass('glyphicon-play').addClass('glyphicon-pause');
        }
    }

    function switchHandler(event) {
        
        if (event.target.id === 'lowPassSwitch') {
            console.log('low pass switch');
            sound.toggleLowPassFilter();
        } else if (event.target.id === 'bandPass1Switch') {
            console.log('band pass 1 switch');
            sound.toggleBandPass1Filter();
        } else if (event.target.id === 'bandPass2Switch') {
            console.log('band pass 2 switch');
            sound.toggleBandPass2Filter();
        } else if (event.target.id === 'highPassSwitch') {
            console.log('high pass switch');
            sound.toggleHighPassFilter();
        }
    }

    function settingsButtonHandler(event) {
        var audioControlsPane = $('.audioControlsPane')[0];
        if(audioControlsOpen) {
            audioControlsPane.style.opacity = 0;
            audioControlsOpen = false;
        } else {
            audioControlsPane.style.opacity = 1;
            audioControlsOpen = true;
        }
    }

    function setVolume(event) {
        sound.setVolume(event.target.value/100);
    }

    function setSongInfo(track) {
        $('#songTitle').text(track.title);
        $('#songArtist').text(track.artist);
        $('.albumCover')[0].src = '../music/covers/' + track.cover;
    }

    //public funs
    this.tick = function() {
        sound.tick();
    };

    init();
};