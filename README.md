🚀 SnakeEatsBoids
A real‑time, agent‑based simulation built into a playable Snake game
🎥 2‑Minute Demo
▶️ Play Online
SnakeEatsBoids is a browser‑based game that blends classic Snake mechanics with Craig Reynolds–style Boid AI. Instead of static food, each “food” object is an autonomous agent exhibiting alignment, cohesion, and avoidance behaviors. The result is a dynamic, emergent system where the snake must hunt intelligent, flocking prey.
This project demonstrates real‑time simulation, vector math, performance optimization, and modular JavaScript architecture. The engine has been tested with 10,000+ boids running smoothly during a live coding meetup.

🎯 Key Features
🧠 Agent‑Based AI (Craig Reynolds Boids)
Each food object behaves as an independent agent with:

- Alignment – steering toward the average heading of nearby boids
- Cohesion – steering toward the average position of neighbors
- Avoidance – steering away from obstacles (including the snake)
- Sight & Range Filtering – boids only react to agents within a defined field of view
- Dynamic Behavior Tuning – adjustable coefficients for responsiveness, turning radius, and detection angles
  The simulation uses vector averaging, angle comparisons, and distance thresholds to compute steering forces each frame.

⚙️ Technical Highlights
🧩 Modular Architecture

- Separate classes for Snake, Boid, Game Controller, and UI
- Reusable steering functions for both snake–boid and boid–boid interactions
- Clean separation between physics, rendering, and input handling
  ⚡ Performance & Robustness
- Smooth performance with 10,000 boids tested live
- Efficient double‑loop neighbor detection with early exits
- Optimized canvas rendering for mobile and desktop
- Runs reliably on older iPhone hardware
  📐 Math & Simulation
- Angle‑based field‑of‑view checks
- Vector normalization and weighted steering
- Averaging algorithms for alignment and cohesion
- Reused avoidance logic for multiple interaction types
  📱 Cross‑Platform Input
- Keyboard controls
- Touchscreen joystick support (mobile‑friendly)

🕹️ Gameplay Enhancements
Power‑Ups (Implemented & Planned)

- Gigantuan – increases snake size
- Speed Boost – temporary velocity increase
- Time Dilation – slows boid movement
- Containment – boids bounce off boundaries
- Battle Ship (Planned) – snake fires projectiles to “frag” boids
  Each power‑up includes UI banners, countdown timers, and state transitions.

🛠️ Tech Stack

- JavaScript (ES6)
- HTML5 Canvas
- CSS
- Node/Express (development tooling)
- Custom vector math utilities

📚 Inspiration & Research

- Craig Reynolds, Flocks, Herds, and Schools: A Distributed Behavioral Model (1987)
- Particle Life simulations
- Evolutionary agent systems (e.g., Bibites)

📝 Development Log

12/27/2023 - I watched a very cool youtube video on evolution simuation, [Bibites Link Here](https://www.youtube.com/watch?v=xBQ3knSi0Uo&t=1331s)
This has me thinking I could add some functionality to include powerups.

1/4/2024 - I've been taking Coursera classes lately, and haven't been writing much code for the boids. However I did see an video on Particle Life. It's some really cool and interesting programming. I don't know if I'll be able to add it into SnakeBoidAI though. [Particle Life Video](https://www.youtube.com/watch?v=p4YirERTVF0)

1/8/2024 - It's 2024! Got into the code the other day, now I'm working on the UI for touch screen devices, powerups, Boid AI implementation (almost there), and the end level functionality. Lots of tickets to get through to make this a very cool game demo.

1/11/2024 - It's Go time!!! Alignment behavior is working and online. Focus on Cohesion behavior, Win level and restart new level functionality, add joycon for touch screen devices, and more powerups. It would be fun to use particle life for background animations. [Particle Life Code](https://github.com/hunar4321/particle-life)

1/12/2024 - Working in progress. It's cold in Seattle this weekend temperatures getting down into the teens.

1/13/2024 - Found a joystick library that can be used for touchscreen devices. Will implement a joystick controller into project when i get a chance. [Joystick Code](https://www.cssscript.com/tag/joystick/)

1/19/2024 - Time flies when you're coding in Node/Express. I haven't forgotten about you little Snake Game. I'll write some more features in this week. I promise.

1/20/2024 - I had an actual interview yesterday for an IT Support Engineer role. Hurray! Maybe I'll get a job. I'll keep you posted Devlog... You're my friend, Devlog!

My Devlog, (echo) my Devlop, My Devlog, (echo) my Devlop...<br>Everywhere I go... Devlog goes.<br>My Devlog, (echo) my Devlop, My Devlog, (echo) my Devlop. Ya! You're the best Devlop!

1/27/2024 - Just finished Node/Express course and Python AI fundamentals courses on Coursera. Cohesion implementation completed!

2/6/2024 - [Dev Log has moved to 'Dev Log is a Blog'](https://github.com/seattletravis/Blog) I will continue to update this development log as it pertains to SnakeEatsBoid, but most blogging will be done on the Blog.

2/7/2024 - Completed significant changes to visuals of boids, and upgraded logic controller for Boid AI implementaion
