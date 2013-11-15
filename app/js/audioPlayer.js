var AudioPlayerObject = function(){
    //private vars
    //declare private vars her
    var sound,
        playButton,
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

        //hook into volume slider
        $('#volumeSlider').change(setVolume);
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