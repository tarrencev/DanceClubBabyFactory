var GameObject = function() {
    //private vars
    var sound,
        audioPlayer,
        background,
        door,
        babyRepo,
        goerGen;

    //private funcs
    function init() {
        canvas = document.createElement('canvas');

        canvas.width = window.innerWidth * 0.8;
        canvas.height = window.innerHeight;
        CONSTANTS.WIDTH = window.innerWidth * 0.8;
        CONSTANTS.HEIGHT = window.innerHeight;

        canvas.setAttribute('id', 'c');

        document.body.appendChild(canvas);
        stage = new createjs.Stage(canvas);
        stage.mouseEventsEnabled = true;

        if(!createjs.Ticker.hasEventListener('tick')) {
            createjs.Ticker.addEventListener('tick', tick);
        }
        createjs.Ticker.setFPS(30);

        //init audio player
        audioPlayer = new AudioPlayerObject();

        //init background
        background = new BackgroundObject();

        //init baby repo
        babyRepo = new BabyRepoObject();

        //init door
        door = new DoorObject();

        goerGen = new PartyGoerGenObject();

        window.onresize = function() {
            onResize();
        };

        stage.addEventListener("pressmove", mousePressMoveHandler);
        stage.addEventListener("click", mouseClickHandler);
    }

    //same as perform_logic() in zenilib
    function tick() {
        audioPlayer.tick();
        stage.update();
    }

    function onResize() {
        // browser viewport size
        var w = window.innerWidth * 0.8;
        var h = window.innerHeight;

        // stage dimensions
        var ow = CONSTANTS.WIDTH;
        var oh = CONSTANTS.HEIGHT;
       
        // keep aspect ratio
        var scale = Math.min(w / ow, h / oh);
        stage.scaleX = scale;
        stage.scaleY = scale;

        stage.canvas.width = ow * scale;
        stage.canvas.height = oh * scale;

        stage.update();
    }

    function mousePressMoveHandler(event) {
        console.log('press move');
        door.moveDoor(event);
    }

    function mouseClickHandler(event) {
        console.log('click');
        babyRepo.addBaby();
        goerGen.addPartyGoer();
        // sound.playPause();
    }

    //public funcs
    this.init = function() {
        init();
    };

    this.getBabyRepo = function() {
        return babyRepo;
    };

    this.getBackground = function() {
        return background;
    };

    this.getSound = function() {
        return sound;
    };
};

var gameObject = new GameObject();
document.body.onload = gameObject.init();
