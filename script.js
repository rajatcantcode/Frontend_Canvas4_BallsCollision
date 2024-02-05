import utils from "./utils.js";

const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
  x: innerWidth / 2,
  y: innerHeight / 2,
};

const colors = ["#2185C5", "#7ECEFD", "#FFF6E5", "#FF7F66"];

// Event Listeners
addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
});

addEventListener("resize", () => {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  init();
});

class Particle {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = {
      x: Math.random() - 0.5 * 2,
      y: Math.random() - 0.5 * 2,
    };
    this.mass = 1;
  }

  draw() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.strokestyle = this.color;
    c.stroke();
    c.closePath();
  }

  update(particles) {
    this.draw();

    for (let i = 0; i < particles.length; i++) {
      if (this === particles[i]) {
        continue;
      }

      if (
        utils.distance(this.x, this.y, particles[i].x, particles[i].y) -
          this.radius * 2 <
        0
      ) {
        utils.resolveCollision(this, particles[i]);
        // console.log("collided");
      }
    }
    //to make collision with canvas width and height
    if (this.x - this.radius <= 0 || this.x + this.radius >= canvas.width) {
      this.velocity.x = -this.velocity.x;
    }
    if (this.y - this.radius <= 0 || this.y + this.radius >= canvas.height) {
      this.velocity.y = -this.velocity.y;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

// Implementation
let particles;
function init() {
  particles = [];

  for (let i = 0; i < 5; i++) {
    let radius = 100;
    //more efficient they will spawn within canvas boundary
    let x = utils.randomIntFromRange(radius, canvas.width - radius);
    let y = utils.randomIntFromRange(radius, canvas.height - radius);

    let color = "blue";

    if (i !== 0) {
      for (let j = 0; j < particles.length; j++) {
        //if our random generated circles are colliding then
        if (
          utils.distance(x, y, particles[j].x, particles[j].y) - radius * 2 <
          0
        ) {
          //We reagain will give random values
          x = utils.randomIntFromRange(radius, canvas.width - radius);
          y = utils.randomIntFromRange(radius, canvas.height - radius);

          //We will reagain will check whether any circle is colliding from array[0]
          j = -1;
        }
      }
    }
    particles.push(new Particle(x, y, radius, color));
  }
}
init();

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  c.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    //sending particles array in order to check particle collision
    particle.update(particles);
  });
}

animate();

function rotate(velocity, angle) {
  const rotatedVelocity = {
    x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
    y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle),
  };
  return rotatedVelocity;
}
