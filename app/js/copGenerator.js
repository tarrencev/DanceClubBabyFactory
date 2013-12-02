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

    function removeCop(i) {
        stage.removeChild(cops[i]).getShape();
        cops.splice(i, 1);
    }

    function removeAll() {
        for(var i in cops) {
            removeCop(i);
        }
    }

    //public funcs
    this.addCop = function() {
        drawCop();
    };

    this.tick = function() {
        for(var i in cops) {
            cops[i].tick();

            if (cops[i].isDead()) {
                // removeCop(i);
                removeAllCops();
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

