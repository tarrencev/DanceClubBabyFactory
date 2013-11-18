var PartyGoerObject = function(type_) {
    //private vars
    //declare private vars here
    var type = type_;
    var radius = 8;
    var goer;

    //private funcs
    function init() {
        if (type === "DrugDealer")
            drawDrugDealer();
        else if (type === "Underage")
            drawUnderAge();
        else
            drawGoer();
    }

    function drawGoer() {
        goer = new createjs.Shape();
        goer.graphics
            .beginStroke('#aaa')
            .setStrokeStyle(5)
            .beginFill('#000')
            .drawCircle(0, 0, radius);

        var pos = getRandomEdgePos(goer);
        goer.x = pos.x;
        goer.y = pos.y;
        stage.addChild(goer);
    }

    function drawDrugDealer() {
        goer = new createjs.Shape();
        goer.graphics
            .beginStroke('#a0a0a0')
            .setStrokeStyle(5)
            .beginFill('#ff0000')
            .drawCircle(0, 0, radius);

        var pos = getRandomEdgePos(goer);
        goer.x = pos.x;
        goer.y = pos.y;
        stage.addChild(goer);
    }

    function drawUnderAge() {
        goer = new createjs.Shape();
        goer.graphics
            .beginStroke('#a0a0a0')
            .setStrokeStyle(5)
            .beginFill('#ffff00')
            .drawCircle(0, 0, radius);

        var pos = getRandomEdgePos(goer);
        goer.x = pos.x;
        goer.y = pos.y;
        stage.addChild(goer);
    }

    function move() {
        var tmp = goer;
        var babyRepoPosition = gameObject.getBabyRepo().getPosition();
        var babyRepoRadius = gameObject.getBabyRepo().getRadius();
        createjs.Tween.get(goer).to(babyRepoPosition, 1000, createjs.Ease.linear);
        if (goer.x > babyRepoPosition.x && goer.x < babyRepoPosition + babyRepoRadius) {
            goer.x = tmp.x;
        }
        if (goer.y > babyRepoPosition.y && goer.y < babyRepoPosition + babyRepoRadius) {
            goer.y = tmp.y;
        }
        // timer
    }

    //public funs
    this.setPosition = function(position) {
        goer.x = position.x;
        goer.y = position.y;
    };

    this.getPosition = function() {
        return {
            x: goer.x,
            y: goer.y
        };
    };

    this.getRadius = function() {
        return radius;
    };

    this.move = function() {
        move();
    };

    init();
};