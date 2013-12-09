var BabyRepoObject = function() {
    //private vars
    //declare private vars here
    var container;
    var radius = 75;
    var strokeWidth = 4;
    var babies = [];
    var birthEvt;

    //private funcs
    function init() {
        drawContainer();
        birthEvt = document.createEvent('Event');
        birthEvt.initEvent('birth', true, true);
    }

    function drawContainer() {
        container = new createjs.Shape();
        container.x = CONSTANTS.WIDTH/2;
        container.y = CONSTANTS.HEIGHT/2;
        container.graphics
            .beginStroke('#df2b90')
            .setStrokeStyle(strokeWidth)
            .beginFill('#ec87b8')
            .drawCircle(0, 0, radius);

        // container.cache(CONSTANTS.WIDTH/2, CONSTANTS.HEIGHT/2, radius*2, radius*2);
        stage.addChild(container);
    }

    function drawBaby() {
        var baby = new BabyObject();
        var tries = 0;
        while (checkForCollisions(baby) && tries++ < 10) {
            baby.setPosition(getRandomPos(baby));
        }
        babies.push(baby);
        document.dispatchEvent(birthEvt);
    }

    function checkForCollisions(baby_) {
        for (var i in babies) {
            if(circlesDoCollide(babies[i], baby_))
                return true;
        }
        return false;
    }

    function getRandomPos(baby) {
        var angle = Math.PI*2*Math.random();
        var distance = Math.random()*(radius-strokeWidth);
        var position = {
            x: Math.cos(angle)*distance,
            y: Math.sin(angle)*distance
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

    this.getNumBabies = function() {
        return babies.length;
    };

    this.reset = function() {
        for (var i in babies) {
            stage.removeChild(babies[i].baby);
        }
        babies = [];
    };

    init();
};
