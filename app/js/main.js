var GameObject = function() {
    //private vars
    var sound,
        audioPlayer,
        background,
        babyRepo,
        goerGen,
        door,
        copGen,
        projectiles,
        hud,
        title;
        
    var instance = this;

    //private funcs
    function init() {
        canvas = document.createElement('canvas');

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        CONSTANTS.WIDTH = window.innerWidth;
        CONSTANTS.HEIGHT = window.innerHeight;

        canvas.setAttribute('id', 'c');

        document.body.appendChild(canvas);
        stage = new createjs.Stage(canvas);
        stage.mouseEventsEnabled = true;

        window.onresize = function() {
            onResize();
        };

        if(!createjs.Ticker.hasEventListener('tick')) {
            createjs.Ticker.addEventListener('tick', title_tick);
        }

        title = new TitleObject(game);
    }

    function title_tick() {
      stage.update();
    }

    function game() {
        createjs.Ticker.setFPS(30);
        stage.mouseEventsEnabled = true;

        createjs.Ticker.removeEventListener('tick', title_tick);
        createjs.Ticker.addEventListener('tick', tick);
        createjs.Ticker.setFPS(30);

        //init audio player
        audioPlayer = new AudioPlayerObject();

        //init background
        background = new BackgroundObject();

        //init projectiles
        projectiles = new ProjectileGeneratorObject();

        //init baby repo
        babyRepo = new BabyRepoObject();

        //init party goers
        goerGen = new PartyGoerGenObject();

        //init door
        door = new DoorObject();

        //init hud
        hud = new HudObject();

        renderFPS(Math.round(createjs.Ticker.getFPS()).toString());
        
        document.addEventListener("mousemove", mouseMoveHandler);
    }

    var fps = null;
    function renderFPS(fps_str) {
        if(!fps) {
            fps = new createjs.Text(fps_str,
                                  "32px Helvetica",
                                  "#FFFFFF");
            fps.alpha = 1.0;
            fps.x = 30;
            fps.y = 50;
            fps.textBaseline = "alphabetic";
            stage.addChild(fps);
        } else {
            fps.text = fps_str;
        }
    }

    var prevPartySize = 0;
    function tick() {

        renderFPS(Math.round(createjs.Ticker.getMeasuredFPS()).toString());
    
        if (audioPlayer.isPlaying()) {
            audioPlayer.tick();
            door.tick();
            goerGen.tick();
            projectiles.tick();
            background.tick();
            hud.tick();
        
            if (createjs.Ticker.getTicks() % 50 === 0) {
                PROGRESSMODIFIER = PROGRESSMODIFIER * 1.01;
                goerGen.addPartyGoer();
            }
            if (createjs.Ticker.getTicks() % 60 === 0) {
                var babiesToAdd = (goerGen.partySize() - prevPartySize) * 1/BABYSPAWNRATEMODIFIER * (goerGen.partySize() + 10)/10;
                prevPartySize = goerGen.partySize();
                while (babiesToAdd > 0) {
                    babyRepo.addBaby();
                    babiesToAdd--;
                }
            }
            if (createjs.Ticker.getTicks() % 30 === 0) {
                goerGen.wander();
            }
        }
        
        stage.update();
    }

    function onResize() {
        // browser viewport size
        var w = window.innerWidth;
        var h = window.innerHeight;

        // stage dimensions
        var ow = CONSTANTS.WIDTH;
        var oh = CONSTANTS.HEIGHT;
       
        // keep aspect ratio
        var scale = Math.min(w / ow, h / oh);
        stage.scaleX = scale;
        stage.scaleY = scale;
        
        stage.x = (w-scale*ow)/2;
        stage.y = (h-scale*oh)/2;
        
        CONSTANTS.WIDTH = w;
        CONSTANTS.HEIGHT = h;

        stage.canvas.width = CONSTANTS.WIDTH;
        stage.canvas.height = CONSTANTS.HEIGHT;

        stage.update();
    }

    function mouseMoveHandler(event) {
        door.moveDoor(event);
    }

    function mousePressMoveHandler(event) {
        console.log('press move');
        //door.moveDoor(event);
    }

    function mouseClickHandler(event) {
        console.log('click');
    }

    //public funcs
    this.init = function() {
        init();
    };

    this.getBackground = function() {
        return background;
    };

    this.getAudioPlayer = function() {
        return audioPlayer;
    };

    this.getDoor = function() {
        return door;
    };

    this.getBabyRepo = function() {
        return babyRepo;
    };

    this.getGoerGen = function() {
        return goerGen;
    };

    this.getCopGen = function() {
        return copGen;
    };

    this.getProjectiles = function() {
        return projectiles;
    };

    this.getHud = function() {
        return hud;
    };

    this.getTitle = function() {
        return title;
    };
    
    this.resetGame = function() {
        console.log("game reset");
        babyRepo.reset();
        projectiles.reset();
        goerGen.reset();
        hud.reset();
        console.log("game end");
    };

    this.pause = function() {
        createjs.Ticker.removeEventListener('tick', tick);
    };

    this.resume = function() {
        createjs.Ticker.addEventListener('tick', tick);
    };
};

var gameObject = new GameObject();
document.body.onload = gameObject.init();
