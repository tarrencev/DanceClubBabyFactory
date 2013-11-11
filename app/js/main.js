function init() {
    canvas = document.createElement('canvas');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    CONSTANTS.SCREENWITH = window.innerWidth;
    CONSTANTS.SCREENHEIGHT = window.innerHeight;

    canvas.setAttribute('id', 'c');

    document.body.appendChild(canvas);
    stage = new Stage(canvas);
    stage.mouseEventsEnabled = true;

    if(!createjs.Ticker.hasEventListener('tick')) {
        createjs.Ticker.addEventListener('tick', tick);
    }
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addListener(stage);
}

document.body.onload = init();

function tick() {
    console.log('tick');
}