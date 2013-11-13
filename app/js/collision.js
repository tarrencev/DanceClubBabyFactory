function circlesDoCollide(circle1, circle2) {
    var xDist = circle1.getPosition().x - circle2.getPosition().x;
    var yDist = circle1.getPosition().y - circle2.getPosition().y;

    // Distance between the center of the circles.
    var distance = Math.sqrt(xDist * xDist + yDist * yDist);

    // Check if the circles are within distance, based on the 2 radiuses
    return (distance < circle1.getRadius() + circle2.getRadius());
}