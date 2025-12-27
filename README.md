# 🐍 SnakeEatsBoids  
**A real‑time, agent‑based simulation built into a playable Snake game**

[🎥 2‑Minute Demo](https://youtu.be/WzBhyxWUdJA?si=tAKQxHtip39tyON-)  
[▶️ Play Online](https://lambertedesign.com)

SnakeEatsBoids is a browser‑based game that blends classic Snake mechanics with **Craig Reynolds–style Boid AI**. Instead of static food, each “food” object is an autonomous agent exhibiting alignment, cohesion, and avoidance behaviors. The result is a dynamic, emergent system where the snake must hunt intelligent, flocking prey.

This project demonstrates **real‑time simulation**, **vector math**, **performance optimization**, and **modular JavaScript engineering**. The engine has been tested with **10,000+ boids running smoothly** during a live coding meetup.

---

## 📌 Overview  
SnakeEatsBoids is both a game and a simulation engine. It showcases:

- Agent‑based modeling  
- Real‑time decision making  
- Physics‑inspired steering behaviors  
- Performance‑tuned rendering  
- Cross‑platform input (keyboard + mobile joystick)  
- Clean, modular architecture  

It’s a systems‑engineering demo disguised as a game.

---

## 🧠 AI Behaviors (Boids)

### **Alignment**  
Boids steer toward the average heading of nearby agents.  
- Computes angle differences  
- Filters by field of view  
- Averages direction vectors  
- Produces a smooth steering correction

### **Cohesion**  
Boids steer toward the average position of neighbors.  
- Collects all “in‑sight” boids  
- Computes centroid  
- Generates a vector toward the group center

### **Avoidance (Separation)**  
Boids steer away from obstacles or nearby agents.  
- Reuses snake–boid avoidance logic  
- Calculates “swerve” values  
- Applies stronger weights at close distances

### **Sight & Range Logic**  
Each boid evaluates:  
- Angle between its heading and another boid  
- Distance threshold  
- Whether the other boid is in front or to the sides  
- Whether the object is itself (!self)

This produces emergent flocking behavior with minimal rules.

---

## ⚙️ Technical Highlights

### **Modular Architecture**  
- Separate classes for Snake, Boid, Game Controller, and UI  
- Reusable steering functions  
- Clean separation of physics, rendering, and input  

### **Performance & Robustness**  
- Smooth performance with **10,000+ boids**  
- Efficient neighbor detection  
- Optimized canvas rendering  
- Runs reliably on **older iPhone hardware**  
- Stable under high‑load conditions (large flocks, rapid respawns)

### **Math & Simulation**  
- Vector normalization  
- Weighted steering  
- Angle‑based field‑of‑view checks  
- Averaging algorithms for alignment & cohesion  

### **Cross‑Platform Input**  
- Keyboard controls  
- Touchscreen joystick support  
- Mobile‑friendly UI elements  

---

## 🎮 Gameplay Features

### **Dynamic Boid Behavior**  
As the snake eats boids, new ones spawn with:  
- Faster movement  
- Sharper turning  
- Larger size  
- Different colors  

### **Power‑Ups**  
Each power‑up includes UI banners and countdown timers.

- **Gigantuan** – increases snake size  
- **Speed Boost** – temporary velocity increase  
- **Time Dilation** – slows boid movement  
- **Containment** – boids bounce off boundaries  
- **Battle Ship (Planned)** – snake fires projectiles to “frag” boids  

---

## 🛠️ Tech Stack  
- **JavaScript (ES6)**  
- **HTML5 Canvas**  
- **CSS**  
- **Node/Express** (development tooling)  
- **Custom vector math utilities**  

---

## 📚 Research & Inspiration  
- Craig Reynolds, *Flocks, Herds, and Schools: A Distributed Behavioral Model* (1987)  
- Particle Life simulations  
- Evolutionary agent systems (e.g., Bibites)

---

## 📝 Development Log  
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
