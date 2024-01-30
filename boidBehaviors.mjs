cohesion(sightedBoids, boid, swerveValue, sightAngle) {
  if (sightedBoids.length < 1) {
    return;
  }
  let sumPosX = 0;
  let sumPosY = 0;
  sightedBoids.forEach((otherBoid) => {
    sumPosX += otherBoid.position.x;
    sumPosY += otherBoid.position.y;
  });
  let averagePositionX = sumPosX / sightedBoids.length;
  let averagePositionY = sumPosY / sightedBoids.length;
  const vec1 = boid.position.clone();
  const vec2 = new Victor(averagePositionX, averagePositionY);
  let angleTowardBoids = vec2.subtract(vec1).direction();
  angleTowardBoids =
    angleTowardBoids < 0
      ? Math.PI - angleTowardBoids
      : Math.abs(Math.PI - angleTowardBoids) % (Math.PI * 2);
  let difference = 0;
  let swerveTowardBoids = 0;
  if (boid.angleSelf <= angleTowardBoids) {
    let diff1 = angleTowardBoids - boid.angleSelf;
    let diff2 = boid.angleSelf + 6.28 - angleTowardBoids;
    swerveTowardBoids = diff1 < diff2 ? -1 * swerveValue : 1 * swerveValue;
    difference = diff1 < diff2 ? diff1 : diff2;
  } else {
    let diff1 = boid.angleSelf - angleTowardBoids;
    let diff2 = angleTowardBoids + 6.28 - boid.angleSelf;
    swerveTowardBoids = diff1 < diff2 ? 1 * swerveValue : -1 * swerveValue;
    difference = diff1 < diff2 ? diff1 : diff2;
  }
  boid.swerveTowardBoids =
    difference < sightAngle
      ? boid.swerveTowardBoids + swerveTowardBoids
      : null;
  boid.angleSelf += boid.swerveTowardBoids;
  boid.velocity.x = Math.cos(boid.angleSelf) * boid.speed;
  boid.velocity.y = -Math.sin(boid.angleSelf) * boid.speed;
}

align(sightedBoids, boid, boidSwerveValue) {
  if (sightedBoids.length < 1) {
    return;
  }
  let sumX = 0;
  let sumY = 0;
  sightedBoids.forEach((boid) => {
    sumX += boid.velocity.x;
    sumY += boid.velocity.y;
  });
  let averageX = sumX / sightedBoids.length;
  let averageY = sumY / sightedBoids.length;
  boid.velocity.x += averageX * boidSwerveValue;
  boid.velocity.y += averageY * boidSwerveValue;
}

avoid(otherBody, boid, proximal, swerveValue, sightAngle) {
  let distance = Math.sqrt(
    Math.abs(otherBody.x - boid.boidSegments[0].x) ** 2 +
      Math.abs(otherBody.y - boid.boidSegments[0].y) ** 2
  );
  if (distance > proximal || distance === NaN) {
    boid.swerveSnakePiece = null;
    return;
  }
  const vec1 = boid.position.clone();
  const vec2 = otherBody.clone();
  let angleTowardSnake = vec1.subtract(vec2).direction();
  angleTowardSnake =
    angleTowardSnake < 0
      ? Math.PI - angleTowardSnake
      : Math.abs(Math.PI - angleTowardSnake) % (Math.PI * 2);
  let difference = 0;
  let swerveSnakePiece = 0;
  if (boid.angleSelf <= angleTowardSnake) {
    let diff1 = angleTowardSnake - boid.angleSelf;
    let diff2 = boid.angleSelf + 6.28 - angleTowardSnake;
    swerveSnakePiece = diff1 < diff2 ? -1 * swerveValue : 1 * swerveValue;
    difference = diff1 < diff2 ? diff1 : diff2;
  } else {
    let diff1 = boid.angleSelf - angleTowardSnake;
    let diff2 = angleTowardSnake + 6.28 - boid.angleSelf;
    swerveSnakePiece = diff1 < diff2 ? 1 * swerveValue : -1 * swerveValue;
    difference = diff1 < diff2 ? diff1 : diff2;
  }
  boid.swerveSnakePiece =
    difference < sightAngle
      ? boid.swerveSnakePiece + swerveSnakePiece
      : null;
  boid.angleSelf += boid.swerveSnakePiece;
  boid.velocity.x = Math.cos(boid.angleSelf) * boid.speed;
  boid.velocity.y = -Math.sin(boid.angleSelf) * boid.speed;
}