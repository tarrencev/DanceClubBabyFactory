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
        var d_x = babyRepoPos.x - copPos.x + 20;
        var d_y = babyRepoPos.y - copPos.y + 20;

        var m = d_y / d_x;

        // how many times we'd have to repeat that distance to be free
        var x = (copPos.x / d_x) + 1;
        var y = (copPos.y / d_y) + 1;

        var opposite_x = copPos.x * m;
        var opposite_y = copPos.y * m;

        createjs.Tween.removeTweens(cop.getShape());
        createjs.Tween.get(cop.getShape()).to({x: opposite_x,
                                               y: opposite_y},
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

