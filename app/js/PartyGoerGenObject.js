var PartyGoerGenObject = function() {
    
    //private vars
    var people = new createjs.Container();
    var wanderSpeed = 15;
    var danceSpeed = 50;
    var everyoneNeedtoLeave = false;
    var ecstasy = false;
    var partyPeople;
    var numberOfPeopleInParty = 0;
    document.addEventListener("threeKey", ecstasyHandler);
    document.addEventListener("lose", kickEveryoneOut);

    //private funcs
    function checkForCollisions(goer_) {
        for (var i =0; i < people.getNumChildren(); i++) {
            if(circlesDoCollide(people.getChildAt(i), goer_))
                return true;
        }
        return false;
    }

    function ecstasyHandler() {
        if(!ecstasy && gameObject.getHud().getStars() >= ECSTACYCOST) {
            partyPeople = getPeopleInParty();
            ecstasy = true;
            ecstasyCount = 0;
            gameObject.getHud().renderTextAlert("Ecstasy");
            gameObject.getHud().decrementStarsBy(ECSTACYCOST);
            gameObject.getDoor().ecstasyStart();
            BABYSPAWNRATEMODIFIER = 2;
        }
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
        people.addChild(goer);
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
        console.log("kickEveryoneOut");
        var total = people.getNumChildren();
        for (var i = 0; i < total; i++) {
            createjs.Tween.removeTweens(people.getChildAt(i).getShape());
            pos = getRandomEdgePos();
            createjs.Tween.get(people.getChildAt(i).getShape()).to(pos, wanderSpeed * getDistanceBtwObjectAndPos(people.getChildAt(i), pos), createjs.Ease.linear);
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
        
        for (var j =0; j < people.getNumChildren(); j++) {

            distance = getDistance(people.getChildAt(j), babyRepo);

            if (distance < babyRepoRadius + 1.5 * people.getChildAt(j).getRadius()) {
                stayAway(people.getChildAt(j));
            } else if (distance > 3/4 * doorRadius && distance < doorRadius) {
                if (people.getChildAt(j).checkWantToParty()) {
                    createjs.Tween.removeTweens(people.getChildAt(j).getShape());
                    pos = getRandomPosInParty();
                    createjs.Tween.get(people.getChildAt(j).getShape()).to(pos, danceSpeed * getDistanceBtwObjectAndPos(people.getChildAt(j), pos), createjs.Ease.linear);
                }
            } else if (distance < doorRadius + 30 && !people.getChildAt(j).checkWantToParty()) {
                stayAway(people.getChildAt(j));
            }
        }
    }

    function moveAll(everyone) {

        var babyRepo = gameObject.getBabyRepo();
        var babyRepoPosition = babyRepo.getPosition();
        var babyRepoRadius = babyRepo.getRadius();
        var doorRadius = gameObject.getDoor().getRadius();
        var pos;
        var i, upperbound;

        if (everyone) {
            i = 0;
            upperbound = people.getNumChildren();
        } else {
            if (Math.random() < 1/3) {
                i = 0;
                upperbound = Math.floor(people.getNumChildren() / 3);
            } else if (Math.random() < 0.5) {
                i = Math.floor(people.getNumChildren() / 3);
                upperbound = Math.floor(2/3 *people.getNumChildren());
            } else {
                i = Math.floor(2/3 * people.getNumChildren());
                upperbound = people.getNumChildren();
            }
        }

        numberOfPeopleInParty = 0;
        for (; i < upperbound; i++) {
            
            var distance = getDistance(people.getChildAt(i), babyRepo);
            var offset = 2/3 * Math.random() * (doorRadius - babyRepoRadius);

            if (distance < babyRepoRadius + people.getChildAt(i).getRadius() + offset) {
                createjs.Tween.removeTweens(people.getChildAt(i).getShape());
                numberOfPeopleInParty++;
                pos = getRandomPosInParty();
                createjs.Tween.get(people.getChildAt(i).getShape()).to(pos, danceSpeed * getDistanceBtwObjectAndPos(people.getChildAt(i), pos), createjs.Ease.linear);
            } else {
                
                if (Math.random() < doorRadius / distance) {
                    people.getChildAt(i).likeParty();
                    createjs.Tween.removeTweens(people.getChildAt(i).getShape());
                    pos = getRandomPosInParty();
                    createjs.Tween.get(people.getChildAt(i).getShape()).to(pos, danceSpeed * getDistanceBtwObjectAndPos(people.getChildAt(i), pos), createjs.Ease.linear);
                } else {
                    createjs.Tween.removeTweens(people.getChildAt(i).getShape());
                    pos = getRandomPosOutside();
                    createjs.Tween.get(people.getChildAt(i).getShape()).to(pos, wanderSpeed * getDistanceBtwObjectAndPos(people.getChildAt(i), pos), createjs.Ease.linear);
                }
            }
        }
    }

    function getPeopleInParty() {
        var peeps = [];
        for (var i =0; i < people.getNumChildren(); i++) {
            if (getDistance(people.getChildAt(i), gameObject.getBabyRepo()) < gameObject.getDoor().getRadius()) {
                peeps.push(people.getChildAt(i));
            }
        }
        return peeps;
    }

    //public funcs
    this.addPartyGoer = function() {
        drawPartyGoer();
    };

    var ecstasyCount = 0;
    this.tick = function() {

        if(ecstasyCount % 5 === 0) {
            collisionBehaviors();
        }

        if(ecstasy) {
            if(ecstasyCount % 15 === 0) {
                for (var i in partyPeople) {
                    var position = partyPeople[i].getPosition();
                    var juice = new JuicySplosion(position, 30, getRandomColorWithOpacity(0.6));
                }
            }
            if(ecstasyCount > 210) {
                ecstasy = false;
                BABYSPAWNRATEMODIFIER = 4;
                // gameObject.getDoor().ecstasyStart();
            }
        }
        ecstasyCount++;
    };

    this.wander = function() {
        moveAll(false);
    };

    this.getGoer = function() {
        return people;
    };

    this.size = function() {
        return people.getNumChildren();
    };

    this.partySize = function() {
        return getPartySize();
    };

    this.pause = function() {
        for (var i =0; i < people.getNumChildren(); i++) {
            createjs.Tween.removeTweens(people.getChildAt(i).getShape());
        }
    };

    this.resume = function() {
        moveAll(true);
    };
    
    this.reset = function() {
        this.clearPeople();
    };

    this.clearPeople = function() {
        for (var i =0; i < people.getNumChildren(); i++) {
            people.getChildAt(i).removeFromStage();
        }
        people.removeAllChildren();
    };

    this.getPeopleInParty = function() {
        return numberOfPeopleInParty;
    };
};
