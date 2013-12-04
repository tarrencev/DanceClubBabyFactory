function getDistance(obj1, obj2) {
    var xDist = obj1.getPosition().x - obj2.getPosition().x;
    var yDist = obj1.getPosition().y - obj2.getPosition().y;

    return Math.sqrt(xDist * xDist + yDist * yDist);
}

function getRandomSign() {
    if (Math.random() > 0.5) {
        return 1;
    }
    return -1;
}

function getRandomEdgePos() {
    if (Math.random() > 0.5) {
        if (Math.random() > 0.5) {
            return {
                x: Math.random() * window.innerWidth,
                y: -15
            };
        }
        return {
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 15
        };
    }
    if (Math.random() > 0.5) {
        return {
            x: -15,
            y: Math.random() * window.innerHeight
        };
    }
    return {
        x: window.innerWidth + 15,
        y: Math.random() * window.innerHeight
    };
}
