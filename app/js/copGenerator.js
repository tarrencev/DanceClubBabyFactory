var CopGenObject = function() {
    //private vars
    //declare private vars here
    var cops = [];

    //private funcs
    function drawCop() {
        var cop = new CopObject();
        while (checkForCollisions(cop)) {
            cop.setPosition({x: getRandomEdgePos(cop).x, y: CONSTANTS.HEIGHT});
        }
        cops.push(cop);
    }

    function checkForCollisions(cop_) {
        for (var i in cops) {
            if(circlesDoCollide(cops[i], cop_)) {
                return true;
            }
        }
        return false;
    }

    function stopWhenHearSound() {
        for (var i in cops) {
            if (soundCollision(cops[i])) {
                cops[i].setInvade(true);
            }
        }
    }

    function soundCollision(cop_) {
      var projs = gameObject.getProjectiles().getProjectiles();
      var num_stars = projs.getNumChildren();
      for(var i = 0;
          i < num_stars;
          i++) {
        if (circlesDoCollide(projs.getChildAt(i), cop_)) {
          return true;
        }
      }
      return false;
    }

    function removeThing(thing) {
        stage.removeChild(thing.getShape());
    }

    function exeuntCop(cop) {
        var babyRepo = gameObject.getBabyRepo();
        var babyRepoPos = babyRepo.getPosition();
        var copPos = cop.getPosition();

        // is the nearest exit up?
        var up = babyRepoPos.y - copPos.y > 0;

        var goal_x = copPos.x;
        var goal_y = up ? -20 : CONSTANTS.HEIGHT + 20;

        createjs.Tween.removeTweens(cop.getShape());
        createjs.Tween.get(cop.getShape()).to({x: goal_x,
                                               y: goal_y},
                                              5000, createjs.Ease.linear)
                                          .call(function() { removeThing(cop); });
    }

    function exeuntCops() {
        // in place array modificaiton
        // so we need to iterate in reverse
        while(cops.length > 0) {
            exeuntCop(cops.pop());
        }
        cops = [];
    }

    function evictPerson(person) {
        var goerGen = gameObject.getPartyGoerGen();

        createjs.Tween.removeTweens(person.getShape());
        createjs.Tween.get(person.getShape()).to(getRandomEdgePos(),
                                                 3000, createjs.Ease.linear)
                                             .call(function() { removeThing(person); });
    }

    this.evictPeople = function() {
        // in place array modificaiton
        // so we need to iterate in reverse
        var gen = gameObject.getPartyGoerGen();
        var peeps = gen.getPeopleInParty();

        while(peeps.length > 0) {
            evictPerson(peeps.pop());
        }

        gen.clearPeople();
    };

    //public funcs
    this.addCop = function() {
        drawCop();
    };

    this.tick = function() {
        for(var i in cops) {
            cops[i].tick();

            if (cops[i].isDead()) {
                exeuntCops();
                return;
            }
        }
        stopWhenHearSound();
    };

    this.getCops = function() {
        return cops;
    };

    this.size = function() {
        return cops.length;
    };
};

