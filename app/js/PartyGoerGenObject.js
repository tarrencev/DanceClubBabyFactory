var PartyGoerGenObject = function() {
    //private vars
    //declare private vars here
    var people = [];

    //private funcs
    function drawPartyGoer() {
        var goer = new PartyGoerObject();
        while (checkForCollisions(goer)) {
            goer.setPosition(getRandomPos(goer));
        }
        people.push(goer);
    }

    function drawDrugDealer() {
        var goer = new PartyGoerObject("DrugDealer");
        while (checkForCollisions(goer)) {
            goer.setPosition(getRandomPos(goer));
        }
        people.push(goer);
    }

    function drawUnderage() {
        var goer = new PartyGoerObject("Underage");
        while (checkForCollisions(goer)) {
            goer.setPosition(getRandomPos(goer));
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

    function getRandomPos(goer_) {
        return getRandomEdgePos();
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
};