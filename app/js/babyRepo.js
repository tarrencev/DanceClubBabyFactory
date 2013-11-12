var BabyRepoObject = function(){
    //private vars
    //declare private vars her
    var container;

    //private funcs
    function init() {
        drawContainer();
    }

    function drawContainer() {
        container = new createjs.Shape();
            container.graphics
            .beginStroke('#ee2a7b')
            .setStrokeStyle(8)
            .beginFill('#ec87b8')
            .drawCircle(CONSTANTS.WIDTH/2, CONSTANTS.HEIGHT/2, 75);

        stage.addChild(container);
    }

    init();
};