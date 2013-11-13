var CONSTANTS = {
  WIDTH: 640,
  HEIGHT: 960
};

var canvas, stage;

function getRandomSign() {
    if(Math.random() > 0.5)
        return -1;
    return 1;
}