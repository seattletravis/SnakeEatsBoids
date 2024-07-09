window.addEventListener('load', function () {
	const canvas = document.getElementById('canvas1');
	const ctx = canvas.getContext('2d');
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	const touchPadUp = document.getElementById('up');
	const touchPadDown = document.getElementById('Down');
	const touchPadLeft = document.getElementById('Left');
	const touchPadRight = document.getElementById('Right');

	class InputHandler {
		constructor(game) {
			this.game = game;
			touchPadUp.addEventListener('mousedown', () => {
				if (this.game.keys.indexOf('ArrowUp') === -1) {
					this.game.keys.push('ArrowUp');
				}
				touchPadUp.addEventListener('mouseup', () => {
					if (this.game.keys.indexOf('ArrowUp') > -1) {
						this.game.keys.splice(this.game.keys.indexOf('ArrowUp'), 1);
					}
				});
			});
			window.addEventListener('keydown', (e) => {
				if (
					(e.key === 'ArrowUp' ||
						e.key === 'ArrowDown' ||
						e.key === 'ArrowLeft' ||
						e.key === 'ArrowRight' ||
						e.key === ' ') &&
					this.game.keys.indexOf(e.key) === -1
				) {
					this.game.keys.push(e.key);
				}
			});

			window.addEventListener('keyup', (e) => {
				if (this.game.keys.indexOf(e.key) > -1) {
					this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
				}
			});
		}
	}

	class Star {
		constructor(game) {
			this.game = game;
			this.width = Math.random() * 2;
			this.height = this.width;
			this.x = this.game.width;
			this.y = Math.random() * (this.game.height * 1 - this.height);
			this.speedX = Math.random() * -1 - 0.25;
			this.markedForDeletion = false;
		}
		update() {
			this.x += this.speedX;
			if (this.x + this.width < 0) this.markedForDeletion = true;
		}
		draw(context) {
			context.fillStyle = 'white';
			context.fillRect(this.x, this.y, this.width, this.height);
		}
	}

	class UI {
		constructor(game) {
			this.game = game;
			this.fontSize = 25;
			this.fontFamily = 'Helvetica';
			this.color = 'yellow';
			this.fragScore = this.game.score;
			this.opacity = 1;
			this.red = 255;
			this.green = 255;
			this.blue = 150;
			this.bannerTimer = 0;
			this.bannerInterval = 3000;
		}

		update(deltaTime) {
			if (this.game.gargantuanMode.on) {
				if (this.bannerTimer > this.bannerInterval) {
					this.opacity -= 0.01;
				} else {
					this.bannerTimer += deltaTime;
				}
			}
		}

		draw(context) {
			context.fillStyle = `rgba(${this.red},${this.green},${this.blue}, 1)`;
			context.font = this.fontSize + 'px ' + this.fontFamily;
			context.fillText('Score: ' + this.game.score, 20, 40);
			if (this.game.gargantuanMode.on) {
				let timeLeft = 15 - Math.floor(this.game.gargantuanMode.timer / 1000);
				context.fillStyle = `rgba(${this.red},${this.green},${this.blue}, 1)`;
				context.font = this.fontSize + 'px ' + this.fontFamily;
				context.fillText('Big Time: ' + timeLeft, game.width - 200, 40);
			}

			if (this.game.speedMode.on) {
				let timeLeft = 15 - Math.floor(this.game.speedMode.timer / 1000);
				context.fillStyle = `rgba(${this.red},${this.green},${this.blue}, 1)`;
				context.font = this.fontSize + 'px ' + this.fontFamily;
				context.fillText('Speed Time: ' + timeLeft, game.width - 200, 80);
			}

			if (this.game.gargantuanMode.on) {
				context.fillStyle = `rgba(${this.red},${this.green},${this.blue},${this.opacity})`;
				context.font = this.fontSize + 'px ' + this.fontFamily;
				context.fillText('Gargantuan Mode Enabled! ', game.width / 2 - 250, 40);
			}

			if (this.game.speedMode.on) {
				context.fillStyle = `rgba(${this.red},${this.green},${this.blue},${this.opacity})`;
				context.font = this.fontSize + 'px ' + this.fontFamily;
				context.fillText('Speed Mode Enabled! ', game.width / 2 - 250, 80);
			}
		}

		displayTimeLeft() {}
	}

	class PowerUp {
		constructor(game, type) {
			this.game = game;
			this.radius = 9;
			this.x = Math.random() * game.width * 0.6 + game.width * 0.2;
			this.y = Math.random() * game.height * 0.6 + game.height * 0.2;
			this.type = type;
			this.red = 70;
			this.green = 255;
			this.blue = 180;
			this.opacity = 0.5;
			this.opacityAnimator = 0.01;
			this.color = 'white';
			this.markedForDeletion = false;
			this.timeRemaining = 15;
			this.powerTimer = 0;
			this.powerInterval = 15000;
		}

		update() {
			if (this.type === 'big') {
				this.radius = 14;
			} else if (this.type === 'speed') {
				this.radius = 9;
			}
			if (this.opacity < 0.4) {
				this.opacityAnimator = 0.01;
			} else if (this.opacity > 1) {
				this.opacityAnimator = -0.01;
			}
			this.opacity += this.opacityAnimator;
			if (this.timeRemaining > 0) {
				this.timeRemaining -= 0.01;
			} else this.markedForDeletion = true;
		}

		draw(context) {
			let displayTime = Math.floor(this.timeRemaining);
			let xAdjust = displayTime < 10 ? 4 : 8.5;
			context.fillStyle = `rgba(${this.red},${this.green},${this.blue},${this.opacity})`;
			context.beginPath();
			context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
			context.fill();
			context.fillStyle = `rgba(0, 0, 0, 1)`;
			context.font = 'bold 14px Arial';
			context.fillText(displayTime, this.x - xAdjust, this.y + 5);
			context.fill;
		}
	}

	class Particle {
		constructor(game, x, y, radius, red, green, blue, pointValue) {
			this.game = game;
			this.x = x;
			this.y = y;
			this.radius = radius;
			this.red = red;
			this.green = green;
			this.blue = blue;
			this.pointValue = pointValue;
			this.opacity = 1;
			this.particles = [];
			this.markedForDeletion = false;
		}
		update() {
			this.radius += 5;
			this.opacity -= 0.075;
		}

		draw(context) {
			context.fillStyle = `rgba(${this.red},${this.green},${this.blue},${this.opacity})`;
			context.beginPath();
			context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
			context.fill();
			context.fillStyle = `rgba(230, 245, 39, ${this.opacity})`;
			context.font = 'bold 25px comicsans';
			context.fillText(this.pointValue, this.x - 10, this.y + 6);
			context.fill;
		}
	}

	class Snake {
		constructor(game) {
			this.game = game;
			this.radius = 3;
			this.position = new Victor(400, 400);
			this.snakeSpeed = 2;
			this.speedY = 0;
			this.speedX = 0;
			this.snakePieces = 30;
			this.snakeSegments = [];
			this.snakeColorPattern = Math.ceil(this.snakePieces / 3);
			this.radiusIncreasePerFrag = 1 / this.radius;
			this.snakeTimer = 0;
			this.snakeInterval = 2000;
			this.speedFlag = false;
			this.primaryColor =
				'#' + ((Math.random() * 0xffffff) << 0).toString(16).padStart(6, '0');
			this.invertedColor = this.invertColor(this.primaryColor);
		}

		invertColor(hex, bw) {
			if (hex.indexOf('#') === 0) {
				hex = hex.slice(1);
			}
			if (hex.length === 3) {
				hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
			}
			if (hex.length !== 6) {
				throw new Error('Invalid HEX color.');
			}
			var r = parseInt(hex.slice(0, 2), 16),
				g = parseInt(hex.slice(2, 4), 16),
				b = parseInt(hex.slice(4, 6), 16);
			if (bw) {
				return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
			}
			r = (255 - r).toString(16);
			g = (255 - g).toString(16);
			b = (255 - b).toString(16);
			return '#' + this.padZero(r) + this.padZero(g) + this.padZero(b);
		}
		//helper function for invertColor
		padZero(str, len) {
			len = len || 2;
			var zeros = new Array(len).join('0');
			return (zeros + str).slice(-len);
		}

		update() {
			if (this.speedFlag === true) {
				this.speedY *= 2;
				this.speedX *= 2;
				this.speedFlag = false;
			}

			// let ampy = Math.sin(this.game.fingerAngle);

			if (this.game.keys.includes('ArrowUp') && this.speedY === 0) {
				this.speedY = -this.snakeSpeed;
				this.speedX = 0;
			} else if (this.game.keys.includes('ArrowDown') && this.speedY === 0) {
				this.speedY = this.snakeSpeed;
				this.speedX = 0;
			} else if (this.game.keys.includes('ArrowLeft') && this.speedX === 0) {
				this.speedX = -this.snakeSpeed;
				this.speedY = 0;
			} else if (this.game.keys.includes('ArrowRight') && this.speedX === 0) {
				this.speedX = this.snakeSpeed;
				this.speedY = 0;
			} else if (this.game.keys.includes(' ')) {
				this.speedX = 0;
				this.speedY = 0;
			}

			//WORKING HERE!!!!!!
			//CHECK STYLE SHEET FOR
			// onmousemove = (event) => {
			// 	let divStyleCenter = 175;
			// 	let fingery = canvas.width - event.x - divStyleCenter;
			// 	let fingerx = canvas.height - event.y - divStyleCenter;
			// 	this.game.fingerAngle = new Victor(fingery, fingerx).horizontalAngle();
			// 	console.log(`Finger Angle: ${this.game.fingerAngle}`);
			// };

			//END WORKING HERE!!!!!!

			// console.log(Math.sin(this.game.fingerAngle));
			// let ampy = Math.sin(this.game.fingerAngle);
			// this.speedY = -this.snakeSpeed;

			if (this.position.x > game.width) {
				this.position.x = 0;
			} else if (this.position.x < 0) {
				this.position.x = game.width;
			}
			if (this.position.y > game.height) {
				this.position.y = 0;
			} else if (this.position.y < 0) {
				this.position.y = game.height;
			}

			this.position.y += this.speedY;
			this.position.x += this.speedX;
			this.snakeSegments.unshift({ x: this.position.x, y: this.position.y });
			if (this.snakeSegments.length > this.snakePieces) {
				this.snakeSegments.pop();
			}
		}

		draw(context) {
			this.snakeColorPattern = Math.floor(this.snakeSegments.length / 6);
			let radius = this.radius;
			for (let i = this.snakeSegments.length - 1; i >= 0; i--) {
				if (Math.floor(i / this.snakeColorPattern) % 2 === 0) {
					context.fillStyle = this.primaryColor;
				} else {
					context.fillStyle = this.invertedColor;
				}
				context.beginPath();
				context.arc(
					this.snakeSegments[i].x,
					this.snakeSegments[i].y,
					radius,
					0,
					2 * Math.PI,
					false
				);
				context.fill();
			}
		}
	}

	class Boid {
		constructor(game) {
			this.game = game;
			this.boids = this.game.boids;
			this.position = new Victor(
				Math.random() * (canvas.width - 30) + 15,
				Math.random() * (canvas.height - 30) + 15
			);
			this.radius = this.game.boidRadius;
			this.speed = this.game.speed;
			this.red = this.game.red;
			this.green = this.game.green;
			this.blue = this.game.blue;
			let initialDirection = Math.random() * Math.PI * 2;
			this.velocity = new Victor(
				this.speed * Math.cos(initialDirection),
				this.speed * Math.sin(initialDirection)
			);
			this.angleSelf = this.getAngleSelf();
			this.boidPieces = this.game.addBoidPieces;
			this.boidSegments = [];
			this.pointValue = this.game.pointValue;
			this.markedForDeletion = false;
			this.boundaryBorderOn = false;
			this.swerveSnakePiece = null;
			this.swerveTowardBoids = null;
		}

		getAngleSelf() {
			let angle = this.velocity.clone().invertY().direction();
			angle =
				angle < 0
					? (Math.PI + (Math.PI - Math.abs(angle))) % (2 * Math.PI)
					: angle;
			return angle;
		}

		update() {
			//Boundary Handling - boundryBorderOn - false -> pass through : true -> bounce back
			if (this.boundaryBorderOn) {
				if (this.position.y < 30) this.velocity.y = Math.abs(this.velocity.y);
				if (this.position.y > canvas.height - 30)
					this.velocity.y = -Math.abs(this.velocity.y);
				if (this.position.x < 30) this.velocity.x = Math.abs(this.velocity.x);
				if (this.position.x > canvas.width - 30)
					this.velocity.x = -Math.abs(this.velocity.x);
			} else {
				//Boundary Handling - Pass Through
				if (this.position.x > game.width) {
					this.position.x = 0;
				} else if (this.position.x < 0) {
					this.position.x = game.width;
				}
				if (this.position.y > game.height) {
					this.position.y = 0;
				} else if (this.position.y < 0) {
					this.position.y = game.height;
				}
			}

			this.position.y += this.velocity.y;
			this.position.x += this.velocity.x;
			this.angleSelf = this.getAngleSelf();

			//Boid Segment Handling
			this.boidSegments.unshift({
				x: this.position.x,
				y: this.position.y,
				radius: this.radius,
			});
			if (this.boidSegments.length > this.boidPieces) {
				this.boidSegments.pop();
			}
		}

		draw(context) {
			let opacity = 1;
			this.boidSegments.forEach((segment) => {
				segment.radius = Math.abs(segment.radius - 1.2);
				context.fillStyle = `rgba(${this.red},${this.green},${
					255 - this.red
				},${opacity})`;
				context.beginPath();
				context.arc(segment.x, segment.y, segment.radius, 0, 2 * Math.PI, true);
				context.fill();
			});
		}
	}

	class Game {
		constructor(width, height) {
			this.fingerAngle;
			this.width = width;
			this.height = height;
			this.snake = new Snake(this);
			this.input = new InputHandler(this);
			this.ui = new UI(this);
			this.boidRadius = 5;
			this.addBoidPieces = 5;
			this.boidTimer = 0;
			this.boidInterval = 150;
			this.powerTimer = { timer: 0, interval: 5000 };
			this.starTimer = 0;
			this.starInterval = 100;
			this.boidsInPlay = 30;
			this.maxBoids = 80;
			this.stopAddingBoids = false;
			this.snakeSwerveValue = 0.001;
			this.boidSwerveValue = 0.05;
			this.boidCohesionSwerveValue = 0.03;
			this.snakeProxy = 150;
			this.boidAvoidProxy = 75;
			this.boidAlignProxy = 150;
			this.snakeSightAngle = 2.355;
			this.boidSightAngle = 1.57;
			this.boidCohesionSightAngle = 2.355;
			this.speed = 1; //initial boid speed
			this.red = 0;
			this.blue = 255;
			this.green = 0;
			this.maxSpeed = 3;
			this.keys = [];
			this.boids = [];
			this.powerUpsOnScreen = [];
			this.powerUpsOn = [];
			this.powerUpsInPlay = 1;
			this.sightedBoids = [];
			this.stars = [];
			this.particles = [];
			this.gameOver = false;
			this.score = 0;
			this.pointValue = 10;
			this.gargantuanMode = {
				on: false,
				timer: 0,
				interval: 15000,
			};
			this.speedMode = { on: false, timer: 0, interval: 15000 };
			this.shrinkFactorSegments = 2;
			this.shrinkFactorRadius = 0.5;
			this.initialBoidsAdded = false;
		}
		update(deltaTime) {
			if (
				this.score > 1000 &&
				this.boids.length === 0 &&
				this.gameOver === false
			) {
				this.winGame();
			}
			this.ui.update(deltaTime);
			this.snake.update();
			//powerups update - for opacity animation
			this.powerUpsOnScreen.forEach((powerup) => {
				powerup.update();
				if (this.checkPowerUpCollision(this.snake, powerup)) {
					powerup.markedForDeletion = true;
				}
			});
			this.powerUpsOnScreen = this.powerUpsOnScreen.filter(
				(powerups) => !powerups.markedForDeletion
			);

			//particle update, remove particle if opacity is 0
			this.particles.forEach((particle) => {
				particle.update();
				if (particle.opacity <= 0) {
					particle.markedForDeletion = true;
				}
			});
			this.particles = this.particles.filter(
				(particle) => !particle.markedForDeletion
			);
			//apply individual boid updates here. Main Boid Update Loop

			this.boids.forEach((boid) => {
				boid.update();
				//check if boid hits snake
				if (this.checkCollision(this.snake, boid)) {
					boid.markedForDeletion = true;
				}
				for (let i = 0; i < this.snake.snakeSegments.length; i++) {
					if (i % 3 == 0) {
						const snakePiecePosition = new Victor(
							this.snake.snakeSegments[i].x,
							this.snake.snakeSegments[i].y
						);
						this.avoid(
							snakePiecePosition,
							boid,
							this.snakeProxy + this.snake.radius,
							this.snakeSwerveValue,
							this.snakeSightAngle
						);
					}
				}

				//empty array sightedBoids
				this.sightedBoids = [];
				// BEHAVIOR CALLS FOR AVOID EACH OTHER BEHAVIOR
				this.boids.forEach((otherBoid) => {
					if (otherBoid.boidSegments[0] != undefined) {
						const boidHead = new Victor(
							otherBoid.boidSegments[0].x,
							otherBoid.boidSegments[0].y
						);
						//Get List of boids that will be affect boid0 alignment
						this.getSightedBoids(
							otherBoid,
							boid,
							this.boidAlignProxy,
							this.boidSightAngle
						);
						//AVOID CALL
						this.avoid(
							boidHead,
							boid,
							this.boidAvoidProxy,
							this.boidSwerveValue,
							this.boidSightAngle
						);
					}
				});
				//Get average Vectors x, and y respectively for sightedBoids AND
				//swerve Boid into alignment Call Align Function.
				this.align(this.sightedBoids, boid, this.boidSwerveValue);

				//COHESION CALL
				this.cohesion(
					this.sightedBoids,
					boid,
					this.boidCohesionSwerveValue,
					this.boidCohesionSightAngle
				);
			});

			this.boids = this.boids.filter((boid) => !boid.markedForDeletion);

			//logic controller for putting powerups in play

			//Manage Powerup Mode - Gargantuan
			if (this.powerUpsOnScreen.length < this.powerUpsInPlay) {
				const type = Math.random() <= 0.5 ? 'speed' : 'big';
				this.addPowerUp(type);
			}
			this.addPowerUpsInPlay(deltaTime);
			this.gargantuan(deltaTime);
			this.speedBoost(deltaTime);

			//add boids every second until boidsInPlay number is met.
			if (
				this.boidTimer > this.boidInterval &&
				this.boids.length < this.boidsInPlay
			) {
				this.addBoid(this);
				this.boidTimer = 0;
			} else {
				this.boidTimer += deltaTime;
			}

			//add background stars
			this.stars.forEach((star) => {
				star.update();
			});
			this.stars = this.stars.filter((star) => !star.markedForDeletion == true);
			if (this.starTimer > this.starInterval && !this.gameOver) {
				this.addStar();
				this.starTimer = 0;
			} else {
				this.starTimer += deltaTime;
			}

			//shrink snake if snake doesnt eat
			if (
				this.snake.snakeTimer > this.snake.snakeInterval &&
				this.snake.radius > 3 &&
				!this.gargantuanMode.on &&
				!this.gameOver
			) {
				this.snake.radius -= this.shrinkFactorRadius;
				this.snake.snakeTimer = 0;
			} else if (
				this.snake.snakeTimer > this.snake.snakeInterval &&
				this.snake.radius <= 3 &&
				!this.gargantuanMode.on &&
				!this.gameOver
			) {
				this.snake.snakePieces -= this.shrinkFactorSegments;
				for (let i = 0; i <= this.shrinkFactorSegments; i++) {
					this.snake.snakeSegments.pop();
				}
				this.snake.snakeTimer = 0;
			} else if (
				this.snake.snakeTimer > this.snake.snakeInterval &&
				this.snake.radius <= 3 &&
				this.snake.snakePieces <= 0 &&
				!this.gargantuanMode.on &&
				!this.gameOver
			) {
				this.gameOver = true;
			} else {
				this.snake.snakeTimer += deltaTime;
			}
		} //END GAME UPDATE FUNCTION

		draw(context) {
			this.ui.draw(context);
			this.stars.forEach((star) => {
				star.draw(context);
			});
			this.powerUpsOnScreen.forEach((powerup) => {
				powerup.draw(context);
			});
			this.snake.draw(context);
			this.particles.forEach((particle) => particle.draw(context));
			this.boids.forEach((boid) => {
				boid.draw(context);
			});
		}

		addPoints(boid) {
			this.score += boid.pointValue;
			this.pointValue += 10;
		}

		changeBoidColor(boid) {
			if (boid.red > 255) {
				boid.red = 255;
				boid.blue = 255;
				boid.green = 255;
			} else {
				boid.red += 6;
				boid.blue -= 6;
			}
		}

		addBoid() {
			this.boids.push(new Boid(this));
		}

		addPowerUp(type) {
			this.powerUpsOnScreen.push(new PowerUp(this, type));
		}

		addStar() {
			this.stars.push(new Star(this));
		}

		checkPowerUpCollision(snake, powerup) {
			for (let i = 0; i < snake.snakeSegments.length; i++) {
				let distance = Math.sqrt(
					Math.abs(snake.snakeSegments[i].x - powerup.x) ** 2 +
						Math.abs(snake.snakeSegments[i].y - powerup.y) ** 2
				);
				let checkDistance = snake.radius + powerup.radius + 2;
				if (distance < checkDistance) {
					powerup.markedForDeletion = true;
					if (powerup.type === 'big') {
						if (this.gargantuanMode.on === true) {
							this.gargantuanMode.timer -= 3000;
						} else {
							this.gargantuanMode.on = true;
						}
					} else {
						if (this.speedMode.on === true) {
							this.speedMode.timer -= 3000;
						} else {
							this.speedMode.on = true;
						}
					}
					this.powerUpsInPlay -= 1;
					return;
				}
			}
		}

		checkCollision(snake, boid) {
			if (!snake.snakeSegments || !boid.boidSegments) {
				return;
			}
			for (let i = 0; i < snake.snakeSegments.length; i++) {
				for (let j = 0; j < boid.boidSegments.length; j++) {
					let distance = Math.sqrt(
						Math.abs(snake.snakeSegments[i].x - boid.boidSegments[j].x) ** 2 +
							Math.abs(snake.snakeSegments[i].y - boid.boidSegments[j].y) ** 2
					);
					let checkDistance = snake.radius + boid.radius + 4;
					if (distance < checkDistance) {
						this.particles.push(
							new Particle(
								this,
								boid.boidSegments[0].x,
								boid.boidSegments[0].y,
								boid.boidSegments[0].radius,
								boid.red,
								boid.green,
								boid.blue,
								boid.pointValue
							)
						);
						boid.markedForDeletion = true;
						this.changeBoidColor(this);
						this.addPoints(boid);
						this.snake.snakeTimer = 0;

						if (this.boidsInPlay >= this.maxBoids) {
							this.stopAddingBoids = true;
						}
						if (this.stopAddingBoids) {
							this.boidsInPlay = 0;
						} else {
							this.boidsInPlay += 1;
							this.snakeProxy += 1;
							this.snakeSwerveValue += 0.0000001;
						}
						this.snake.snakePieces += 3;
						this.snake.radius += this.snake.radiusIncreasePerFrag;
						this.boidRadius += 0.25;
						this.addBoidPieces += 0.15;
						if (this.speed < this.maxSpeed) {
							this.speed += 0.125;
						}
						return;
					}
				}
			}
		}

		getSightedBoids(otherBoid, boid, proximal, sightAngle) {
			let distanceTo = this.getDistanceTo(otherBoid, boid);
			if (distanceTo === 0 || distanceTo > proximal) {
				return;
			}
			let angleDifference = this.getAngleDifference(otherBoid, boid);
			if (Math.abs(angleDifference) < sightAngle) {
				this.sightedBoids.push(otherBoid);
			}
		}

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

		getAverageAngle(boids) {
			boids.forEach((boid) => {});
		}

		getAngleDifference(boid1, boid0) {
			let angleTo = this.getAngleTo(boid0, boid1);
			let difference = 0;
			if (boid0.angleSelf <= angleTo) {
				let diff1 = angleTo - boid0.angleSelf;
				let diff2 = boid0.angleSelf + 6.28 - angleTo;
				// let magnitude = diff1 < diff2 ?  -1 : 1
				difference = diff1 < diff2 ? -diff1 : diff2;
			} else {
				let diff1 = boid0.angleSelf - angleTo;
				let diff2 = angleTo + 6.28 - boid0.angleSelf;
				// let magnitude = diff1 < diff2 ?  1 : -1
				difference = diff1 < diff2 ? diff1 : -diff2;
			}
			return difference;
		}

		getAngleTo(body0, body1) {
			const vec1 = body0.position.clone();
			const vec2 = body1.position.clone();
			let angle = vec1.subtract(vec2).direction();
			angle =
				angle < 0 ? Math.PI - angle : Math.abs(Math.PI - angle) % (Math.PI * 2);
			return angle;
		}

		getDistanceTo(body0, body1) {
			const vec1 = body0.position.clone();
			const vec2 = body1.position.clone();
			let distance = vec1.distance(vec2);
			return distance;
		}

		//POWERUPS - gargantuan
		addPowerUpsInPlay(deltaTime) {
			if (this.powerUpsInPlay > 0) {
				return;
			}
			if (this.powerTimer.timer > this.powerTimer.interval) {
				this.powerUpsInPlay += 1;
				this.powerTimer.timer = 0;
				return;
			} else {
				this.powerTimer.timer += deltaTime;
			}
		}

		//POWERUPS - gargantuan
		gargantuan(deltaTime) {
			if (this.gargantuanMode.on === false) {
				return;
			}
			if (this.gargantuanMode.timer > this.gargantuanMode.interval) {
				this.snake.radius -= 60;
				this.gargantuanMode.on = false;
				this.gargantuanMode.timer = 0;
				return;
			} else if (this.gargantuanMode.timer <= 0) {
				this.snake.radius += 60;
				this.gargantuanMode.timer += deltaTime;
			} else {
				this.gargantuanMode.timer += deltaTime;
			}
		}

		// POWERUPS - Speed Boost
		speedBoost(deltaTime) {
			if (this.speedMode.on === false) {
				return;
			}
			if (this.speedMode.timer > this.speedMode.interval) {
				this.snake.snakeSpeed -= 2;
				this.speedMode.on = false;
				this.speedMode.timer = 0;
				return;
			} else if (this.speedMode.timer <= 0) {
				this.snake.snakeSpeed += 2;
				this.snake.speedFlag = true;

				this.speedMode.timer += deltaTime;
			} else {
				this.speedMode.timer += deltaTime;
			}
		}

		winGame() {
			console.log('You Win!!!');
			this.gameOver = true;
		}
	}

	//Main Game Loop
	const game = new Game(canvas.width, canvas.height);
	let lastTime = 0;
	//animation loop
	function animate(timeStamp) {
		const deltaTime = timeStamp - lastTime;
		lastTime = timeStamp;
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		game.update(deltaTime);
		game.draw(ctx);
		requestAnimationFrame(animate);
	}
	animate(0);
});
