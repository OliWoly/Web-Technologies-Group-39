const canvas = document.getElementById('dartboard');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
let score = 0;

// Set initial position for dartboard
let dartboardW = 300;
let dartboardH = 300;

let dartboardX = (canvas.width / 2) - (dartboardW/2);  // Adjust based on image size
let dartboardY = (canvas.height / 2) - (dartboardH/2); // Adjust based on image size

// Load dartboard image
const dartboardImage = new Image();
dartboardImage.src = 'dartboard.jpg';

dartboardImage.onload = () => {
    drawDartboard(); // Draw dartboard when image is loaded
};

// Draw dartboard at the current position
function drawDartboard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing
    ctx.drawImage(dartboardImage, dartboardX, dartboardY, dartboardW, dartboardH);  // You can adjust the size
}

// Handle click event
function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Calculate distance from dartboard center
    const dartboardCenterX = dartboardX + (dartboardW/2); // Middle of the dartboard image
    const dartboardCenterY = dartboardY + (dartboardH/2); // Middle of the dartboard image
    const distance = Math.sqrt((x - dartboardCenterX) ** 2 + (y - dartboardCenterY) ** 2);
    
    // Assign score based on distance
    if (distance < 20) {
        score += 100;
    } else if (distance < 40) {
        score += 80;
    } else if (distance < 60) {
        score += 60;
    } else if (distance > dartboardW/2){
        score += 0;
    }


    scoreElement.textContent = score;
}

// Move dartboard with arrow keys
function moveDartboard(event) {
    const step = 10; // Speed of movement

    switch(event.key) {
        case 'ArrowUp':
            dartboardY -= step;
            break;
        case 'ArrowDown':
            dartboardY += step;
            break;
        case 'ArrowLeft':
            dartboardX -= step;
            break;
        case 'ArrowRight':
            dartboardX += step;
            break;
    }

    // Prevent the dartboard from going out of bounds
    dartboardX = Math.max(0, Math.min(canvas.width - 100, dartboardX)); // Ensure within canvas width
    dartboardY = Math.max(0, Math.min(canvas.height - 100, dartboardY)); // Ensure within canvas height

    drawDartboard();
}

// Add event listeners
canvas.addEventListener('click', handleClick);
document.addEventListener('keydown', moveDartboard);

// Initialize game
dartboardImage.onload = () => drawDartboard();
