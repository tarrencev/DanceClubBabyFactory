var DoorObject = function(){
    //private vars
    var door, doorGuide;
    var doorPosition = 0;

    //private funcs
    function init() {
        drawDoorGuide();
        drawDoor();
    }

    function drawDoor() {
        door = new createjs.Shape();
        door.x = CONSTANTS.WIDTH/2;
        door.y = CONSTANTS.HEIGHT/2;
        door.graphics.beginStroke('#6d6e71')
                    .setStrokeStyle(16)
                    .arc(0, 0, 250, 0 + doorPosition, Math.PI/5 + doorPosition)
                    .endStroke();
        // door.graphics
        //     .beginStroke('#fff')
        //     .setStrokeStyle(1)
        //     .arc(CONSTANTS.WIDTH/2, CONSTANTS.HEIGHT/2, 250, Math.PI/5 + doorPosition, 0 + doorPosition);
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
        doorGuide.cache(CONSTANTS.WIDTH/2 - 260, CONSTANTS.HEIGHT/2 - 260, 520, 520);

        stage.addChild(doorGuide);
    }

    //public funcs
    this.moveDoor = function(event) {
        console.log(event.stageY);

        var deltaY = event.stageY - CONSTANTS.HEIGHT/2;
        var deltaX = event.stageX - CONSTANTS.WIDTH/2;
        var angle = Math.atan(deltaY/deltaX) * 180/Math.PI;
        console.log(angle);
        door.rotation = angle;
    };

    init();
};