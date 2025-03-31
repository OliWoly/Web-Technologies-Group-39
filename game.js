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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(dartboardImage, dartboardX, dartboardY, dartboardW, dartboardH);
}

function calculateScore(x, y, dartboardCenterX, dartboardCenterY) {
    // Angle Discriptor for visualisation.
    //                          90°
    //                           |
    //      -180°/180°      <-- -+- -->         0°
    //                           |
    //                         -90°

    // Still a total range of 360°. 
    // Might change to constant offset so that top is 0° and circles to 360 rather than 180.

    // Offset with the location of the dartboard.
    // converts from radians to °.
    angle = (Math.atan2(dartboardCenterY - y, x - dartboardCenterX) * 180) / Math.PI;
    distance = Math.sqrt((x - dartboardCenterX) ** 2 + (y - dartboardCenterY) ** 2);
    

    // Each scoring "zone" is 1/20th of the board.
    // 360/20 = 18°
    // First "zone" - 20, is centered meaning its not 90 + 18, its:
    // 90 - 9, 90 + 9, total angle = 18°.

    // angle based
    base = 20;
    // distance based
    mult = 1;

    // Angle Calculation
    {
        if (angle <= 99 && angle > 81){
            base = 20;
        }
        if (angle <= 81 && angle > 63){
            base = 1;
        }
        if (angle <= 63 && angle > 45){
            base = 18;
        }
        if (angle <= 45 && angle > 27){
            base = 4;
        }
        if (angle <= 27 && angle > 9){
            base = 13;
        }
        if (angle <= 9 && angle > -9){
            base = 6;
        }
        if (angle <= -9 && angle > -27){
            base = 10;
        }
        if (angle <= -27 && angle > -45){
            base = 15;
        }
        if (angle <= -45 && angle > -63){
            base = 2;
        }
        if (angle <= -63 && angle > -81){
            base = 17;
        }
        if (angle <= -81 && angle > -99){
            base = 3;
        }
        if (angle <= -99 && angle > -117){
            base = 19;
        }
        if (angle <= -117 && angle > -135){
            base = 7;
        }
        if (angle <= -135 && angle > -153){
            base = 16;
        }
        if (angle <= -153 && angle > -171){
            base = 8;
        }
        if (angle <= -171 && angle > 171){
            base = 11;
        }
        if (angle <= 171 && angle > 153){
            base = 14;
        }
        if (angle <= 153 && angle > 135){
            base = 9;
        }
        if (angle <= 135 && angle > 117){
            base = 12;
        }
        if (angle <= 117 && angle > 99){
            base = 5;
        }
    }
    
    score += base * mult
    console.log(base);
    scoreElement.textContent = score;
    
}

// handle clicks
function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const dartboardCenterX = dartboardX + (dartboardW/2);
    const dartboardCenterY = dartboardY + (dartboardH/2);

    calculateScore(x, y, dartboardCenterX, dartboardCenterY);

    changeScoreColourOnScore();
    
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
