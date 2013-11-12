var DoorObject = function(){
    //private vars
    var door, doorGuide;
    var doorPosition = 0;
    var radius = 200;

    //private funcs
    function init() {
        drawDoorGuide();
        drawDoor();
    }

    function drawDoor() {
        door = new createjs.Shape();
        door.graphics.beginStroke('#6d6e71')
                    .setStrokeStyle(16)
                    .arc(CONSTANTS.WIDTH/2, CONSTANTS.HEIGHT/2, 250, 0 + doorPosition, Math.PI/5 + doorPosition);
        stage.addChild(door);
    }

    function drawDoorGuide() {
        doorGuide = new createjs.Shape();
        var start, end;
        for (var i = 0; i < 8; i++) {

            start = i * 0.8;
            end = i * 0.8 + Math.PI/10;

            doorGuide.graphics.beginStroke('#f7941e')
                    .setStrokeStyle(6)
                    .arc(CONSTANTS.WIDTH/2, CONSTANTS.HEIGHT/2, 250, start, end);

        }
        stage.addChild(doorGuide);
    }

    //public funcs
    this.moveDoor = function(event) {
        doorPosition.y = event.stageY;
    };

    init();
};