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
var ECSTACYCOST = 50;

var colors = [	"rgba(204, 51, 255, 0.15)", "rgba(0, 153, 255, 0.15)", 
				"rgba(255, 255, 51, 0.15)", "rgba(0, 255, 102, 0.15)",
				"rgba(204, 0, 153, 0.15)", "rgba(0, 51, 153, 0.15)"	];

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
	}
});
