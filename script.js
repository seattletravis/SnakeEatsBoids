window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d')
    canvas.width = 1500
    canvas.height = 500
    

    class InputHandler {
        constructor(game){
            this.game = game
            window.addEventListener('keydown', e => {
                if ((   (e.key === 'ArrowUp') || 
                        (e.key === 'ArrowDown') ||
                        (e.key === 'ArrowLeft') ||
                        (e.key === 'ArrowRight') ||
                        (e.key === 'Space')
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
    class Projectile {

    }
    class Particle {

    }
    class Player {
        constructor(game){
            this.game = game
            this.width = 120
            this.height = 120
            this.x = 20
            this.y = 100
            this.speedY = 0
            this.speedX = 0
        }
        update(){
            if (this.game.keys.includes('ArrowUp')) {this.speedY = -1; this.speedX = 0}
            else if (this.game.keys.includes('ArrowDown')) {this.speedY = 1; this.speedX = 0}
            else if (this.game.keys.includes('ArrowLeft')) {this.speedX = -1; this.speedY = 0}
            else if (this.game.keys.includes('ArrowRight')) {this.speedX = 1; this.speedY = 0} 
            else if (this.game.keys.includes('Space')) {this.speedX = 0; this.speedY = 0}
            this.y += this.speedY
            this.x += this.speedX

        }
        draw(context){
            context.fillRect(this.x, this.y, this.width, this.height)
        }
    }
    class Enemy {
        
    }
    class Layer {

    }
    class Background {

    }
    class UI {

    }
    class Boid {

    }
    class Game {
        constructor(width, height){
            this.width = width
            this.height = height
            this.player = new Player(this)
            this.input = new InputHandler(this)
            this.keys = []
        }
        update(){
            this.player.update()
        }
        draw(context){
            this.player.draw(context)
        }
    }

    const game = new Game(canvas.width, canvas.height)
    //animation loop
    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        game.update()
        game.draw(ctx)
        requestAnimationFrame(animate)
    }
    animate()



})