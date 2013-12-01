var PartyGoerGenObject = function() {
    //private vars
    //declare private vars here
    var cops = [];

    //private funcs
    function drawCop() {
        var cop = new CopObject();
        while (checkForCollisions(cop)) {
            goer.setPosition(getRandomEdgePos(cop));
        }
        cops.push(cop);
    }

    function checkForCollisions(cop_) {
        for (var i in cops) {
            if(circlesDoCollide(cops[i], cop_))
                return true;
        }
        return false;
    }

    function moveAll() {
      for (var i in cops) {
        cops.tick();
      }
    }

    //public funcs
    this.addCop = function() {
        drawCop();
    };

    this.tick = function() {
        moveAll();
    };

    this.getCops = function() {
        return cops;
    };

    this.size = function() {
        return cops.length;
    };
};

