function init() {
    canvas = document.createElement('canvas');

    canvas.width = window.innerWidth - 300;
    canvas.height = window.innerHeight;
    CONSTANTS.SCREENWITH = window.innerWidth - 300;
    CONSTANTS.SCREENHEIGHT = window.innerHeight;

    canvas.setAttribute('id', 'c');

    document.body.appendChild(canvas);
    stage = new createjs.Stage(canvas);
    stage.mouseEventsEnabled = true;

    if(!createjs.Ticker.hasEventListener('tick')) {
        createjs.Ticker.addEventListener('tick', tick);
    }
    createjs.Ticker.setFPS(30);

    var doorObject = new DoorObject();
}

document.body.onload = init();

function tick() {
    console.log('tick');
    stage.update();
}