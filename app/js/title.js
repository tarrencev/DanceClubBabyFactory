var TitleObject = function(new_stage){
    var box, title, instr1, instr2, button, start;

    //private funcs
    function init() {
        $('.HUD').hide();
        drawBox();
        drawTitle();
        drawInstructions();
        drawStartButton();
        preload_songs();
    }

    function drawBox() {
        var position = {
            x: CONSTANTS.WIDTH/2,
            y: CONSTANTS.HEIGHT/2
        };

        box = new createjs.Shape();
        box.x = position.x;
        box.y = position.y;
        box.graphics
           .beginFill("#44a")
           .drawRoundRect(-CONSTANTS.WIDTH / 2 + 50, -CONSTANTS.HEIGHT / 2 + 50, CONSTANTS.WIDTH - 100, CONSTANTS.HEIGHT - 100, 10);
        stage.addChild(box);
    }

    function drawTitle() {
        title = new createjs.Text("the\ninfinite\ndubstep\nbaby\nfactory",
                                  "bold 85px Georgia",
                                  "#38DFF9");
        title.alpha = 0.4;
        title.x = CONSTANTS.WIDTH / 6;
        title.y = CONSTANTS.HEIGHT / 6;
        title.textBaseline = "alphabetic";
        stage.addChild(title);
    }

    function drawInstructions() {
        instr1 = new createjs.Text("1. move the mouse to control the door\n" +
                                   "   (block the stars that come out!)",
                                   "20px Georgia",
                                   "#38DFF9");
        instr1.x = CONSTANTS.WIDTH / 3 + 250;
        instr1.y = CONSTANTS.HEIGHT / 7 + 50;
        instr1.textBaseline = "alphabetic";
        stage.addChild(instr1);

        instr2 = new createjs.Text("2. click and drag to move the door",
                                  "20px Georgia",
                                  "#38DFF9");
        instr2.x = CONSTANTS.WIDTH / 3 + 250;
        instr2.y = CONSTANTS.HEIGHT / 7 + 100;
        instr2.textBaseline = "alphabetic";
        stage.addChild(instr2);
    }

    function drawStartButton() {
        button = new createjs.Shape();
        button.graphics
            .beginFill('#FFBA36')
            .drawRect(CONSTANTS.WIDTH / 3 + 275,
                      CONSTANTS.HEIGHT / 7 + 110,
                      100,
                      30);
        stage.addChild(button);

        start = new createjs.Text("loading ...",
                                  "20px Georgia",
                                  "#000");
        start.x = CONSTANTS.WIDTH / 3 + 282;
        start.y = CONSTANTS.HEIGHT / 7 + 130;
        start.textBaseline = "alphabetic";
        stage.addChild(start);
    }

    function change_stage() {
        $('.HUD').show();
        $('.audioControlsPane').show();
        //var audio = stage.getChildByName('audio');
        stage.removeAllChildren();
        //stage.addChild(audio);
        new_stage();
        stage.update();
    }

    function preload_songs() {
      preloaded_songs = {};
      preloaded_songs['Flight Facilities - Crave You (Adventure Club Dubstep Remix).mp3'] = new SoundObject('Flight Facilities - Crave You (Adventure Club Dubstep Remix).mp3');
    }

    this.makeReadyForStart = function() {
        start.text = "start";
        start.x = CONSTANTS.WIDTH / 3 + 302;
        start.addEventListener("click", change_stage);
        button.addEventListener("click", change_stage);
    };

    init();
};
