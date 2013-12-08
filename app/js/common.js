var CONSTANTS = {
  WIDTH: 640,
  HEIGHT: 960
};

var STAGECENTER = {
    x: function() { return CONSTANTS.WIDTH/2; },
    y: function() { return CONSTANTS.HEIGHT/2; }
};

var HI = 1, LO = -1;

var canvas, stage, preloaded_songs;
var volumeModifier = 50;
var speedModifier = 1;

var SLOWDOWNCOST = 25;
var EXTENZECOST = 25;
var ECSTACYCOST = 25;
var MUSHROOMSCOST = 25;
var COCAINECOST = 50;

var colors = [ [204, 51, 255], [0, 153, 255], [255, 255, 51], [0, 255, 51], [255, 0, 239], [255, 0, 0] ];

function getRandomColorWithOpacity(opacity) {
    var index = Math.floor(Math.random() * colors.length);
    return "rgba(" + colors[index][0] + ", " + 
                     colors[index][1] + ", " + 
                     colors[index][2] + ", " + 
                     opacity.toString() + ")";
}

function getRandomColorObject() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomSign() {
    if(Math.random() > 0.5)
        return -1;
    return 1;
}

var upKey = document.createEvent('Event');
upKey.initEvent('upKey', true, true);
var downKey = document.createEvent('Event');
downKey.initEvent('downKey', true, true);
var spaceKey = document.createEvent('Event');
spaceKey.initEvent('spaceKey', true, true);
var oneKey = document.createEvent('Event');
oneKey.initEvent('oneKey', true, true);
var twoKey = document.createEvent('Event');
twoKey.initEvent('twoKey', true, true);
var threeKey = document.createEvent('Event');
threeKey.initEvent('threeKey', true, true);
var fourKey = document.createEvent('Event');
fourKey.initEvent('fourKey', true, true);
var fiveKey = document.createEvent('Event');
fiveKey.initEvent('fiveKey', true, true);

$(document).keydown(function(e) {
	if (e.keyCode === 38 || e.keyCode === 87) {
		document.dispatchEvent(upKey);
	} else if (e.keyCode === 40 || e.keyCode === 81) {
		document.dispatchEvent(downKey);
	} else if (e.keyCode === 32) {
		e.preventDefault(); // Prevents activating button twice
		document.dispatchEvent(spaceKey);
	} else if (e.keyCode === 49) {
		document.dispatchEvent(oneKey);
	} else if (e.keyCode === 50) {
		document.dispatchEvent(twoKey);
	} else if (e.keyCode === 51) {
		document.dispatchEvent(threeKey);
	} else if (e.keyCode === 52) {
		document.dispatchEvent(fourKey);
	} else if (e.keyCode === 53) {
		document.dispatchEvent(fiveKey);
	}
});
