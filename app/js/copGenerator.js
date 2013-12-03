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

    function removeCop(cop) {
        stage.removeChild(cop.getShape());
    }

    function exeuntCop(cop) {
        var babyRepo = gameObject.getBabyRepo();
        var babyRepoPos = babyRepo.getPosition();
        var copPos = cop.getPosition();

        // how far away we are from the center
        var d_x = babyRepoPos.x - copPos.x;
        var d_y = babyRepoPos.y - copPos.y;

        // is the nearest exit up?
        var up = d_y > 0;

        var goal_x = copPos.x;
        var goal_y = up ? -20 : CONSTANTS.HEIGHT + 20;

        createjs.Tween.removeTweens(cop.getShape());
        createjs.Tween.get(cop.getShape()).to({x: goal_x,
                                               y: goal_y},
                                              5000, createjs.Ease.linear)
                                          .call(function() { removeCop(cop); });
    }

    function exeuntCops() {
        // in place array modificaiton
        // so we need to iterate in reverse
        while(cops.length > 0) {
            exeuntCop(cops.pop());
        }
        cops = [];
    }

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

