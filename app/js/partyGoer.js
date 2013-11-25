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

        var pos = getRandomEdgePos(goer);
        goer.x = pos.x;
        goer.y = pos.y;

        wanderOutside();
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

    function distance(a, b_obj) {
      var b = b_obj.getPosition();

      return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }

    function moveWithMusic() {
        var dist = distance(goer, gameObject.getBabyRepo());
        console.log(dist);
        createjs.Tween.get(goer).to(getRandomPosInParty(), dist, createjs.Ease.linear);
    }

    function wanderOutside() {
        var babyRepo = gameObject.getBabyRepo();
        var dist = distance(goer, babyRepo);
        if (Math.random() < gameObject.getDoor().getRadius() / dist) {
            createjs.Tween.get(goer).to(getRandomPosInParty(), dist, createjs.Ease.linear);
        } else {
            var destination = getRandomPosOutside();
            createjs.Tween.get(goer).to(destination, destination, createjs.Ease.linear);
        }
    }

    function getRandomPosInParty() {
        var babyRepoPosition = gameObject.getBabyRepo().getPosition();
        var babyRepoRadius = gameObject.getBabyRepo().getRadius();
        var doorRadius = gameObject.getDoor().getRadius();
        var radiusDiff = doorRadius - babyRepoRadius - 2 * radius;

        return {
            x: babyRepoPosition.x + getRandomSign * (babyRepoRadius + Math.random() * radiusDiff),
            y: babyRepoPosition.y + getRandomSign * (babyRepoRadius + Math.random() * radiusDiff),
        };
    }

    function getRandomPosOutside() {
        var babyRepoPosition = gameObject.getBabyRepo().getPosition();
        var babyRepoRadius = gameObject.getBabyRepo().getRadius();
        var doorRadius = gameObject.getDoor().getRadius();

        return {
            x: babyRepoPosition.x + getRandomSign * (doorRadius + Math.random() * (CONSTANTS.WIDTH - doorRadius)),
            y: babyRepoPosition.y + getRandomSign * (doorRadius + Math.random() * (CONSTANTS.HEIGHT - doorRadius)),
        };
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

    this.wanderInParty = function() {
        moveWithMusic();
    };

    this.wanderAround = function() {
        wanderOutside();
    };

    init();
};
