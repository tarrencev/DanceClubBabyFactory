var BabyRepoObject = function() {
    //private vars
    //declare private vars here
    var container;
    var radius = 75;
    var babies = [];

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
            .drawCircle(CONSTANTS.WIDTH/2, CONSTANTS.HEIGHT/2, radius);

        // container.cache(CONSTANTS.WIDTH/2 - 80, CONSTANTS.HEIGHT/2 - 80, 160, 160);
        stage.addChild(container);
    }

    function drawBaby() {
        var baby = new BabyObject();
        while (checkForCollisions(baby)) {
            baby.setPosition(getRandomPos(baby));
        }
        babies.push(baby);
    }

    function checkForCollisions(baby_) {
        for (var i in babies) {
            if(circlesDoCollide(babies[i], baby_))
                return true;
        }
        return false;
    }

    function getRandomPos(baby) {
        var position = {
            x: Math.random() * 50 * getRandomSign(),
            y: Math.random() * 50 * getRandomSign()
        };
        return position;
    }

    //public funcs
    this.addBaby = function() {
        drawBaby();
    };

    this.getPosition = function() {
        return {
            x: container.x,
            y: container.y
        };
    };

    this.getRadius = function() {
        return radius;
    };

    init();
};