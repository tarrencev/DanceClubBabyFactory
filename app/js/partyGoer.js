var PartyGoerObject = function(type_) {
    //private vars
    //declare private vars here
    var type = type_;
    var radius = 8;
    var goer;
    var beenToParty = false;

    //private funcs
    function init() {
        if (type === "DrugDealer")
            drawDrugDealer();
        else if (type === "Underage")
            drawUnderAge();
        else
            drawGoer();

        var pos = getRandomEdgePos(goer);
        goer.x = pos.x;
        goer.y = pos.y;

        createjs.Tween.get(goer).to(gameObject.getBabyRepo().getPosition(), 5000, createjs.Ease.linear);
    }

    function drawGoer() {
        goer = new createjs.Shape();
        goer.graphics
            .beginStroke('#aaa')
            .setStrokeStyle(5)
            .beginFill('#000')
            .drawCircle(0, 0, radius);

        stage.addChild(goer);
    }

    function drawDrugDealer() {
        goer = new createjs.Shape();
        goer.graphics
            .beginStroke('#a0a0a0')
            .setStrokeStyle(5)
            .beginFill('#ff0000')
            .drawCircle(0, 0, radius);

        stage.addChild(goer);
    }

    function drawUnderAge() {
        goer = new createjs.Shape();
        goer.graphics
            .beginStroke('#a0a0a0')
            .setStrokeStyle(5)
            .beginFill('#ffff00')
            .drawCircle(0, 0, radius);

        stage.addChild(goer);
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

    this.getShape = function() {
        return goer;
    };

    this.checkHasBeenToParty = function() {
        return beenToParty;
    };

    this.hasBeenToParty = function() {
        beenToParty = true;
    };

    init();
};
