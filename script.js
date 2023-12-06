window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d')
    canvas.width = 750
    canvas.height = 400
    // var Victor = require('victor')
    
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
            // this.width = 20
            // this.height = 20
            // this.x = 20
            // this.y = 100
            this.radius = 10
            this.position = new Victor(20, 100)
            this.speedY = 0
            this.speedX = 0
            this.setSnakeSpeed = 2
            this.snakePieces = 30
            this.snakeSegments = []
        }
        
        update(){
            if (this.game.keys.includes('ArrowUp') && this.speedY === 0) {this.speedY = -this.setSnakeSpeed; this.speedX = 0}
            else if (this.game.keys.includes('ArrowDown') && this.speedY === 0) {this.speedY = this.setSnakeSpeed; this.speedX = 0}
            else if (this.game.keys.includes('ArrowLeft') && this.speedX === 0) {this.speedX = -this.setSnakeSpeed; this.speedY = 0}
            else if (this.game.keys.includes('ArrowRight') && this.speedX === 0) {this.speedX = this.setSnakeSpeed; this.speedY = 0} 
            else if (this.game.keys.includes(' ')) {this.speedX = 0; this.speedY = 0}
            this.position.y += this.speedY
            this.position.x += this.speedX
            this.snakeSegments.unshift({x: this.position.x, y: this.position.y})
            if (this.snakeSegments.length > this.snakePieces) {
                this.snakeSegments.pop()
            }
        }

        draw(context){
            context.fillStyle = 'green'
            this.snakeSegments.forEach((segment) => {
                // context.fillRect(segment.x, segment.y, this.width, this.height)
                context.fillStyle = 'green'
                context.beginPath()
                context.arc(segment.x, segment.y, this.radius, 0, 2 * Math.PI, true)
                context.fill()
            })
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
    class Enemy {
        constructor(game) {
            this.game = game
            this.x = this.game.width
            this.speedX = Math.random() * -1.5 - 0.5
            this.markedForDeletion = False
        }
        update() {
            this.x += this.speedX
            if (this.x + this.width < 0) this.markedForDeletion = true
        }
        draw(context) {
            context.fillStyle = 'red'
            context.fillRect(this.x, this.y, this.width, this.height)
        }
    }
    class Angler1 extends Enemy {
        constructor(game){
            super(game)
            this.width = 40
            this.height = 40
            this.y = Math.random() * (this.game.height * 9 - this.height)
            // this.x = this.game wid

        }

    }
    class Layer {

    }
    class Background {

    }
    class UI {
        constructor(game) {
            this.game = game
            this.fontSize = 25
            this.fontFamily = 'Helvetica'
            this.color = 'white'
        }
        draw(context){
            
        }
    }
    class Boid {
        constructor(game){
            this.game = game
            this.position = new Victor(Math.random() * (canvas.width - 30) + 15,Math.random() * (canvas.height - 30) + 15)
            this.radius = 10
            this.speed = 2
            var initialRandomDirection = Math.random() * Math.PI
            this.velocity = new Victor(this.speed * Math.cos(initialRandomDirection),this.speed * Math.sin(initialRandomDirection))
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
            // let this.
            this.boidSegments.forEach((segment) => {
                opacity -= 0.1
                radius -= 0.75
                context.fillStyle = `rgba(160,32,240,${opacity})`
                context.beginPath()
                context.arc(segment.x, segment.y, radius, 0, 2 * Math.PI, true)
                context.fill()
            })
        }

        align(context){
            neighborProximity = 50
            var sum = new Victor()
            var steer = new Victor()
            var count = 0
            for (var i = 0; i < boids.length; i ++) {
                var dist = this.position.position(boids[i].position)
            }
            console.log(sum)
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
            this.maxBoids = 10
            this.keys = []
            this.boids = []
            this.gameOver = false
        }
        update(deltaTime){
            this.snake.update()
            // this.boid.update()
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

        }
        draw(context){
            this.snake.draw(context)
            this.boids.forEach(boid => {
                boid.draw(context)
            })
        }
        addBoid(){
            this.boids.push(new Boid(this))
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