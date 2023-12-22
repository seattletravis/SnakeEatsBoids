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

    class UI{
        constructor(game){
            this.game = game
            this.fontSize = 25
            this.fontFamily = 'Helvetica'
            this.color = 'yellow'
            this.fragScore = this.game.score
        }
        draw(context){
            context.fillStyle = this.color
            context.font = this.fontSize + 'px ' + this.fontFamily
            context.fillText('Score: ' + this.game.score, 20, 40)
        }
    }

    class Particle {
        constructor(game, x, y, radius, red, green, blue, pointValue){
            this.game = game
            this.x = x
            this.y = y
            this.radius = radius
            this.red = red
            this.green = green
            this.blue = blue
            this.pointValue = pointValue
            this.opacity = 1
            this.particles = []
            this.markedForDeletion = false
        }
        update(){
            this.radius += 3
            this.opacity -= 0.075      
        }

        draw(context){
            context.fillStyle = `rgba(${this.red},${this.green},${this.blue},${this.opacity})`
            context.beginPath()
            context.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false)
            context.fill()
            context.fillStyle = `rgba(230, 245, 39, ${this.opacity})`
            context.fillText(this.pointValue, this.x - 15, this.y + 6)
            context.fill
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
            this.snakePieces = 7
            this.snakeSegments = []
        }
        
        update(){
            if (this.game.keys.includes('ArrowUp') && this.speedY === 0) {this.speedY = -this.snakeSpeed; this.speedX = 0}
            else if (this.game.keys.includes('ArrowDown') && this.speedY === 0) {this.speedY = this.snakeSpeed; this.speedX = 0}
            else if (this.game.keys.includes('ArrowLeft') && this.speedX === 0) {this.speedX = -this.snakeSpeed; this.speedY = 0}
            else if (this.game.keys.includes('ArrowRight') && this.speedX === 0) {this.speedX = this.snakeSpeed; this.speedY = 0} 
            else if (this.game.keys.includes(' ')) {this.speedX = 0; this.speedY = 0}
            if(this.position.x > game.width) {this.position.x = 0}
            else if (this.position.x < 0) {this.position.x = game.width}
            if(this.position.y > game.height) {this.position.y = 0}
            else if (this.position.y < 0) {this.position.y = game.height}
            
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
                if (Math.floor(i / 12) % 2 === 0){
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
            let initialDirection = Math.random() * Math.PI * 2
            this.velocity = new Victor(this.speed * Math.cos(initialDirection),this.speed * Math.sin(initialDirection))
            this.angleSelf = this.getAngleSelf()
            this.swerveValue = 0.00005
            this.swerveSnakePiece = null
            this.boidPieces = 5
            this.boidSegments = []
            this.pointValue = this.game.pointValue
            this.markedForDeletion = false
            this.boundaryBorderOn = false
        }
        
        getAngleSelf(){
            let angle = this.velocity.clone().invertY().direction()
            if (angle < 0) {
                angle = (Math.PI + (Math.PI - Math.abs(angle))) % (2 * Math.PI)
            }
            return angle
        }

        update(){
            //Boundary Handling - false -> pass through : true -> bounce back
            if (this.boundaryBorderOn){
                if (this.position.y < 30) this.velocity.y = Math.abs(this.velocity.y)
                if (this.position.y > canvas.height - 30) this.velocity.y = -Math.abs(this.velocity.y)
                if (this.position.x < 30) this.velocity.x = Math.abs(this.velocity.x)
                if (this.position.x > canvas.width - 30) this.velocity.x = -Math.abs(this.velocity.x)
            }else{
                //Boundary Handling Pass Through
                if(this.position.x > game.width) {this.position.x = 0}
                else if (this.position.x < 0) {this.position.x = game.width}
                if(this.position.y > game.height) {this.position.y = 0}
                else if (this.position.y < 0) {this.position.y = game.height}
            }

            this.position.y += this.velocity.y
            this.position.x += this.velocity.x
            this.angleSelf = this.getAngleSelf()

            //Boid Segment Handling
            this.boidSegments.unshift({x: this.position.x, y: this.position.y, radius: this.radius})
            if (this.boidSegments.length > this.boidPieces) {
                this.boidSegments.pop()
            }
        }

        draw(context){
            let opacity = 1;
            // let radius = this.boidSegments.radius
            this.boidSegments.forEach((segment) => {
                opacity -= 0.1
                segment.radius = Math.abs(segment.radius - 1)
                context.fillStyle = `rgba(${this.red},${this.green},${255 - this.red},${opacity})`
                context.beginPath()
                context.arc(segment.x, segment.y, segment.radius, 0, 2 * Math.PI, true)
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
            this.ui = new UI(this)
            this.boidTimer = 0
            this.boidInterval = 1000
            this.starTimer = 0
            this.starInterval = 100
            this.boidsInPlay = 10
            this.maxBoids = 50 
            this.stopAddingBoids = false
            this.proximal = 100
            this.speed = 2 //initial boid speed
            this.red = 0
            this.blue = 255
            this.green = 0
            this.maxSpeed = 3
            this.keys = []
            this.boids = []
            this.stars = []
            this.particles = []
            this.gameOver = false
            this.score = 0
            this.pointValue = 10

        }
        update(deltaTime){
            this.snake.update()
            //particle update, remove particle if opacity is 0
            this.particles.forEach(particle => {
                particle.update()
                if(particle.opacity <= 0){
                    particle.markedForDeletion = true
                }
            })
            this.particles = this.particles.filter(particle => !particle.markedForDeletion)
            //apply individual boid updates here. Main Boid Update Loop

            this.boids.forEach(boid => {
                boid.update()
                //check if boid hits snake
                if (this.checkCollision(this.snake, boid)){
                    boid.markedForDeletion = true
                }  
                
                //check if boid sees any segment of snake and then add swerve angle then update boid velocity vector
                for(let i = 0; i < this.snake.snakeSegments.length; i++){
                    const snakePiecePosition = new Victor(this.snake.snakeSegments[i].x, this.snake.snakeSegments[i].y)
                    this.avoidSnake(snakePiecePosition, boid)
                }
            })

            this.boids = this.boids.filter(boid => !boid.markedForDeletion)

            //add boids every second until boidsInPlay number is met.
            if (this.boidTimer > this.boidInterval && this.boids.length < this.boidsInPlay && !this.gameOver) {
                this.addBoid(this)
                this.boidTimer = 0
            } else {
                this.boidTimer += deltaTime
            }

            //add background stars
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
            this.ui.draw(context)
            this.stars.forEach(star => {
                star.draw(context)
            })
            this.snake.draw(context)
            this.particles.forEach(particle => particle.draw(context))
            this.boids.forEach(boid => {
                boid.draw(context)
            })
        }

        addPoints(boid){
            this.score += boid.pointValue
            this.pointValue += 10

        }

        changeBoidColor(boid){
            if (boid.red > 255){
                boid.red = 255
                boid.blue = 255
                boid.green = 255
            }else{
                boid.red += 12
                boid.blue -= 12
            }
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
                        this.particles.push(new Particle(this, boid.boidSegments[0].x, boid.boidSegments[0].y, boid.boidSegments[0].radius, boid.red, boid.green, boid.blue, boid.pointValue))
                        boid.markedForDeletion = true
                        this.changeBoidColor(this)
                        this.addPoints(boid)

                        if(this.boidsInPlay >= this.maxBoids){
                            this.stopAddingBoids = true
                        }
                        if (this.stopAddingBoids){
                            this.boidsInPlay = 0
                        }else{
                            this.boidsInPlay += 1
                        }
                        
                        this.snake.snakePieces += 3
                        this.snake.radius += 1.5/this.snake.radius
                        if (this.speed < this.maxSpeed){
                            this.speed += 0.125
                        }
                        return
                    }
                }
            }
        }
        
    avoidSnake(snakePiece, boid){
        let angleTowardSnake = this.getAngleTo(boid, snakePiece)
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
        let distance =  Math.sqrt((Math.abs(snakePiece.x - boid.boidSegments[0].x)**2 + Math.abs(snakePiece.y - boid.boidSegments[0].y)**2))
        let inRange = distance < this.proximal ? true : false
        boid.swerveSnakePiece = difference < 2.355 && inRange ? boid.swerveSnakePiece + swerveSnakePiece : null
        boid.angleSelf += boid.swerveSnakePiece
        boid.velocity.x = Math.cos(boid.angleSelf) * boid.speed
        boid.velocity.y = -Math.sin(boid.angleSelf) * boid.speed
    }

        getAngleTo(boid, snakePiece){
            const vec1 = boid.position.clone()
            const vec2 = snakePiece.clone()
            let angle = vec1.subtract(vec2).direction()
            if (angle > 0) {
                angle = Math.PI - angle
            } else {
                angle = Math.abs(Math.PI - angle) % (Math.PI * 2)
            }
            return angle             
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

