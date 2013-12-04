var PartyGoerGenObject = function() {
    //private vars
    //declare private vars here
    var people = [];
    var dealers =[];
    var teens = [];
    var everyoneNeedtoLeave = false;

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

    function collisionBehaviors() {
        var babyRepo = gameObject.getBabyRepo();
        var babyRepoPosition = babyRepo.getPosition();
        var babyRepoRadius = babyRepo.getRadius();
        var doorRadius = gameObject.getDoor().getRadius();
        var distance;
        var pos;

        /*for (var i in people) {
            if (checkForCollisions(people[i])) {
                createjs.Tween.removeTweens(people[i].getShape());
                pos = getANearByPosition(people[i].getPosition());
                createjs.Tween.get(people[i].getShape()).to(pos, 30 * getDistanceBtwObjectAndPos(people[i], pos), createjs.Ease.linear);
            }
        }*/
        
        for (var j in people) {
            distance = getDistance(people[j], babyRepo);
            if (distance < doorRadius) {
                people[j].hasBeenToParty();
            }
            if (distance < babyRepoRadius + 1.5 * people[j].getRadius()) {
                createjs.Tween.removeTweens(people[j].getShape());
                do {
                    pos = getANearByPosition(people[j].getPosition());
                } while (distance > getDistanceBtwObjectAndPos(babyRepo, pos));
                createjs.Tween.get(people[j].getShape()).to(pos, 30 * getDistanceBtwObjectAndPos(people[j], pos), createjs.Ease.linear);
            } else if (distance > 3/4 * doorRadius) {
                createjs.Tween.removeTweens(people[j].getShape());
                pos = getRandomPosInParty();
                createjs.Tween.get(people[j].getShape()).to(pos, 30 * getDistanceBtwObjectAndPos(people[j], pos), createjs.Ease.linear);
            }
        }

        if (everyoneNeedtoLeave) {
            kickEveryoneOut();
        }
    }

    function kickEveryoneOut() {
        for (var i in people) {
            createjs.Tween.removeTweens(people[i].getShape());
            pos = getRandomPosOutside();
            createjs.Tween.get(people[i].getShape()).to(pos, 30 * getDistanceBtwObjectAndPos(people[i], pos), createjs.Ease.linear);
        }
    }

    function getANearByPosition(pos) {
        return {
            x: pos.x + getRandomSign() * 30 * Math.random(),
            y: pos.y + getRandomSign() * 30 * Math.random()
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
            var offset = 2/3 * Math.random() * (doorRadius - babyRepoRadius);
            if (distance < babyRepoRadius + people[i].getRadius() + offset && !people[i].checkHasBeenToParty()) {
                createjs.Tween.removeTweens(people[i].getShape());
                pos = getRandomPosInParty();
                createjs.Tween.get(people[i].getShape()).to(pos, 30 * getDistanceBtwObjectAndPos(people[i], pos), createjs.Ease.linear);
            } else {
                
                if (Math.random() < doorRadius / distance && !people[i].checkHasBeenToParty()) {
                    createjs.Tween.removeTweens(people[i].getShape());
                    pos = getRandomPosInParty();
                    createjs.Tween.get(people[i].getShape()).to(pos, 30 * getDistanceBtwObjectAndPos(people[i], pos), createjs.Ease.linear);
                } else {
                    createjs.Tween.removeTweens(people[i].getShape());
                    pos = getRandomPosOutside();
                    createjs.Tween.get(people[i].getShape()).to(pos, 30 * getDistanceBtwObjectAndPos(people[i], pos), createjs.Ease.linear);
                }
            }
        }
        
        /*var overflow = getPartySize() - gameObject.getPartyLimit();
        for (var j = 0; j < overflow; j++) {
            people[i].isLeaving();
            createjs.Tween.removeTweens(people[i].getShape());
            pos = getRandomEdgePos();
            createjs.Tween.get(people[j].getShape()).to(pos, 30 * getDistanceBtwObjectAndPos(people[i], pos), createjs.Ease.linear);
        }*/
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
        var radiusDiff = doorRadius - babyRepoRadius;

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
            x: babyRepoPosition.x + getRandomSign() * (doorRadius + 30 + Math.random() * (CONSTANTS.WIDTH - doorRadius)),
            y: babyRepoPosition.y + getRandomSign() * (doorRadius + 30 + Math.random() * (CONSTANTS.HEIGHT - doorRadius))
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
        collisionBehaviors();
    };

    this.wander = function() {
        moveAll();
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
    
    this.makeEveryoneLeave = function() {
        everyoneNeedtoLeave = true;
        kickEveryoneOut();
    };

    this.backToParty = function() {
        everyoneNeedtoLeave = false;
    };
    
    this.reset = function() {
        
        for (var i in people) {
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
