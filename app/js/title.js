var TitleObject = function(new_stage){
    //private funcs
    function init() {
        drawTitle();
        drawInstructions();
        drawStartButton();
        preload_songs();
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
        instr1 = new createjs.Text("1. click to add a partygoer",
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
        instr2.y = CONSTANTS.HEIGHT / 7 + 75;
        instr2.textBaseline = "alphabetic";
        stage.addChild(instr2);
    }

    function drawStartButton() {
        button = new createjs.Shape();
        button.graphics
            .beginFill('#FFBA36')
            .drawRect(CONSTANTS.WIDTH / 3 + 275,
                      CONSTANTS.HEIGHT / 7 + 90,
                      100,
                      30);
        button.addEventListener("click", change_stage);
        stage.addChild(button);

        start = new createjs.Text("start",
                                  "20px Georgia",
                                  "#000");
        start.x = CONSTANTS.WIDTH / 3 + 302;
        start.y = CONSTANTS.HEIGHT / 7 + 110;
        start.textBaseline = "alphabetic";
        start.addEventListener("click", change_stage);
        stage.addChild(start);
    }

    function change_stage() {
        $('.infoPane').show();
        $('.audioControlsPane').show();
        var audio = stage.getChildByName('audio');
        stage.removeAllChildren();
        stage.addChild(audio);
        new_stage();
        stage.update();
    }

    function preload_songs() {
      preloaded_songs = {};
      preloaded_songs['06 Loud Pipes.m4a'] = new SoundObject('06 Loud Pipes.m4a');
    }

    init();
};
