# Welcome to SnakeEatsBoids

This web application is my own implementation of the Snake Game but with AI driven food.

The Food in this implementation will be given Boid AI Characteristics based on Craig Reynolds research, you can view his paper here.

[Boids Paper 1987 - Craig Reynolds](https://team.inria.fr/imagine/files/2014/10/flocks-hers-and-schools.pdf)

As always this is a Travis Lamberte Original Implementation. I'm pulling out all the stops on this one. Hopefully I'll be able to give them little AI's some a fighting chance against the Snake!!!

### AI Movement is affected by:

1. Boid is 'In Sight' in front or to the sides.

2. Boid is 'In Range' within a certain distance.

3. Boid is !self is not itself. 

Put Boids that affect the boids incremental alignment movement in a list and average the direction and position. These can be used for alignment, cohesion, and seperation (change seperation to avoid). 

AI Characteristics include:


### Alignment:

Boid changes direction over time to match average direction of nearby boids.

We'll call the boid being affected 'boid0'

Each other Boid in play will be dtermined if it will affect boid0 and be added to "Affection" list if it satisfies the criteria.

#### Algorithms

##### Affection Criteria

1. Get the direction angle that the boid0 is facing.
2. Get the direction angle from boid0 to otherboid.
3. Compare the 2 angles to see if otherboid is in front or to the sides of boid0. (use 3PI/4 for angle of affect).
4. Get distance between boid0 and otherboid and check distance
5. If boid is in sight and in range add it to list of affection.
6. Return correction angle to be used to get vector velocity changes later. 

### Avoid


### Align

avoid method for snake boid interaction is reused for boid boid interactrion. several coeeficients are changed such as distance to target, and angle of sight to target.

Boid changes direction in order to be closer to other boids that are near by.

### Seperation:

Boid changes direction if it is too close to another boid.

## Personal Blog Posts for this Project
