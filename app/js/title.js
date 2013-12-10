var TitleObject = function(new_stage){
    var instr1, instr2;
    var titleBackgroundInterval;
    var song;
    var loadingMeter, loadingMeterBackground;

    //private funcs
    function init() {
        $('.HUD').hide();

        titleBackgroundInterval = setInterval(function() {
            var juice = new JuicySplosion({x: (Math.random() * CONSTANTS.WIDTH), y: (Math.random() * CONSTANTS.HEIGHT)}, 100 * Math.random(), getRandomColorWithOpacity(1.0));
        }, 40);

        initLoadingMeter();

        loadQueue = new createjs.LoadQueue();
        sound = new SoundObject();
        loadQueue.installPlugin(createjs.Sound);
        loadQueue.addEventListener("complete", handleComplete);
        loadQueue.addEventListener("progress", fileProgress);
        var manifest = [
            {
                id: "gameSong",
                src: "music/Flight Facilities - Crave You (Adventure Club Dubstep Remix).mp3"
            },
            {
                src: "music/rewind_sound.mp3",
                id: "Rewind"
            },
            {
                src: "music/siren_sound.mp3",
                id: "Siren"
            }
        ];
        loadQueue.loadManifest(manifest, true);

        $(".titlePlayButton").click(handlePlayButton);
        $(".tutorialButton").click(change_stage);
    }

    function initLoadingMeter() {
        loadingMeterBackground = new createjs.Shape();
        loadingMeterBackground.x = CONSTANTS.WIDTH/2 - 200;
        loadingMeterBackground.y = CONSTANTS.HEIGHT/2;
        loadingMeterBackground.graphics.beginFill("#FFF").drawRect(0, 0, 400, 40);
        stage.addChild(loadingMeterBackground);

        loadingMeter = new createjs.Shape();
        loadingMeter.x = CONSTANTS.WIDTH/2 - 200;
        loadingMeter.y = CONSTANTS.HEIGHT/2;
        loadingMeter.graphics.beginFill("#ff00ef").drawRect(0, 0, 400, 40);
        loadingMeter.scaleX = 0;
        stage.addChild(loadingMeter);
    }

    function handlePlayButton() {
        clearInterval(titleBackgroundInterval);
        change_stage();
        document.getElementById("instructions").style.display = "none";
        gameObject.getHud().renderStartTimer();
    }

    function handleComplete(event) {
        stage.removeChild(loadingMeter);
        stage.removeChild(loadingMeterBackground);
        song = event.item;
        $('#titleMenu').show();
    }

    function fileProgress(event) {
        createjs.Tween.get(loadingMeter).to({scaleX: event.progress, scaleY: 1}, 5, createjs.Ease.quartIn);
        // loadingMeter.scaleX();
        // console.log("progress " + event.progress.toString());
    }

    function drawLoadingText() {
        yay = new createjs.Text("loading..",
                                "bold 65px Helvetica",
                                "#FFFFFF");

        // yay.alpha = 0.2;
        yay.x = CONSTANTS.WIDTH / 2;
        yay.y = CONSTANTS.HEIGHT / 4;
        yay.textBasline = "middle";
        stage.addChild(yay);
    }

    function drawInstructions() {
        instructionTitle = new createjs.Text("instructions:",
                                   "bold 25px Helvetica",
                                   "#FFFFFF");
        instructionTitle.x = CONSTANTS.WIDTH / 2 + 20;
        instructionTitle.y = CONSTANTS.HEIGHT / 2 - 30;
        instructionTitle.textBaseline = "alphabetic";
        stage.addChild(instructionTitle);

        instructionText = new createjs.Text("throw the craziest party in town while\n" +
                             "running your illegal, for-profit orphanage\n\n" +
                             "catch the stars as they shoot to the beat of the music\n" +
                             "miss too many of them and the cops will shut you down\n" +
                             "use your stars to purchase powerups\n\n" +
                             "increase the volume to increase the difficulty\n" +
                             "the louder the party, the more partiers will come\n\n" + // need to implement this
                             "partiers will produce babies for you, which means profit!",
                            "20px Helvetica",
                            "#FFFFFF");
        instructionText.x = CONSTANTS.WIDTH / 2 + 40;
        instructionText.y = CONSTANTS.HEIGHT / 2;
        instructionText.lineHeight = 24;
        instructionText.textBaseline = "alphabetic";
        stage.addChild(instructionText);
    }

    function change_stage() {
        clearInterval(titleBackgroundInterval);
        $('#titleState').hide();
        $('.HUD').show();
        $('.audioControlsPane').show();
        stage.removeAllChildren();
        new_stage();
        stage.update();
    }

    init();
};
