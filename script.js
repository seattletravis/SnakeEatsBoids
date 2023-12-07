window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d')
    canvas.width = 750
    canvas.height = 400
    
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
            this.radius = 10
            this.position = new Victor(20, 100)
            this.speedY = 0
            this.speedX = 0
            this.snakeSpeed = 2
            this.snakePieces = 60
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
            for(let i = this.snakeSegments.length - 1; i >= 0; i--){
                if (Math.floor(i / 8) % 2 === 0){
                    context.fillStyle = 'red'
                } else {
                    context.fillStyle = 'green'
                }
                

                context.beginPath()
                context.arc(this.snakeSegments[i].x, this.snakeSegments[i].y, this.radius, 0, 2*Math.PI, false)
                context.fill()

            }
        }
    }
    class Food {
        constructor(game) {
            this.game = game
            this.width = 20
            this.height = 20
            this.x = Math.random() * (canvas.width - 25) + 5
            this.y = Math.random() * (canvas.height - 25) + 5
        }
        update(){
            
        }

        draw(context){
            context.fillStyle = 'red'
            context.fillRect(this.x, this.y, this.width, this.height)
            context.arc()
        }
    }

    class Star {
        constructor(game){
            this.game = game
            this.x = this.game.width
            this.speedX = Math.random() * -1.5 - 0.5
            this.markedForDeletion = false
            this.width = Math.random() * 2
            this.height = this.width
            this.y = Math.random() * (this.game.height * 0.9 - this.height)
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
            this.boids = this.game.boids
            this.position = new Victor(Math.random() * (canvas.width - 30) + 15,Math.random() * (canvas.height - 30) + 15)
            this.radius = 10
            this.speed = 2
            var initialDirection = Math.random() * Math.PI
            this.velocity = new Victor(this.speed * Math.cos(initialDirection),this.speed * Math.sin(initialDirection))
            this.boidPieces = 10
            this.boidSegments = []
        }
        
        update(){
            if (this.position.y < 15 || this.position.y > canvas.height - 15) this.velocity.y = -this.velocity.y
            if (this.position.x < 15 || this.position.x > canvas.width - 15) this.velocity.x = -this.velocity.x

            this.position.y += this.velocity.y
            this.position.x += this.velocity.x
            this.boidSegments.unshift({x: this.position.x, y: this.position.y})
            if (this.boidSegments.length > this.boidPieces) {
                this.boidSegments.pop()
            }

        }

        draw(context){
            let opacity = 1;
            let radius = 10
            this.boidSegments.forEach((segment) => {
                opacity -= 0.1
                radius -= 0.75
                context.fillStyle = `rgba(160,32,240,${opacity})`
                context.beginPath()
                context.arc(segment.x, segment.y, radius, 0, 2 * Math.PI, true)
                context.fill()
            })
        }

        flock(){
            var alignForce = this.align(boids)
            console.log(alignForce)
        }
    }



    class Game {
        constructor(width, height){
            this.width = width
            this.height = height
            this.snake = new Snake(this)
            this.input = new InputHandler(this)
            this.boid = new Boid(this)
            this.boidTimer = 0
            this.boidInterval = 1000
            this.starTimer = 0
            this.starInterval = 1000
            this.maxBoids = 10
            this.keys = []
            this.boids = []
            this.enemies = []
            this.gameOver = false
        }
        update(deltaTime){


            this.snake.update()
            this.boids.forEach(boid => {
                boid.update()
            })
            this.boids = this.boids.filter(boid => !boid.markedForDeletion)
            if (this.boidTimer > this.boidInterval && this.boids.length < this.maxBoids && !this.gameOver) {
                this.addBoid()
                this.boidTimer = 0
            } else {
                this.boidTimer += deltaTime
            }
            this.enemies.forEach(star => {
                star.update()
            } )
            this.enemies = this.enemies.filter(star => !star.markedForDeletion == true)
            if (this.starTimer > this.starInterval && !this.gameOver){
                this.addStar()
                this.starTimer = 0
            } else {
                this.starTimer += deltaTime
            }

            


        }



        draw(context){
            this.enemies.forEach(star => {
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
            this.enemies.push(new Star(this))
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