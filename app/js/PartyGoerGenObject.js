var PartyGoerGenObject = function() {
    
    //private vars
    var people = [];
    var wanderSpeed = 30;
    var danceSpeed = 30;
    var everyoneNeedtoLeave = false;

    //private funcs
    function checkForCollisions(goer_) {
        for (var i in people) {
            if(circlesDoCollide(people[i], goer_))
                return true;
        }
        return false;
    }

    function getDistanceBtwObjectAndPos(obj, pos) {
        var xDist = obj.getPosition().x - pos.x;
        var yDist = obj.getPosition().y - pos.y;

        return Math.sqrt(xDist * xDist + yDist * yDist);
    }

    function drawPartyGoer() {
        var goer = new PartyGoerObject();
        //while (checkForCollisions(goer)) {
            goer.setPosition(getRandomEdgePos(goer));
        //}
        people.push(goer);
        var pos = getRandomPosOutside();
        var distance = getDistanceBtwObjectAndPos(goer, pos);
        createjs.Tween.get(goer.getShape()).to(pos, wanderSpeed * distance, createjs.Ease.linear);
    }

    function stayAway(obj) {

        var pos;
        distance = getDistance(obj, gameObject.getBabyRepo());
        createjs.Tween.removeTweens(obj.getShape());
        do {
            pos = getANearByPosition(obj.getPosition());
        } while (distance >= getDistanceBtwObjectAndPos(gameObject.getBabyRepo(), pos));
        createjs.Tween.get(obj.getShape()).to(pos, wanderSpeed * getDistanceBtwObjectAndPos(obj, pos), createjs.Ease.linear);
    }

    function kickEveryoneOut() {
        for (var i in people) {
            pos = getRandomPosOutside();
            createjs.Tween.get(people[i].getShape()).to(pos, wanderSpeed * getDistanceBtwObjectAndPos(people[i], pos), createjs.Ease.linear);
        }
    }

    function getANearByPosition(pos) {
        return {
            x: pos.x + getRandomSign() * 100 * Math.random(),
            y: pos.y + getRandomSign() * 100 * Math.random()
        };
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
            x: babyRepoPosition.x + getRandomSign() * (doorRadius + 10 + Math.random() * (CONSTANTS.WIDTH - doorRadius)),
            y: babyRepoPosition.y + getRandomSign() * (doorRadius + 10 + Math.random() * (CONSTANTS.HEIGHT - doorRadius))
        };
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

            if (distance < babyRepoRadius + 1.5 * people[j].getRadius()) {
                stayAway(people[j]);
            } else if (distance > 3/4 * doorRadius && distance < doorRadius) {
                if (people[j].checkWantToParty()) {
                    createjs.Tween.removeTweens(people[j].getShape());
                    pos = getRandomPosInParty();
                    createjs.Tween.get(people[j].getShape()).to(pos, danceSpeed * getDistanceBtwObjectAndPos(people[j], pos), createjs.Ease.linear);
                }
            } else if (distance < 1.2 * doorRadius && !people[j].checkWantToParty()) {
                stayAway(people[j]);
            }
        }

        /*if (everyoneNeedtoLeave) {
            kickEveryoneOut();
        }*/
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

            if (distance < babyRepoRadius + people[i].getRadius() + offset) {
                createjs.Tween.removeTweens(people[i].getShape());
                pos = getRandomPosInParty();
                createjs.Tween.get(people[i].getShape()).to(pos, danceSpeed * getDistanceBtwObjectAndPos(people[i], pos), createjs.Ease.linear);
            } else {
                
                if (Math.random() < doorRadius / distance) {
                    people[i].likeParty();
                    createjs.Tween.removeTweens(people[i].getShape());
                    pos = getRandomPosInParty();
                    createjs.Tween.get(people[i].getShape()).to(pos, danceSpeed * getDistanceBtwObjectAndPos(people[i], pos), createjs.Ease.linear);
                } else {
                    createjs.Tween.removeTweens(people[i].getShape());
                    pos = getRandomPosOutside();
                    createjs.Tween.get(people[i].getShape()).to(pos, wanderSpeed * getDistanceBtwObjectAndPos(people[i], pos), createjs.Ease.linear);
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

    //public funcs
    this.addPartyGoer = function() {
        drawPartyGoer();
    };

    this.tick = function() {
        collisionBehaviors();
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

    this.pause = function() {
        for (var i in people) {
            createjs.Tween.removeTweens(people[i].getShape());
        }
    };

    this.backToParty = function() {
        everyoneNeedtoLeave = false;
        moveAll();
    };
    
    this.reset = function() {
        //everyoneNeedtoLeave = true;
        //kickEveryoneOut();
        /*for (var i in people) {
            people[i].removeFromStage();
        }*/
        //people = [];
    };

    this.clearPeople = function() {
        people = [];
    };

    this.getPeopleInParty = function() {
        var peeps = [];
        for (var i in people) {
            if (getDistance(people[i], gameObject.getBabyRepo()) < gameObject.getDoor().getRadius()) {
                peeps.push(people[i]);
            }
        }
        return peeps;
    };
};
