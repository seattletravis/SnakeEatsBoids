window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    

    
    class InputHandler {
        constructor(game){
            this.game = game
            window.addEventListener('keydown', e => {
                if ((   (e.key === 'ArrowUp') || 
                        (e.key === 'ArrowDown') ||
                        (e.key === 'ArrowLeft') ||
                        (e.key === 'ArrowRight') ||
                        (e.key === ' ')
                ) && this.game.keys.indexOf(e.key) === -1){
                    this.game.keys.push(e.key)
                }
            })
            window.addEventListener('keyup', e =>{
                if (this.game.keys.indexOf(e.key) > -1){
                    this.game.keys.splice(this.game.keys.indexOf(e.key), 1)
                }
            })
        }
    }

    class Snake {
        constructor(game){
            this.game = game
            this.radius = 4 
            this.position = new Victor(20, 100)
            this.speedY = 0
            this.speedX = 0
            this.snakeSpeed = 2
            this.snakePieces = 1
            this.snakeSegments = []
        }
        
        update(){
            if (this.game.keys.includes('ArrowUp') && this.speedY === 0) {this.speedY = -this.snakeSpeed; this.speedX = 0}
            else if (this.game.keys.includes('ArrowDown') && this.speedY === 0) {this.speedY = this.snakeSpeed; this.speedX = 0}
            else if (this.game.keys.includes('ArrowLeft') && this.speedX === 0) {this.speedX = -this.snakeSpeed; this.speedY = 0}
            else if (this.game.keys.includes('ArrowRight') && this.speedX === 0) {this.speedX = this.snakeSpeed; this.speedY = 0} 
            else if (this.game.keys.includes(' ')) {this.speedX = 0; this.speedY = 0}
            this.position.y += this.speedY
            this.position.x += this.speedX
            this.snakeSegments.unshift({x: this.position.x, y: this.position.y})
            if (this.snakeSegments.length > this.snakePieces) {
                this.snakeSegments.pop()
            }
        }

        draw(context){
            let radius = this.radius
            for(let i = this.snakeSegments.length - 1; i >= 0; i--){
                if (Math.floor(i / 8) % 2 === 0){
                    context.fillStyle = 'red'
                } else {
                    context.fillStyle = 'green'
                }
                context.beginPath()
                context.arc(this.snakeSegments[i].x, this.snakeSegments[i].y, radius, 0, 2*Math.PI, false)
                context.fill()
            }
        }
    }

    class Star {
        constructor(game){
            this.game = game
            this.width = Math.random() * 2
            this.height = this.width
            this.x = this.game.width
            this.y = Math.random() * (this.game.height * 1 - this.height)
            this.speedX = Math.random() * -1 - 0.25
            this.markedForDeletion = false
        }
        update(){
            this.x += this.speedX
            if(this.x + this.width < 0) this.markedForDeletion = true
        }
        draw(context){
            context.fillStyle = 'white'
            context.fillRect(this.x, this.y, this.width, this.height)
        }
    }


    class Boid {
        constructor(game){
            this.game = game
            this.proximal = 50
            this.boids = this.game.boids
            this.position = new Victor(Math.random() * (canvas.width - 30) + 15,Math.random() * (canvas.height - 30) + 15)
            this.radius = 10
            this.speed = this.game.speed
            this.red = this.game.red
            this.green = this.game.green
            this.blue = this.game.blue
            var initialDirection = Math.random() * Math.PI * 2
            this.velocity = new Victor(this.speed * Math.cos(initialDirection),this.speed * Math.sin(initialDirection))
            this.angleSelf = this.getAngleSelf()
            this.swerveValue = 0.1
            this.swerveSnakePiece = null
            this.boidPieces = 5
            this.boidSegments = []
        }
        
        getAngleSelf(){
            let angle = this.velocity.clone().invertY().direction()
            if (angle < 0) {
                angle = (Math.PI + (Math.PI - Math.abs(angle))) % (2 * Math.PI)
            }
            return angle
        }

        update(){
            //Boundary Handling
            if (this.position.y < 30) this.velocity.y = Math.abs(this.velocity.y)
            if (this.position.y > canvas.height - 30) this.velocity.y = -Math.abs(this.velocity.y)
            if (this.position.x < 30) this.velocity.x = Math.abs(this.velocity.x)
            if (this.position.x > canvas.width - 30) this.velocity.x = -Math.abs(this.velocity.x)
            this.position.y += this.velocity.y
            this.position.x += this.velocity.x
            this.angleSelf = this.getAngleSelf()

            //avoid snake ----  WORKING HERE - ADD AVOID CORRECTION TO BOID TO AVOID SNAKE!!
            // if(this.swerveSnake){
            //     this.angleSelf += this.swerveSnake
            //     this.velocity.x = Math.cos(this.angleSelf) * this.speed
            //     this.velocity.y = -Math.sin(this.angleSelf) * this.speed
            // }

            //Boid Segment Handling
            this.boidSegments.unshift({x: this.position.x, y: this.position.y})
            if (this.boidSegments.length > this.boidPieces) {
                this.boidSegments.pop()
            }


            // this.align()


        }

        draw(context){
            let opacity = 1;
            let radius = this.radius
            this.boidSegments.forEach((segment) => {
                opacity -= 0.1
                radius  = Math.abs(radius - 1)
                context.fillStyle = `rgba(${this.red},${this.green},${255 - this.red},${opacity})`
                context.beginPath()
                context.arc(segment.x, segment.y, radius, 0, 2 * Math.PI, true)
                context.fill()
            })
        }
    }

    class Game {
        constructor(width, height){
            this.width = width
            this.height = height
            this.snake = new Snake(this)
            this.input = new InputHandler(this)
            this.boidTimer = 0
            this.boidInterval = 1000
            this.starTimer = 0
            this.starInterval = 100
            this.boidsInPlay = 1
            this.maxBoids = 50 
            this.stopAddingBoids = false
            this.proximal = 150
            this.speed = 0 //initial boid speed
            this.red = 0
            this.blue = 255
            this.green = 0
            this.maxSpeed = 3
            this.keys = []
            this.boids = []
            this.stars = []
            this.gameOver = false
        }
        update(deltaTime){
            this.snake.update()
            this.boids.forEach(boid => {
                boid.update()
                //check if boid hits snake
                if (this.checkCollision(this.snake, boid)){
                    boid.markedForDeletion = true
                }
                // check if boid near snake
                if (this.checkInRangeOfSnake(this.snake, boid)){
                    // console.log("It's close now")
                }
                // check if snake is in front or to sides of boid
                // if (this.checkBoidSeesSnake(this.snake, boid)){
                //     console.log("I see you, turn to: ", this.checkBoidSeesSnake(this.snake, boid))

                // }
                this.checkBoidSeesSnake(this.snake, boid)

                if(boid.swerveSnakePiece){
                    boid.angleSelf += boid.swerveSnakePiece
                    boid.velocity.x = Math.cos(boid.angleSelf) * boid.speed
                    boid.velocity.y = -Math.sin(boid.angleSelf) * boid.speed
                }


            })
            this.boids = this.boids.filter(boid => !boid.markedForDeletion)
            if (this.boidTimer > this.boidInterval && this.boids.length < this.boidsInPlay && !this.gameOver) {
                this.addBoid(this)
                this.boidTimer = 0
            } else {
                this.boidTimer += deltaTime
            }
            this.stars.forEach(star => {
                star.update()
            } )
            this.stars = this.stars.filter(star => !star.markedForDeletion == true)
            if (this.starTimer > this.starInterval && !this.gameOver){
                this.addStar()
                this.starTimer = 0
            } else {
                this.starTimer += deltaTime
            }
        }

        draw(context){
            this.stars.forEach(star => {
                star.draw(context)
            })
            this.snake.draw(context)
            this.boids.forEach(boid => {
                boid.draw(context)
            })
        }

        addBoid(){
            this.boids.push(new Boid(this))
        }

        addStar(){
            this.stars.push(new Star(this))
        }

        checkCollision(snake, boid){
            if(!snake.snakeSegments || !boid.boidSegments){
                return
            }
            for(let i = 0; i < snake.snakeSegments.length; i++){
                for(let j = 0; j < boid.boidSegments.length; j++ ){
                    let distance = Math.sqrt((Math.abs(snake.snakeSegments[i].x - boid.boidSegments[j].x)**2 + Math.abs(snake.snakeSegments[i].y - boid.boidSegments[j].y)**2))
                    let checkDistance = snake.radius + boid.radius - 2
                    if (distance < checkDistance) {
                        boid.markedForDeletion = true
                        if (this.red > 255){
                            this.red = 255
                            this.blue = 255
                            this.green = 255
                        }else{
                            this.red += 5
                            this.blue -= 5
                        }
                        if(this.boidsInPlay >= this.maxBoids){
                            this.stopAddingBoids = true
                        }
                        if (this.stopAddingBoids){
                            this.boidsInPlay = 0
                        }else{
                            this.boidsInPlay += 1
                        }
                        
                        this.snake.snakePieces += 2
                        this.snake.radius += 0.25
                        if (this.speed < this.maxSpeed){
                            this.speed += 0.125
                        }
                        return
                    }
                }
            }
        }

        //only check Boid Head
        checkInRangeOfSnake(snake, boid){
            // if(!snake.snakeSegments || !boid.boidSegments){
            //     return false
            // }
            for(let i = 0; i < snake.snakeSegments.length; i++){
                let distance =  Math.sqrt((Math.abs(snake.snakeSegments[i].x - boid.boidSegments[0].x)**2 + Math.abs(snake.snakeSegments[i].y - boid.boidSegments[0].y)**2))
                
                if (distance < this.proximal){
                    return true
                } else {
                    return false
                }
            }
        }
        swerveSnake(swerveSnake){
                angleSelf += swerveSnake
                velocity.x = Math.cos(angleSelf) * speed
                velocity.y = -Math.sin(angleSelf) * speed
        }
        //only check Boid Head Velocity for efficiency gain
        //Were gonna do some math here. Get smallest value of difference between angles returned from angle self and angle toward aka
        //min: diff1 = largeAngle - smallAngle and diff2 = smallAngle + 2*PI - largeAngle
        //returns 1 for turn clockwise or -1 for turn counter clockwise or false for do nothing.
        checkBoidSeesSnake(snake, boid){
            for(let i = 0; i < snake.snakeSegments.length; i++){
                const snakePiecePosition = new Victor(snake.snakeSegments[i].x, snake.snakeSegments[i].y)
                let angleTowardSnake = this.getAngleTo(boid, snakePiecePosition)
                let difference = 0
                let swerveSnakePiece = 0
                if(boid.angleSelf <= angleTowardSnake){
                    let diff1 = angleTowardSnake - boid.angleSelf
                    let diff2 = boid.angleSelf + 6.28 - angleTowardSnake
                    swerveSnakePiece = diff1 < diff2 ?  -1 * boid.swerveValue : 1 * boid.swerveValue
                    difference = diff1 < diff2 ? diff1 : diff2
                }else{
                    let diff1 = boid.angleSelf - angleTowardSnake
                    let diff2 = angleTowardSnake + 6.28 - boid.angleSelf
                    swerveSnakePiece = diff1 < diff2 ?  1 * boid.swerveValue : -1 * boid.swerveValue
                    difference = diff1 < diff2 ? diff1 : diff2
                }
                if (difference < 2.355 && this.checkInRangeOfSnake(snake, boid)){
                    boid.swerveSnakePiece = swerveSnakePiece

                } else {
                    boid.swerveSnakePiece = null
                }

            }

        }
        

        getAngleTo(boid0, snakeSegment){
            if(!boid0 || !snakeSegment){
                return
            }else{
                const vec1 = boid0.position.clone()
                const vec2 = snakeSegment.clone()
                let angle = vec1.subtract(vec2).direction()
                if (angle > 0) {
                    angle = Math.PI - angle
                } else {
                    angle = Math.abs(Math.PI - angle) % (Math.PI * 2)
                }
                return angle
            }
        }

        getAngleSelf(boid0){
            if(!boid0){
                return
            }else{
                var angle = boid0.velocity.clone().invertY().direction()
                if (angle > 0) {
                    angle = angle
                } else {
                    angle = (Math.PI + (Math.PI - Math.abs(angle))) % (2 * Math.PI)
                }
            }
            return angle
        }

    }








    const game = new Game(canvas.width, canvas.height)
    let lastTime = 0
    //animation loop
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.update(deltaTime)
        game.draw(ctx)
        requestAnimationFrame(animate)
    }
    animate(0)
})

