var GameObject = function() {
    //private vars
    var background, doorObject;

    //private funcs
    function init() {
        canvas = document.createElement('canvas');

        canvas.width = window.innerWidth - 300;
        canvas.height = window.innerHeight;
        CONSTANTS.WIDTH = window.innerWidth - 300;
        CONSTANTS.HEIGHT = window.innerHeight;

        canvas.setAttribute('id', 'c');

        document.body.appendChild(canvas);
        stage = new createjs.Stage(canvas);
        stage.mouseEventsEnabled = true;

        if(!createjs.Ticker.hasEventListener('tick')) {
            createjs.Ticker.addEventListener('tick', tick);
        }
        createjs.Ticker.setFPS(30);

        //init background
        background = new BackgroundObject();

        //init door
        doorObject = new DoorObject();
        stage.addEventListener("pressmove", mousePressMove);
    }

    //same as perform_logic() in zenilib
    function tick() {
        stage.update();
    }

    function mousePressMove(event) {
        doorObject.moveDoor(event);
    }

    //public funcs
    this.init = function() {
        init();
    };
};

var gameObject = new GameObject();
document.body.onload = gameObject.init();