var TitleObject = function(new_stage){
    var box, title, instr1, instr2, button, start, yay;
    var recordOutline, recordTracks, recordLabel;

    //private funcs
    function init() {
        $('.HUD').hide();
        // drawBox();
        drawRecordOutline();
        drawRecordTracks();
        drawRecordLabel();
        drawTitle();
        drawLoadingText();
        drawInstructions();
        preload_songs();
    }

    function drawRecordOutline() {
        recordOutline = new createjs.Shape();
        recordOutline.graphics.beginStroke('#ffffff')
            .setStrokeStyle(8)
            .arc(CONSTANTS.WIDTH/4, CONSTANTS.HEIGHT/2, 250, 0, 2 * Math.PI);
        recordOutline.cache(CONSTANTS.WIDTH/4 - 260, CONSTANTS.HEIGHT/2 - 260, 520, 520);

        stage.addChild(recordOutline);
    }

    function drawRecordTracks() {
        for (var i = 100; i < 248; i += 4) {
            recordTracks = new createjs.Shape();
            if(i%18 === 0) {
                recordTracks.graphics.beginStroke('#111111')
                    .setStrokeStyle(4)
                    .arc(CONSTANTS.WIDTH/4, CONSTANTS.HEIGHT/2, i, 0, 2 * Math.PI);
            } else {
                recordTracks.graphics.beginStroke('#333333')
                    .setStrokeStyle(1)
                    .arc(CONSTANTS.WIDTH/4, CONSTANTS.HEIGHT/2, i, 0, 2 * Math.PI);
            }
            recordTracks.cache(CONSTANTS.WIDTH/4 - 260, CONSTANTS.HEIGHT/2 - 260, 520, 520);

            stage.addChild(recordTracks);
        }
    }

    function drawRecordLabel() {
        recordLabel = new createjs.Shape();
        recordLabel.graphics.beginStroke('#FF33FF')
            .setStrokeStyle(80)
            .arc(CONSTANTS.WIDTH/4, CONSTANTS.HEIGHT/2, 30, 0, 2 * Math.PI);
        recordLabel.cache(CONSTANTS.WIDTH/4 - 260, CONSTANTS.HEIGHT/2 - 260, 520, 520);

        stage.addChild(recordLabel);
    }

    function drawLoadingText() {
        yay = new createjs.Text("loading..",
                                "bold 65px Helvetica",
                                "#FFFFFF");

        // yay.alpha = 0.2;
        yay.x = CONSTANTS.WIDTH / 2;
        yay.y = CONSTANTS.HEIGHT / 4;
        yay.textBasline = "alphabetic";
        stage.addChild(yay);
    }

    function drawTitle() {
        title = new createjs.Text("the\ninfinite\ndubstep\nbaby\nfactory",
                                  "bold 75px Helvetica",
                                  "#FFFFFF");
        title.alpha = 1.0;
        title.textAlign = "center";
        title.textBaseline = "middle";
        title.x = CONSTANTS.WIDTH/4;
        title.y = CONSTANTS.HEIGHT/4;
        stage.addChild(title);
    }

    function drawInstructions() {
        instructionTitle = new createjs.Text("instructions:",
                                   "bold 25px Helvetica",
                                   "#FFFFFF");
        instructionTitle.x = CONSTANTS.WIDTH / 2 + 20;
        instructionTitle.y = CONSTANTS.HEIGHT / 2 - 30;
        instructionTitle.textBaseline = "alphabetic";
        stage.addChild(instructionTitle);

        instructionText = new createjs.Text("thow the craziest party in town\n" +
                                   "catch the stars as they shoot to the music\n" +
                                   "the more you catch, the more partiers will come\n" +
                                   "but miss them and you might alert the cops\n" +
                                   "use your stars to purchase powerups\n" +
                                   "increase the volume to increase the difficulty\n" +
                                   "the louder the party, the more partiers will come\n" +
                                   "partiers produce babies, the more babies, the better",
                                  "20px Helvetica",
                                  "#FFFFFF");
        instructionText.x = CONSTANTS.WIDTH / 2 + 40;
        instructionText.y = CONSTANTS.HEIGHT / 2;
        instructionText.textBaseline = "alphabetic";
        stage.addChild(instructionText);
    }

    function drawStartButton() {
        button = new createjs.Shape();
        button.graphics
            .beginFill('#FFBA36')
            .drawRect(CONSTANTS.WIDTH / 3 + 275,
                      CONSTANTS.HEIGHT / 7 + 280,
                      100,
                      30);
        stage.addChild(button);

        start = new createjs.Text("loading ...",
                                  "20px Georgia",
                                  "#000");
        start.x = CONSTANTS.WIDTH / 3 + 282;
        start.y = CONSTANTS.HEIGHT / 7 + 300;
        start.textBaseline = "alphabetic";
        stage.addChild(start);
    }

    function change_stage() {
        $('.HUD').show();
        $('.audioControlsPane').show();
        stage.removeAllChildren();
        new_stage();
        stage.update();
    }

    function preload_songs() {
      preloaded_songs = {};
      preloaded_songs['Flight Facilities - Crave You (Adventure Club Dubstep Remix).mp3'] = new SoundObject('Flight Facilities - Crave You (Adventure Club Dubstep Remix).mp3');
    }

    this.makeReadyForStart = function() {
        yay.text = "play!";
        yay.addEventListener("click", change_stage);
    };

    this.progress = function() {
        yay.text = yay.text + ".";
    };

    init();
};
