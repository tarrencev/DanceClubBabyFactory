function getRandomEdgePos() {
    if (Math.random() > 0.5) {
        if (Math.random() > 0.5) {
            return {
                x: Math.random() * window.innerWidth * 0.8,
                y: -15
            };
        }
        return {
            x: Math.random() * window.innerWidth * 0.8,
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
        x: window.innerWidth * 0.8 + 15,
        y: Math.random() * window.innerHeight
    };
}
