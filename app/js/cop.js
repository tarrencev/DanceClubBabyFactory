var CopObject = function() {
    //private vars
    //declare private vars here
    var radius = 8;
    var cop;

    //private funcs
    function init() {
        drawCop();

        var pos = getRandomEdgePos(cop);
        cop.x = pos.x;
        cop.y = pos.y;

        wanderOutside();
    }

    function drawCop() {
        cop = new createjs.Shape();
        cop.graphics
            .beginStroke('#00f')
            .setStrokeStyle(5)
            .beginFill('#00f')
            .drawCircle(0, 0, radius);

        stage.addChild(cop);
    }

    function patrol() {
        var babyRepo = gameObject.getBabyRepo();
        var babyRepoPosition = babyRepo.getPosition();
        var babyRepoRadius = babyRepo.getRadius();
        var doorRadius = gameObject.getDoor().getRadius();

        var offset = 4/5 * Math.random() * (doorRadius - babyRepoRadius);
        if (getDistance(people[i], babyRepo) < babyRepoRadius + people[i].getRadius() + offset) {
            createjs.Tween.removeTweens(people[i].getShape());
        }
    }

    //public funs
    this.setPosition = function(position) {
        cop.x = position.x;
        cop.y = position.y;
    };

    this.getPosition = function() {
        return {
            x: cop.x,
            y: cop.y
        };
    };

    this.getRadius = function() {
        return radius;
    };

    this.getShape = function() {
        return cop;
    };

    this.tick = function() {
        if (inside) {
          patrol();
        } else {
          invade();
        }
    };

    init();
};

