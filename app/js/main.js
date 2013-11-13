var GameObject = function Main() {
    //private vars
    var background, door, babyRepo;

    //private funcs
    function init() {
        canvas = document.createElement('canvas');

        canvas.width = window.innerWidth * 0.7;
        canvas.height = window.innerHeight;
        CONSTANTS.WIDTH = window.innerWidth * 0.7;
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

        //init baby repo
        babyRepo = new BabyRepoObject();

        //init door
        door = new DoorObject();

        stage.addEventListener("pressmove", mousePressMoveHandler);
        stage.addEventListener("click", mouseClickHandler);
    }

    //same as perform_logic() in zenilib
    function tick() {
        stage.update();
    }

    function mousePressMoveHandler(event) {
        console.log('press move');
        door.moveDoor(event);
    }

    function mouseClickHandler(event) {
        console.log('click');
        babyRepo.addBaby();
    }

    //public funcs
    this.init = function() {
        init();
    };

    this.getBabyRepo = function() {
        return babyRepo;
    };
};

var gameObject = new GameObject();
document.body.onload = gameObject.init();