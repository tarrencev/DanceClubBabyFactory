var PartyGoerGenObject = function() {
    //private vars
    //declare private vars here
    var people = [];
    var dealers =[];
    var teens = [];

    //private funcs
    function drawPartyGoer() {
        var goer = new PartyGoerObject();
        while (checkForCollisions(goer)) {
            goer.setPosition(getRandomEdgePos(goer));
        }
        people.push(goer);
        var pos = getRandomPosOutside();
        var distance = getDistanceBtwObjectAndPos(goer, pos);
        createjs.Tween.get(goer.getShape()).to(pos, 30 * distance, createjs.Ease.linear);
    }

    function drawDrugDealer() {
        var goer = new PartyGoerObject("DrugDealer");
        while (checkForCollisions(goer)) {
            goer.setPosition(getRandomEdgePos(goer));
        }
        people.push(goer);
        dealers.push(goer);
        var pos = getRandomPosOutside();
        var distance = getDistanceBtwObjectAndPos(goer, pos);
        createjs.Tween.get(goer.getShape()).to(pos, 30 * distance, createjs.Ease.linear);
    }

    function drawUnderage() {
        var goer = new PartyGoerObject("Underage");
        while (checkForCollisions(goer)) {
            goer.setPosition(getRandomEdgePos(goer));
        }
        people.push(goer);
        teens.push(goer);
        var pos = getRandomPosOutside();
        var distance = getDistanceBtwObjectAndPos(goer, pos);
        createjs.Tween.get(goer.getShape()).to(pos, 30 * distance, createjs.Ease.linear);
    }

    function getDistanceBtwObjectAndPos(obj, pos) {
        var xDist = obj.getPosition().x - pos.x;
        var yDist = obj.getPosition().y - pos.y;

        return Math.sqrt(xDist * xDist + yDist * yDist);
    }

    function checkForCollisions(goer_) {
        for (var i in people) {
            if(circlesDoCollide(people[i], goer_))
                return true;
        }
        return false;
    }

    function stopWhenCollide() {
        var babyRepo = gameObject.getBabyRepo();
        var babyRepoPosition = babyRepo.getPosition();
        var babyRepoRadius = babyRepo.getRadius();
        var doorRadius = gameObject.getDoor().getRadius();

        /*for (var i in people) {
            if (checkForCollisions(people[i]) {
                createjs.Tween.removeTweens(people[i].getShape());
                var pos = getANearByPosition(people[i].getPosition());
                createjs.Tween.get(people[i].getShape()).to(pos, 30 * getDistanceBtwObjectAndPos(people[i], pos), createjs.Ease.linear);
            }
        }*/
        
        for (var i in people) {
            var distance = getDistance(people[i], babyRepo);
            if (distance < babyRepoRadius + 2 * people[i].getRadius()) {
                createjs.Tween.removeTweens(people[i].getShape());
                var pos;
                do {
                    pos = getANearByPosition(people[i].getPosition());
                } while (distance > getDistanceBtwObjectAndPos(babyRepo, pos));
                createjs.Tween.get(people[i].getShape()).to(pos, 30 * getDistanceBtwObjectAndPos(people[i], pos), createjs.Ease.linear);
            }
        }
    }

    function getANearByPosition(pos) {
        return {
            x: pos.x + 50 * Math.random(),
            y: pos.y + 50 * Math.random()
        };
    }

    function moveAll() {
        var babyRepo = gameObject.getBabyRepo();
        var babyRepoPosition = babyRepo.getPosition();
        var babyRepoRadius = babyRepo.getRadius();
        var doorRadius = gameObject.getDoor().getRadius();
        var pos;

        for (var i in people) {

            var distance = getDistance(people[i], babyRepo);
            if (distance < doorRadius) {
                people[i].hasBeenToParty();
            }

            var offset = 4/5 * Math.random() * (doorRadius - babyRepoRadius);
            if (distance < babyRepoRadius + people[i].getRadius() + offset && !people[i].checkHasBeenToParty()) {
                createjs.Tween.removeTweens(people[i].getShape());
                pos = getRandomPosInParty();
                createjs.Tween.get(people[i].getShape()).to(pos, 30 * getDistanceBtwObjectAndPos(people[i], pos), createjs.Ease.linear);
            } else {
                
                if (Math.random() < doorRadius / distance && !people[i].checkHasBeenToParty()) {
                    createjs.Tween.removeTweens(people[i].getShape());
                    pos = getRandomPosInParty();
                    createjs.Tween.get(people[i].getShape()).to(getRandomPosInParty(), 30 * getDistanceBtwObjectAndPos(people[i], pos), createjs.Ease.linear);
                } else {
                    createjs.Tween.removeTweens(people[i].getShape());
                    pos = getRandomPosOutside();
                    createjs.Tween.get(people[i].getShape()).to(getRandomPosOutside(), 30 * getDistanceBtwObjectAndPos(people[i], pos), createjs.Ease.linear);
                }
            }
        }
        
        var overflow = getPartySize() - gameObject.getPartyLimit();
        for (var j = 0; j < overflow; j++) {
            createjs.Tween.removeTweens(people[i].getShape());
            pos = getRandomPosOutside();
            createjs.Tween.get(people[j].getShape()).to(pos, 30 * getDistanceBtwObjectAndPos(people[i], pos), createjs.Ease.linear);
        }
    }

    function getPartySize() {
        var num = 0;
        for (var i in people) {
            if (getDistance(people[i], gameObject.getBabyRepo()) < gameObject.getDoor().getRadius()) {
                num++;
            }
        }
        return num;
    }

    function getRandomPosInParty() {
        var babyRepoPosition = gameObject.getBabyRepo().getPosition();
        var babyRepoRadius = gameObject.getBabyRepo().getRadius();
        var doorRadius = gameObject.getDoor().getRadius();
        var radiusDiff = doorRadius - babyRepoRadius - 10;

        return {
            x: babyRepoPosition.x + getRandomSign() * (babyRepoRadius + Math.random() * radiusDiff),
            y: babyRepoPosition.y + getRandomSign() * (babyRepoRadius + Math.random() * radiusDiff)
        };
    }

    function getRandomPosOutside() {
        var babyRepoPosition = gameObject.getBabyRepo().getPosition();
        var babyRepoRadius = gameObject.getBabyRepo().getRadius();
        var doorRadius = gameObject.getDoor().getRadius();

        return {
            x: babyRepoPosition.x + getRandomSign() * (doorRadius + Math.random() * (CONSTANTS.WIDTH - doorRadius)),
            y: babyRepoPosition.y + getRandomSign() * (doorRadius + Math.random() * (CONSTANTS.HEIGHT - doorRadius))
        };
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

    this.partySize = function() {
        return getPartySize();
    };

    this.drugDealerSize = function() {
        return dealers.length;
    };    

    this.drugDealerInPartySize = function() {
        
        var num = 0;
        for (var i in dealers) {
            if (getDistance(dealers[i], gameObject.getBabyRepo()) < gameObject.getDoor().getRadius()) {
                num++;
            }
        }
        return num;
    };

    this.underageSize = function() {
        return teens.length;
    };

    this.underageInPartySize = function() {
        
        var num = 0;
        for (var i in teens) {
            if (getDistance(teens[i], gameObject.getBabyRepo()) < gameObject.getDoor().getRadius()) {
                num++;
            }
        }
        return num;
    };
    
    this.reset = function() {
        for (var i in people) {
            createjs.Tween.removeTweens(people[i].getShape());
            pos = getRandomPosOutside();
            createjs.Tween.get(people[i].getShape()).to(getRandomPosOutside(), 30 * getDistanceBtwObjectAndPos(people[i], pos), createjs.Ease.linear);
            people[i].removeFromStage();
        }
        for (i in dealers) {
            dealers[i].removeFromStage();
        }
        for (i in teens) {
            teens[i].removeFromStage();
        }
        people = [];
        dealers = [];
        teens = [];
    };
};
