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

    function stopWhenCollide() {
        var babyRepoPosition = gameObject.getBabyRepo().getPosition();
        var babyRepoRadius = gameObject.getBabyRepo().getRadius();
        var doorRadius = gameObject.getDoor().getRadius();

        for (var i in people) {
            var offset = 4/5 * Math.random() * (doorRadius - babyRepoRadius);
            if (getDistance(people[i], gameObject.getBabyRepo()) < babyRepoRadius + people[i].getRadius() + offset) {
                people[i].wanderInParty();
            } else {
                people[i].wanderAround();
            }
            if (getDistance(people[i], gameObject.getBabyRepo()) < babyRepoRadius + people[i].getRadius() + offset) {
                createjs.Tween.removeTweens(people[i].getShape());
            }
        }
    }

    function moveAll() {
        var babyRepoPosition = gameObject.getBabyRepo().getPosition();
        var babyRepoRadius = gameObject.getBabyRepo().getRadius();
        var doorRadius = gameObject.getDoor().getRadius();

        for (var i in people) {
            var offset = 4/5 * Math.random() * (doorRadius - babyRepoRadius);
            if (getDistance(people[i], gameObject.getBabyRepo()) < babyRepoRadius + people[i].getRadius() + offset) {
                people[i].wanderInParty();
            } else {
                people[i].wanderAround();
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
        stopWhenCollide();
    };

    this.wander = function() {
        moveAll();
    };

    this.getGoer = function() {
        return people;
    };

    this.size = function() {
        return people.length;
    };
};
