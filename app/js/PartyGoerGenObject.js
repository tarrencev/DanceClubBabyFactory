var PartyGoerGenObject = function() {
    //private vars
    //declare private vars here
    var people = [];

    //private funcs
    function drawPartyGoer() {
        var goer = new PartyGoerObject();
        while (checkForCollisions(goer)) {
            goer.setPosition(getRandomEdgePos(goer));
        }
        people.push(goer);
    }

    function drawDrugDealer() {
        var goer = new PartyGoerObject("DrugDealer");
        while (checkForCollisions(goer)) {
            goer.setPosition(getRandomEdgePos(goer));
        }
        people.push(goer);
    }

    function drawUnderage() {
        var goer = new PartyGoerObject("Underage");
        while (checkForCollisions(goer)) {
            goer.setPosition(getRandomEdgePos(goer));
        }
        people.push(goer);
    }

    function checkForCollisions(goer_) {
        for (var i in people) {
            if(circlesDoCollide(people[i], goer_))
                return true;
        }
        return false;
    }

    function moveAll() {
        var babyRepoPosition = gameObject.getBabyRepo().getPosition();
        var babyRepoRadius = gameObject.getBabyRepo().getRadius();

        for (var i in people) {
            var tmp = people[i].getPosition();
            if (getDistance(people[i], gameObject.getBabyRepo()) < babyRepoRadius + people[i].getRadius() + 25) {
                createjs.Tween.removeTweens(people[i].getShape());
            }
        }
    }

    //public funcs
    this.addPartyGoer = function() {
        drawPartyGoer();
    };

    this.addDrugDealer = function() {
        drawDrugDealer();
    };

    this.addUnderage = function() {
        drawUnderage();
    };

    this.tick = function() {
        moveAll();
    };

    this.getGoer = function() {
        return people;
    };
};
