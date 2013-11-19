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

    function updateAll() {
        var babyRepo = gameObject.getBabyRepo();
        var babyRepoPosition = gameObject.getBabyRepo().getPosition();

        for (var i in people) {
            var tmp = people[i].getPosition();
            createjs.Tween.get(people[i]).to(babyRepoPosition, 1000, createjs.Ease.linear);
            if (circlesDoCollide(people[i], babyRepo)) {
                people[i].setPosition(tmp);
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

    this.moveAll = function() {
        updateAll();
    };

    this.getGoer = function(num_) {
        return people[num_];
    };
};
