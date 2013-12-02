var GameObject = function() {
    //private vars
    var sound,
        audioPlayer,
        background,
        door,
        babyRepo,
        goerGen,
        partyLimit = 25,
        projectiles,
        damage,
        highScore,
        stars = 0; //TEMP REMOVE ME variable
    

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

        background = new BackgroundObject();

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

        //init door
        door = new DoorObject();

        //init party goers
        goerGen = new PartyGoerGenObject();

        damage = 0;
        
        document.addEventListener("mousemove", mouseMoveHandler);
        stage.addEventListener("click", mouseClickHandler);
        document.addEventListener("violation", violationHandler, false);
        document.addEventListener("blocked", blockedHandler, false);
    }

    //same as perform_logic() in zenilib
    function tick() {
        stage.update();
        projectiles.tick();
    
        if (audioPlayer.isPlaying()) {
            audioPlayer.tick();
            goerGen.tick();
        
            var t = 35 - goerGen.underageSize();
            if (createjs.Ticker.getTicks() % t === 0) {
                if (Math.random() < 0.05 ) {
                    goerGen.addDrugDealer();
                } else if (Math.random() < 1/19 ) {
                    goerGen.addUnderage();
                } else {
                    goerGen.addPartyGoer();
                }
            }
            if (createjs.Ticker.getTicks() % 50 === 0) {
                if (goerGen.size() > 2) {
                    babyRepo.addBaby();
                    if (goerGen.drugDealerSize() && goerGen.drugDealerSize() * Math.random() < 1)
                        babyRepo.addBaby();
                }
            }
            if (createjs.Ticker.getTicks() % 100 === 0) {
                goerGen.wander();
            }
        }
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

    function incrementStars() {
        stars++;
        document.getElementById("stars").innerHTML = stars;
    }

    function getNumStars() {
        return stars;
    }

    function setNumStars(value) {
        stars = value;
        document.getElementById("stars").innerHTML = stars;
    }

    function setDamage(damagePts, absolute) {
        if (absolute === undefined) { // Additive damage
            damage += damagePts;
        } else {
            damage = damagePts;
        }
        document.getElementById("risk").innerHTML = damage;
        background.drawDamage(damage);
    }

    function getDamage() {
        return damage;
    }
    
    function violationHandler(event) {
        setDamage(5);
        setNumStars(parseInt(getNumStars()/2, 10));
        if (getDamage() >= 100) {
            audioPlayer.stopPlayback();
            setNumStars(0); // reset stars here for now (cannot do it in public func)
            highScore = Math.max(highScore, score);
        }
    }
    
    function blockedHandler(event) {
        incrementStars();
    }

    //public funcs
    this.init = function() {
        init();
    };

    this.getBackground = function() {
        return background;
    };

    this.getSound = function() {
        return sound;
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
        return goerGen.getGoer();
    };

    this.getPartyLimit = function() {
        return partyLimit;
    };
    
    this.updateScore = function(score) {
        document.getElementById("score").innerHTML = score;
    };
    
    this.resetGame = function() {
        setDamage(0, true);
        this.updateScore(0);
        babyRepo.reset();
        projectiles.reset();
        goerGen.reset();
    };
};

var gameObject = new GameObject();
document.body.onload = gameObject.init();
