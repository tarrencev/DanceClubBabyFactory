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
    
    var sticky = true;

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
        
        if (sticky) {
            stage.enableMouseOver(50);
            document.addEventListener("mousemove", mouseMoveHandler);
        } else {
            stage.addEventListener("pressmove", mousePressMoveHandler);
        }
        stage.addEventListener("click", mouseClickHandler);
    }

    //same as perform_logic() in zenilib
    function tick() {
        audioPlayer.tick();
        stage.update();
        goerGen.tick();
        projectiles.tick();
        
        if (audioPlayer.isPlaying()) {
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
        } else {
            damage = 0; // TEMP REMOVE ME only reset damage on new game
            background.drawDamage(damage);
        }

        // background.applyTintToBase(damage/100); // TEMP REMOVE ME better way to denote health
        //document.getElementById("debug").innerHTML = "High Score: " + highScore + " babies";       
        //document.getElementById("debug").innerHTML = "Score: " + babyRepo.getNumBabies() + " babies"; // TEMP REMOVE ME temporary display for score
        //highScore = Math.max(babyRepo.getNumBabies(), highScore);
        //document.getElementById("debug").innerHTML += "<br/>Complaint risk: " + Math.min(damage, 100) + "%"; // TEMP REMOVE ME temporary display for damage
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
        createjsEvent = {stageX: event.clientX,
                         stageY: event.clientY};
        door.moveDoor(createjsEvent);
    }

    function mousePressMoveHandler(event) {
        console.log('press move');
        door.moveDoor(event);
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

    this.setDamage = function(damagePts, absolute) {
        if (absolute === undefined) { // Additive damage
            damage += damagePts;
        } else {
            damage = damagePts;
        }
        document.getElementById("risk").innerHTML = damage;
        this.getBackground().drawDamage(damage);
    };

    this.incrementStars = function() {
        stars++;
        document.getElementById("stars").innerHTML = stars;
    };

    this.getDamage = function() {
        return damage;
    };
    
    this.updateScore = function(score) {
        document.getElementById("score").innerHTML = score;
    };
};

var gameObject = new GameObject();
document.body.onload = gameObject.init();
