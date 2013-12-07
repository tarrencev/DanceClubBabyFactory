var GameObject = function() {
    //private vars
    var sound,
        audioPlayer,
        background,
        babyRepo,
        goerGen,
        door,
        partyLimit = 10,
        copGen,
        projectiles,
        damage,
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
        createjs.Ticker.setFPS(30);

        title = new TitleObject(game);
    }

    function title_tick() {
      stage.update();
    }

    function game() {
        //stage = new createjs.Stage(canvas);
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

        //init the fuzz
        copGen = new CopGenObject();

        //init door
        door = new DoorObject();

        //init hud
        hud = new HudObject();
        hud.renderStartTimer();

        damage = 0;
        
        document.addEventListener("mousemove", mouseMoveHandler);
        stage.addEventListener("click", mouseClickHandler);
        document.addEventListener("violation", violationHandler, false);
    }

    //same as perform_logic() in zenilib
    function tick() {

        if (audioPlayer.isPlaying() && createjs.Ticker.getTicks() % 300 === 0) {
            if (Math.random() < (damage / 200.0)) {
                copGen.addCop();
            }
        }
    
        if (audioPlayer.isPlaying()) {
            audioPlayer.tick();
            goerGen.tick();
            projectiles.tick();
            copGen.tick();
            background.tick();
        
            if (createjs.Ticker.getTicks() % 50 === 0) {
                goerGen.addPartyGoer();
            }
            if (createjs.Ticker.getTicks() % 50 === 0) {
                if (goerGen.partySize() > 2) {
                    babyRepo.addBaby();
                }
            }
            if (createjs.Ticker.getTicks() % 100 === 0) {
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

    function setDamage(damagePts, absolute) {
        if (absolute === undefined) { // Additive damage
            damage += damagePts;
        } else {
            damage = damagePts;
        }
        damage = Math.min(100, damage);
        background.drawDamage(damage);
    }

    function getDamage() {
        return damage;
    }
    
    function violationHandler(event) {
        if (audioPlayer.isPlaying()) {
            setDamage(5);
            if (getDamage() >= 100) {
                audioPlayer.stopPlayback();
            }
        }
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

    this.getPartyLimit = function() {
        return partyLimit;
    };

    this.getProjectiles = function() {
        return projectiles;
    };

    this.getTitle = function() {
        return title;
    };
    
    this.resetGame = function() {
        setDamage(0, true);
        babyRepo.reset();
        projectiles.reset();
        goerGen.reset();
    };
};

var gameObject = new GameObject();
document.body.onload = gameObject.init();
