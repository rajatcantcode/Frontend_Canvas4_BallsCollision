// Initial Setup
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;


// Variables
const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
};

const colors = [
    {r: 51, g: 99, b: 252}, 
    {r: 77, g: 57, b: 206}, 
    // {r: 0, g: 189, b: 255}, 
];

// Event Listeners
addEventListener('mousemove', event => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;

    init();
});


// Utility Functions
function randomIntFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}

function distance(x1, y1, x2, y2) {
    const xDist = x2 - x1;
    const yDist = y2 - y1;

    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

function rotateVelocities(velocity, theta) {
    const rotatedVelocity = {
        x: velocity.x * Math.cos(theta) - velocity.y * Math.sin(theta),
        y: velocity.x * Math.sin(theta) + velocity.y * Math.cos(theta)
    };
    return rotatedVelocity;
}


// Objects
function Particle(x, y, radius, rgb) {
    this.x = x;
    this.y = y;
    this.velocity = {
        x: (Math.random() - 0.5) * 3,
        y: (Math.random() - 0.5) * 3
    };
    this.radius = radius;
    this.mass = 1;
    this.opacity = 0;
    this.r = rgb.r;
    this.g = rgb.g;
    this.b = rgb.b;

    this.update = particles => {
        this.draw();

        for (let i = 0; i < particles.length; i++) {
            const otherParticle = particles[i];
            if (this.x === otherParticle.x) continue;

            if (distance(this.x, this.y, otherParticle.x, otherParticle.y) - this.radius * 2 < 0) {

                const res = {
                    x: this.velocity.x - otherParticle.velocity.x,
                    y: this.velocity.y - otherParticle.velocity.y
                };

                if (res.x * (otherParticle.x - this.x) + res.y * (otherParticle.y - this.y) >= 0) {

                    const m1 = this.mass;
                    const m2 = otherParticle.mass;
                    const theta = -Math.atan2(otherParticle.y - this.y, otherParticle.x - this.x);

                    const rotatedVelocity1 = rotateVelocities(this.velocity, theta);
                    const rotatedVelocity2 = rotateVelocities(otherParticle.velocity, theta);

                    const swapVelocity1 = { x: rotatedVelocity1.x * (m1 - m2) / (m1 + m2) + rotatedVelocity2.x * 2 * m2 / (m1 + m2), y: rotatedVelocity1.y };
                    const swapVelocity2 = { x: rotatedVelocity2.x * (m1 - m2) / (m1 + m2) + rotatedVelocity1.x * 2 * m2 / (m1 + m2), y: rotatedVelocity2.y };

                    const u1 = rotateVelocities(swapVelocity1, -theta);
                    const u2 = rotateVelocities(swapVelocity2, -theta);

                    this.velocity.x = u1.x;
                    this.velocity.y = u1.y;
                    otherParticle.velocity.x = u2.x;
                    otherParticle.velocity.y = u2.y;
                }
            }
        }

        if (distance(this.x, this.y, mouse.x, mouse.y) - this.radius * 2 < 100 && this.opacity <= 0.2) {
            this.opacity += 0.01;
        } else if (this.opacity > 0) {
            this.opacity -= 0.01;
        }

        if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0)
            this.velocity.x = -this.velocity.x;

        if (this.y + this.radius >= canvas.height || this.y - this.radius <= 0)
            this.velocity.y = -this.velocity.y;

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    };

    this.draw = () => {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.strokeStyle = `rgba(${this.r}, ${this.g}, ${this.b}, 1)`;
        c.stroke();
        c.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity}`;
        c.fill();
        c.closePath();
    };
}


// Implementation
let particles;

function init() {
    particles = [];
    let radius = 15;

    for (let i = 0; i < 130; i++) {
        let x = randomIntFromRange(radius, innerWidth - radius);
        let y = randomIntFromRange(radius, innerHeight - radius);

        if (particles.length >= 1) {
            for (let j = 0; j < particles.length; j++) {
                if (distance(x, y, particles[j].x, particles[j].y) - radius * 2 < 0) {
                    x = randomIntFromRange(radius, innerWidth - radius);
                    y = randomIntFromRange(radius, innerHeight - radius);

                    j = -1;
                    continue;

                }
            }
        }

        particles.push(new Particle(x, y, radius, randomColor(colors)));
    }
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update(particles);
    });
}



init();
animate();