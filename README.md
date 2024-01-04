# Welcome to SnakeEatsBoids

[PLAY ONLINE HERE](https://designzesty.com)

This web application is my implementation of the Snake Game but with AI driven food.

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

#### Algorithms - In Process

##### Affection Criteria

1. Get the direction angle that the boid0 is facing.
2. Get the direction angle from boid0 to otherboid.
3. Compare the 2 angles to see if otherboid is in front or to the sides of boid0. (use 3PI/4 for angle of affect).
4. Get distance between boid0 and otherboid and check distance
5. If boid is in sight and in range add it to list of affection.
6. Return correction angle to be used to get vector velocity changes later. 

### Avoid - Completed

Avoid takes in boid direction and gets boid to other object direction and calcualtes a 'swerve value' to swerve away from the object to avoid.

Avoid method for snake boid interaction is reused for boid boid interactrion. several coeeficients are changed such as distance to target, and angle of sight to target.

Boid changes direction in order to be closer to other boids that are near by.

### Align

Align calculation is fundamentally different than the avoid calucaltion because it takes into account an average of all boids 'in sight' of the affected boid. The average can be done many different ways but we'll 
focus on 2 ways, namely; save all affected boids to a list then use them in the calculation or calculate average in place. The implementation we'll use for this project is to add the objects to a list and use the list as this is truer to object oriented programming, easier to cospetualize, and to implement. 

### Cohesion

Cohesion may be similar enough to Avoid to resuse the Avoid function to accomplish this behavior.

### Seperation:

Craig Reynolds calls this Speration however in this implementation we will be calling this Avoid specifically.


## Future additions to Snake Eats Boids.

Lets add some powerups! Power ups will include but not be limited to, powerups will be initiated with a banner message accross screen declaring mode on, and then a countdown message in the UI window designating how much time is left on the powerup. 

**Gigantuan** - increase length and width of snake, (implemention notes: change affects snake object's this.radius, and this.snakeSegements)

Completed: 1/4/2023

**Turboid Speed** - increase snake speed, (implementation notes: change affects snake objects, this.speed attribute)

In Process: 1/4/2023

**Time Dialation** - decrease boids in play speed, (implementation notes: loop over boids list and reduce speed value)

**Battle Ship** - add lasers that project from snake head and shoot at boids and when they hit boids the boids get fragged! (implemention notes: requires a lot of code)




## Personal Blog Posts for this Project

12/27/2023 - I watched a very cool youtube video on evolution simuation, [Bibites Link Here](https://www.youtube.com/watch?v=xBQ3knSi0Uo&t=1331s)
This has me thinking I could add some functionality to include powerups. 

1/4/2024 - I've been taking Coursera classes lately, and haven't been writing much code for the boids. However I did see an video on Particle Life. It's some really cool and interesting programming. I don't know if I'll be able to add it into SnakeBoidAI though. [Particle Life Video](https://www.youtube.com/watch?v=p4YirERTVF0)



