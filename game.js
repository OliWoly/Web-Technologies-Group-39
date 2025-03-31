const canvas = document.getElementById('dartboard');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
let score = 0;

// Set initial position for dartboard
// for or intents and purposes, use width as diameter..
// since its a circle it will stay the same no matter what, no adjustments should be made.
let dartboardW = 300;
let dartboardH = 300;

let dartboardX = (canvas.width / 2) - (dartboardW/2);  // Adjust based on image size
let dartboardY = (canvas.height / 2) - (dartboardH/2); 

// Load dartboard image
const dartboardImage = new Image();
dartboardImage.src = 'dartboard.png';

dartboardImage.onload = () => {
    drawDartboard();
};

// Changes the colour of the score text to red breifly when scoring
function changeScoreColourOnScore() {
    let initial = [255, 0, 0];
    let final = [...initial];
    let steps = 30;
    let stepSize = 255 / steps;
    let currentStep = 0;

    function updateColor() {
        if (currentStep >= steps) {
            return; // Stop if done
        }

        final[0] -= stepSize;
        final[0] = Math.max(final[0], 0);
        scoreElement.style.color = `rgb(${Math.round(final[0])}, ${final[1]}, ${final[2]})`;

        currentStep++;
        requestAnimationFrame(updateColor);
    }
    requestAnimationFrame(updateColor);
}


function drawDartboard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas before drawing
    ctx.drawImage(dartboardImage, dartboardX, dartboardY, dartboardW, dartboardH);
}

function calculateScore(x, y) {
    x = x;
    y = y;

    angle = (Math.atan2(y + (dartboardX), x + (dartboardY)) * 180) / Math.PI;

    console.log(angle);
}

// handle clicks
function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    changeScoreColourOnScore();

    // Calculate distance from dartboard center
    const dartboardCenterX = dartboardX + (dartboardW/2); // Middle of the dartboard
    const dartboardCenterY = dartboardY + (dartboardH/2); 
    const distance = Math.sqrt((x - dartboardCenterX) ** 2 + (y - dartboardCenterY) ** 2);

    calculateScore(x, y);
    
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

    // Currently magic numbers, figure out how to use variables for this.
    if (dartboardX + dartboardW > 700){
        dartboardX = 700 - dartboardW;
    }
    if (dartboardY + dartboardH > 800){
        dartboardY = 800 - dartboardH;
    }
    if (dartboardX < 0){
        dartboardX = 0;
    }
    if (dartboardY < 0){
        dartboardY = 0;
    }


    drawDartboard();
}

canvas.addEventListener('click', handleClick);
document.addEventListener('keydown', moveDartboard);

// Initialize game
dartboardImage.onload = () => drawDartboard();
