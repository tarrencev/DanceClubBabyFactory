var BabyRepoObject = function(){
    //private vars
    //declare private vars her
    var container;
    var babies = [];

    //private funcs
    function init() {
        drawContainer();
        drawBaby();
    }

    function drawContainer() {
        container = new createjs.Shape();
            container.graphics
            .beginStroke('#ee2a7b')
            .setStrokeStyle(8)
            .beginFill('#ec87b8')
            .drawCircle(CONSTANTS.WIDTH/2, CONSTANTS.HEIGHT/2, 75);

        container.cache(CONSTANTS.WIDTH/2 - 80, CONSTANTS.HEIGHT/2 - 80, 160, 160);
        stage.addChild(container);
    }

    function drawBaby() {
        var baby = new BabyObject();
        babies.push(baby);
    }

    init();
};