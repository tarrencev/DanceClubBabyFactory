var DoorObject = function(){
    //private vars
    var door = new createjs.Shape();
    var doorGuide;
    var doorPosition = 0;
    var radius = 250;
    var doorThickness = 16;
    var doorWidth = Math.PI/6; // in radians
    var originalWidth;
    var goalWidth;
    var defaultDoorColor = '#00CCFF';
    var extenzeDoorColor = '#6e2bff';
    var extenzeActive = false;
    var extending = false;
    var extenzeCount = 0;
    
    var ecstasyTimer;

    //private funcs
    function init() {
        drawDoorGuide();
        drawDoor();
        document.addEventListener("twoKey", extenzeDoor, false);
    }

    function drawDoor() {
        door.x = CONSTANTS.WIDTH/2;
        door.y = CONSTANTS.HEIGHT/2;
        door.graphics.beginStroke(defaultDoorColor)
                     .setStrokeStyle(doorThickness)
                     .arc(0, 0, radius, -doorWidth/2, doorWidth/2)
                     .endStroke();
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

        stage.addChild(doorGuide);
    }

    function extenzeDoor() {
        if(gameObject.getHud().getStars() >= EXTENZECOST && !extenzeActive) {
            extenzeActive = true;
            originalWidth = doorWidth;
            goalWidth = doorWidth * 3/2;
            extending = true;
            gameObject.getHud().renderTextAlert("Extenze");
            gameObject.getHud().decrementStarsBy(EXTENZECOST);
        }   
    }

    //public funcs
    this.moveDoor = function(event) {
        var deltaY;
        var deltaX;

        if(!mobile) {
            deltaY = event.clientY - CONSTANTS.HEIGHT/2;
            deltaX = event.clientX - CONSTANTS.WIDTH/2;
        } else {
            deltaY = event.dy;
            deltaX = event.dx;
        }

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

    this.ecstasyStart = function() {
        var color;
        var ecstasyInterval = setInterval(function(){
            color = getRandomColorObject();
            door.filters = [
                new createjs.ColorFilter(0,0,0,1, color[0],color[1],color[2],0)
            ];
        }, 100);
    };
    
    this.ecstasyEnd = function() {
        door.filters = [];
        clearTimeout(ecstasyInterval);
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
    
    this.reset = function() {
        if (extenzeActive) {
            extenzeCount = 0;
            extenzeActive = false;
            extending = true;
            goalWidth = originalWidth;
        }
    };
    
    this.tick = function() {
        if (extending) {
            door.graphics.clear();
            doorWidth = doorWidth*0.8 + goalWidth*0.2;
            if (Math.abs(goalWidth-doorWidth) < 0.01) {
                doorWidth = goalWidth;
                extending = false;
                if (!extenzeActive) extenzeCount = 0;
            }
            var doorColor;
            if (extenzeActive) doorColor = extenzeDoorColor;
            else doorColor = defaultDoorColor;
            door.graphics.beginStroke(doorColor)
                         .setStrokeStyle(doorThickness)
                         .arc(0, 0, radius, -doorWidth/2, doorWidth/2)
                         .endStroke();
        }
        if (extenzeActive) {
            extenzeCount++;
        }
        if (extenzeCount > 300) {
            extenzeActive = false;
            extending = true;
            goalWidth = originalWidth;
        }
    };

    init();
};
