const canvas = document.getElementById('dotCanvas');
const context = canvas.getContext('2d');

const size = 400;
canvas.width = size;
canvas.height = size;

let dots = [];
const dotSpeed = 2; // Speed at which dots move

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawDots() {
    for (const dot of dots) {
        context.beginPath();
        context.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        context.fillStyle = '#fff'; // Default color for dots
        context.fill();
    }
}

function drawLines(highlightedDot = null) {
    context.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    drawDots(); // Draw dots first

    for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
            context.strokeStyle = 'rgba(136, 136, 136, 0.1)'; // Default line color

            context.beginPath();
            context.moveTo(dots[i].x, dots[i].y);
            context.lineTo(dots[j].x, dots[j].y);
            context.stroke();
        }
    }
}

function findHoveredDot(mouseX, mouseY) {
    const hoverRadiusMultiplier = 1.5; // Increase this value to make the hover area larger
    return dots.find(dot => {
        const dx = mouseX - dot.x;
        const dy = mouseY - dot.y;
        return Math.sqrt((dx * dx + dy * dy)) <= dot.radius * hoverRadiusMultiplier;
    });
}

function handleMouseMove(event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const hoveredDot = findHoveredDot(mouseX, mouseY);
    drawLines(hoveredDot);

    // Pause movement of hovered dots
    for (const dot of dots) {
        dot.isHovered = dot === hoveredDot;
    }
}

function updateDots() {
    for (const dot of dots) {
        if (!dot.isHovered) { // Only move dots that are not hovered
            dot.x += dot.dx;
            dot.y += dot.dy;

            // Bounce off edges
            if (dot.x + dot.radius > canvas.width || dot.x - dot.radius < 0) {
                dot.dx *= -1; // Reverse direction
            }
            if (dot.y + dot.radius > canvas.height || dot.y - dot.radius < 0) {
                dot.dy *= -1; // Reverse direction
            }
        }
    }
}

function animate() {
    updateDots();
    drawLines(); // No need to pass highlightedDot here
    requestAnimationFrame(animate); // Continue animation
}

function initializeDots() {
    const numDots = 10; // Number of dots
    dots = [];
    // const radius = getRandomInt(1, 10);
    const radius = 5; // Fixed radius for each dot

    for (let i = 0; i < numDots; i++) {
        const x = getRandomInt(radius, canvas.width - radius);
        const y = getRandomInt(radius, canvas.height - radius);
        const dx = getRandomInt(-dotSpeed, dotSpeed); // Random speed in x direction
        const dy = getRandomInt(-dotSpeed, dotSpeed); // Random speed in y direction
        dots.push({ x, y, radius, dx, dy, isHovered: false }); // Added isHovered property
    }
}

// Initial canvas setup and drawing
initializeDots();
animate(); // Start animation

// Add mouse move event listener
canvas.addEventListener('mousemove', handleMouseMove);
