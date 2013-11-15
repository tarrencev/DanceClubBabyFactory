var AudioPlayerObject = function(){
    //private vars
    //declare private vars her
    var playButton,
        playing = false;

    //private funcs
    function init() {
        playButton = document.getElementById("playButton");
        playButton.onclick = playButtonHandler;
    }

    function playButtonHandler(event) {
        console.log('play button clicked');
        gameObject.getSound().playPause();
        if(playing) {
            playing = false;
            playButton.innerHTML = 'Play';
        } else {
            playing = true;
            playButton.innerHTML = 'Pause';
        }
    }

    //public funs
    this.log = function(event) {
        gameObject.getSound().playPause();
    };

    init();
};