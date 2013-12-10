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
        // damage,
        hud,
        title;
        
    var instance = this;

    //private funcs
    function init() {
        canvas = document.createElement('canvas');

        canvas.width = window.innerWidth;// * 0.8;
        canvas.height = window.innerHeight;
        CONSTANTS.WIDTH = window.innerWidth;// * 0.8;
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
        //stage = new createjs.Stage(canvas);
        stage.mouseEventsEnabled = true;
        createjs.Touch.enable(stage);

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

        //init the fuzz
        copGen = new CopGenObject();

        //init door
        door = new DoorObject();

        //init hud
        hud = new HudObject();
        //hud.renderStartTimer();

        // damage = 0;
        renderFPS(Math.round(createjs.Ticker.getFPS()).toString());
        
        document.addEventListener("mousemove", mouseMoveHandler);
        //stage.addEventListener("click", mouseClickHandler);
        // document.addEventListener("violation", violationHandler, false);
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

    //same as perform_logic() in zenilib
    var prevPartySize = 0;
    function tick() {

        renderFPS(Math.round(createjs.Ticker.getMeasuredFPS()).toString());
    
        if (audioPlayer.isPlaying()) {
            audioPlayer.tick();
            door.tick();
            goerGen.tick();
            projectiles.tick();
            copGen.tick();
            background.tick();
            hud.tick();
        
            if (createjs.Ticker.getTicks() % Math.floor(50*PROGRESSMODIFIER) === 0) {
                PROGRESSMODIFIER = PROGRESSMODIFIER * 1.01;
                goerGen.addPartyGoer();
            }
            if (createjs.Ticker.getTicks() % 60 === 0) {
                var partySize = goerGen.partySize();
                var babiesToAdd = (partySize - prevPartySize) * 1/BABYSPAWNRATEMODIFIER * (partySize + 10)/10;
                prevPartySize = partySize;
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
        var w = window.innerWidth;// * 0.8;
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

    this.pause = function() {
        goerGen.pause();
        projectiles.pause();
    };

    this.resume = function() {
        goerGen.resume();
        projectiles.resume();
    };
    
    this.resetGame = function() {
        // setDamage(0, true);
        console.log("game reset");
        babyRepo.reset();
        projectiles.reset();
        goerGen.reset();
        hud.reset();
        console.log("game end");
    };
};

var gameObject = new GameObject();
document.body.onload = gameObject.init();
