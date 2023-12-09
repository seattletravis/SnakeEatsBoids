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
            this.speed = 0.5
            var initialDirection = Math.random() * Math.PI * 2
            this.velocity = new Victor(this.speed * Math.cos(initialDirection),this.speed * Math.sin(initialDirection))
            this.boidPieces = 10
            this.boidSegments = []
        }
        
        update(){
            //Boundary Handling
            if (this.position.y < 30) this.velocity.y = Math.abs(this.velocity.y)
            if (this.position.y > canvas.height - 30) this.velocity.y = -Math.abs(this.velocity.y)
            if (this.position.x < 30) this.velocity.x = Math.abs(this.velocity.x)
            if (this.position.x > canvas.width - 30) this.velocity.x = -Math.abs(this.velocity.x)
            this.position.y += this.velocity.y
            this.position.x += this.velocity.x
            //Boid Segment Handling
            this.boidSegments.unshift({x: this.position.x, y: this.position.y})
            if (this.boidSegments.length > this.boidPieces) {
                this.boidSegments.pop()
            }

            //Boid Alignment
            var align = this.align()
            // this.velocity.add(align)

            //Boid Cohesion


            //Boid Seperation



        }

        getAngleTo(boid0, boid1){
            if(!boid0 || !boid1){
                return
            }else{
                var vec1 = boid0.position.clone()
                var vec2 = boid1.position.clone()
                var angle = vec1.subtract(vec2).direction()
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
                // var boidInstance = boid0.velocity.clone()
                // boidInstance.invertY()
                // var angle = boidInstance.direction()
                var angle = boid0.velocity.clone().invertY().direction()

                if (angle > 0) {
                    angle = angle
                } else {
                    angle = (Math.PI + (Math.PI - Math.abs(angle))) % (2 * Math.PI)
                }
            }
            return angle
        }
        
        getDistanceTo(boid0, boid1){
            if(!boid0 || !boid1){
                return
            }else{
                var vec1 = boid0.position.clone()
                var vec2 = boid1.position.clone()
            }
            return vec1.distance(vec2)
        }

        inRange(boid0, boid1){
            if(!boid0 || !boid1){
                return false
            }else{
                let vec1 = boid0.position.clone()
                let vec2 = boid1.position.clone()
                var distance = vec1.distance(vec2) 
            }
            if(distance < this.proximal){
                return true
            }else{
                return false
            }
        }

        inSight(boid0, boid1){

        }

        align(){
            //Boid Alignment
            // console.log(this.inRange(this.boids[0], this.boids[1]))
            // console.log(this.getDistanceTo(this.boids[0], this.boids[1]))
            console.log(this.getAngleSelf(this.boids[0]))

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
            this.starInterval = 100
            this.maxBoids = 2
            this.keys = []
            this.boids = []
            this.stars = []
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