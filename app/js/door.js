var DoorObject = function(){
    //private vars
    var door = new createjs.Shape();
    var doorGuide;
    var doorPosition = 0;
    var radius = 250;
    var doorThickness = 16;
    var doorWidth = Math.PI/6; // in radians
    var defaultDoorColor = '#00CCFF';
    var extenzeDoorColor = '#6e2bff';
    var stars = 2000;
    var extenzeActive = false;
    var extenzeAnimationInterval;
    
    document.addEventListener("onEcstasyStart", ecstasyStartHandler);
    document.addEventListener("onEcstasyEnd", ecstasyEndHandler);
    var ecstasyTimer;

    //private funcs
    function init() {
        drawDoorGuide();
        drawDoor();
        document.addEventListener("blocked", function(){stars++;}, false);
        document.addEventListener("twoKey", extenzeDoor, false);
    }

    function drawDoor() {
        door.x = CONSTANTS.WIDTH/2;
        door.y = CONSTANTS.HEIGHT/2;
        door.graphics.beginStroke(defaultDoorColor)
                     .setStrokeStyle(doorThickness)
                     .arc(0, 0, radius, -doorWidth/2, doorWidth/2)
                     .endStroke();
        door.cache(-(radius+doorThickness), -(radius+doorThickness), (radius+doorThickness)*2, (radius+doorThickness)*2);
        stage.addChild(door);
    }

    function drawDoorGuide() {
        doorGuide = new createjs.Shape();
        var start, end;
        for (var i = 0; i < 8; i++) {

            start = i * 0.8;
            end = i * 0.8 + Math.PI/10;

            doorGuide.graphics.beginStroke('#ffffff')
                .setStrokeStyle(3)
                .arc(CONSTANTS.WIDTH/2, CONSTANTS.HEIGHT/2, 250, start, end);
        }
        doorGuide.cache(CONSTANTS.WIDTH/2 - 260, CONSTANTS.HEIGHT/2 - 260, 520, 520);

        stage.addChild(doorGuide);
    }

    function extenzeDoor() {
        if(stars >= EXTENZECOST && !extenzeActive) {
            extenzeActive = true;
            JuicySplosion(door, doorWidth, defaultDoorColor);
            var originalWidth = doorWidth;
            var goalWidth = doorWidth * 3/2;
            extenzeAnimationInterval = setInterval(function() {
                door.graphics.clear();
                doorWidth = doorWidth*0.8 + goalWidth*0.2;
                if (goalWidth-0.01 < doorWidth) {
                    doorWidth = goalWidth;
                    clearInterval(extenzeAnimationInterval);
                }
                door.graphics.beginStroke(extenzeDoorColor)
                             .setStrokeStyle(doorThickness)
                             .arc(0, 0, radius, -doorWidth/2, doorWidth/2)
                             .endStroke();
                door.updateCache();
            }, 10);
            setTimeout(function() {
              var originalWidth = doorWidth;
              var goalWidth = doorWidth / 3*2;
              extenzeAnimationInterval = setInterval(function() {
                  door.graphics.clear();
                  doorWidth = doorWidth*0.8 + goalWidth*0.2;
                  if (goalWidth+0.01 > doorWidth) {
                      doorWidth = goalWidth;
                      clearInterval(extenzeAnimationInterval);
                  }
                  door.graphics.beginStroke(defaultDoorColor)
                               .setStrokeStyle(doorThickness)
                               .arc(0, 0, radius, -doorWidth/2, doorWidth/2)
                               .endStroke();
                  door.updateCache();
                }, 10);
                extenzeActive = false;
            } , 5000);
        }
        
    }
    
    function ecstasyStartHandler() {
        var color = getRandomColorObject();
        door.filters = [
            new createjs.ColorFilter(0,0,0,1, color[0],color[1],color[2],0)
        ];
        door.updateCache();
        ecstasyTimer = setTimeout(ecstasyStartHandler, 100);
    }
    
    function ecstasyEndHandler() {
        door.filters = [];
        door.updateCache();
        clearTimeout(ecstasyTimer);
    }

    //public funcs
    this.moveDoor = function(event) {
        //console.log(event.stageY);

        var deltaY = event.clientY - CONSTANTS.HEIGHT/2;
        var deltaX = event.clientX - CONSTANTS.WIDTH/2;
        var angle = Math.atan2(deltaY,deltaX) * 180/Math.PI;
        door.rotation = angle;
        
        this.doorHitArc = {
            min: this.getAngle() - this.getWidth()*180/Math.PI/2,
            max: this.getAngle() + this.getWidth()*180/Math.PI/2
        };
        if (this.doorHitArc.min < -180) {
            this.doorHitArc.min = 360+this.doorHitArc.min;
        }
        if (this.doorHitArc.max > 180) {
            this.doorHitArc.max = this.doorHitArc.max-360;
        }
    };
    
    this.getAngle = function() {
        return door.rotation;
    };
    
    this.getRadius = function() {
        return radius;
    };
    
    this.getWidth = function() {
        return doorWidth;
    };
    
    this.getThickness = function() {
        return doorThickness;
    };
    
    // x and y are positions relative to the center of the screen
    this.detectCollision = function(x, y) {
        var distanceFromCenter = Math.sqrt(Math.pow(x, 2)+
                                           Math.pow(y, 2));
        
        if (distanceFromCenter > this.getRadius()-this.getThickness()/2 &&
            distanceFromCenter < this.getRadius()+this.getThickness()/2) {
            var objAngle = Math.atan2(y,x)*180/Math.PI;
            if (this.doorHitArc.min > this.doorHitArc.max) {
                if (objAngle > this.doorHitArc.min || objAngle < this.doorHitArc.max) {
                    return true;
                }
            } else if (objAngle > this.doorHitArc.min && objAngle < this.doorHitArc.max) {
                return true;
            }
        }
        return false;
    };

    init();
};
