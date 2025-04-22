const canvas = document.getElementById('dartboard');
const ctx = canvas.getContext('2d');
canvas.addEventListener('click', handleClick);


// Value Initialisation
{
    // UI
    {
        // Total score achieved.
        var score = 0;
        var scoreElement = document.getElementById('score');
        var scoreColour = [0, 0, 0];

        // Numerical representation of the shots left. Will be later converted to a visual representation with a function.
        var shotsLeftInternal = 3;
        var shotsLeftElement = document.getElementById('shotsLeft');

        // Score only in the current round.
        var roundScore = 0;
        var roundScoreElement = document.getElementById('roundScore');
        var roundScoreColour = [0, 0, 0];

        // Reset Button
        resetButton = false;
        var resetButtonElement = document.getElementById('resetBtn');
        resetButtonElement.addEventListener("click", resetRoundScore);

        // Initial
        var initialButtonElement = document.getElementById('initialBtn');
        initialButtonElement.addEventListener("click", changeInitial);
        var initial = "";
    }

    // Game
    {
        // Set initial position for dartboard
        // for all intents and purposes, use width as diameter..
        // since its a circle it will stay the same no matter what, no adjustments should be made.
        var roundNumber = 1;
        
        var dartboardW = 300;
        var dartboardH = 300;
        var speed = 7;
        var direction = 30;

        var dartboardX = (canvas.width / 2) - (dartboardW/2);  // Adjust based on image size
        var dartboardY = (canvas.height / 2) - (dartboardH/2); 

        // Load dartboard image
        var dartboardImage = new Image();
        dartboardImage.src = 'dartboard.png';
    }

    // Dart Image
    {
        // Create an imagine to use as the shots left indicator
        var dart1Image = new Image(16, 16);
        dart1Image.src = 'dart.256x256.png';

        var dart2Image = new Image(32, 16);
        dart2Image.src = 'dart.512x256.png';

        var dart3Image = new Image(48, 16);
        dart3Image.src = 'dart.768x256.png';
    }

    // Sound Effects
    {
        // Have to be seperate functions instead of playing a predefined variable
        // this allows them to overlapo each other without stopping the current one from playing.

        function playMiss() {
            new Audio("miss.wav").play();
        }

        function playShoot1() {
            new Audio("shoot1.wav").play();
        }
        
        function playShoot2x() {
            new Audio("shoot2.wav").play();
        }
        
        function playShoot3x() {
            new Audio("shoot3.wav").play();
        }
        
        function playBullseye() {
            new Audio("bullseye.wav").play();
        }
        
        function playReset() {
            new Audio("reset.wav").play();
        }
        
        function playDartboardBounce() {
            new Audio("bounce.wav").play();
        }
    }

    // Leaderboard
    {
        // Will save Each round.
        // [initial, score, round, shotsleft, time]
        var rounds = [
            []
        ]
    }
}

// Changes the colour of the score text to red breifly when scoring
function changeScoreColour(colour) {
    // Change to red
    scoreColour = colour;
    colourString = "rgb(" + scoreColour.toString() + ")";
    scoreElement.style.color = colourString;
}

function changeRoundScoreColour(colour) {
    // Change to red
    roundScoreColour = colour;
    colourString = "rgb(" + roundScoreColour.toString() + ")";
    roundScoreElement.style.color = colourString;
}

function fadeColourToBlack(color){
    color[0] -= 10;
    if (color[0] < 0){
        color[0] = 0;
    }

    color[1] -= 10;
    if (color[1] < 0){
        color[1] = 0;
    }

    color[2] -= 10;
    if (color[2] < 0){
        color[2] = 0;
    }
}

function applyScoreColour(){
    colourString = "rgb(" + scoreColour.toString() + ")";
    scoreElement.style.color = colourString;

    colourString = "rgb(" + roundScoreColour.toString() + ")";
    roundScoreElement.style.color = colourString;
}


function draw() {
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
    // **Might change to constant offset so that top is 0° and circles to 360 rather than 180.

    // Offset with the location of the dartboard.
    // converts from radians to °.
    angle = (Math.atan2(dartboardCenterY - y, x - dartboardCenterX) * 180) / Math.PI;
    distance = Math.sqrt((x - dartboardCenterX) ** 2 + (y - dartboardCenterY) ** 2);
    

    // Each scoring "zone" is 1/20th of the board.
    // 360/20 = 18°
    // First "zone" - 20, is centered meaning its not 90 + 18, its:
    // 90 - 9, 90 + 9, total angle = 18°. (81-99)

    // angle based
    base = 0;
    // distance based
    mult = 1;

    // Angle Calculation
    // Disgusting, massive but easiest to manage
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

    // Distance numbers
    {
        // Following information based on current image of dartboard at 300px diameter
        // (new one could be used but same proportions necessary)
        // Calculations should be done in % for consistency and ability to change size later.
        // Scoring area is only 80% of the total radius. 120px out vs 150px total.
        // Double scoring is 110 - 120. 73.334% - 80%
        // Triple scoring is 65 - 75. 43.334% - 50%
        // Double bull is 5 - 10.x. 0.0334% - 0.07%
        // Inside bullseye is 0 - 5, 0% - 0.0334%
    }

    // Distance Calculation
    {
        radius = dartboardH/2;

        // out of board
        if (distance > radius * 0.8){
            mult = 0;
        }
        // Double zone
        if (distance > (radius * 0.7334) && distance < (radius * 0.8)){
            mult = 2;
        }
        // Triple zone
        if (distance > (radius * 0.4334) && distance < (radius * 0.5)){
            mult = 3;
        }
        // Double Bull
        if (distance > (radius * 0.0334) && distance < (radius * 0.07)){
            base = 25;
            mult = 1;
        }
        // Bullseye
        if (distance < (radius * 0.0334)){
            base = 50;
            mult = 1;
        }
    }
    
    // Calculate score with given variables.
    score += base * mult;
    roundScoreToAdd = base * mult;

    // Flash if scored
    if (mult > 0){
        changeScoreColour([255, 0, 0]);


        if (shotsLeftInternal > 0){
            changeRoundScoreColour([255, 0, 0]);
        }
        else {
            changeRoundScoreColour([255, 255, 255]);
        }
    }
    else {
        changeScoreColour([255, 255, 255]);
        changeRoundScoreColour([255, 255, 255]);
    }

    // Add to total score.
    scoreElement.textContent = score;
    addScoreToRoundScore(roundScoreToAdd);
    
}

// Handle clicks
function handleClick(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const dartboardCenterX = dartboardX + (dartboardW/2);
    const dartboardCenterY = dartboardY + (dartboardH/2);

    playShoot1();
    calculateScore(x, y, dartboardCenterX, dartboardCenterY);
    // Count Shots
    shotsLeftInternal -= 1;
    convertShotsLeftElement();
}

function bounceOfWall(isVertical) {
    if (isVertical) {
        direction = 180 - direction; // Reflect angle horizontally
    } else {
        direction = -direction; // Reflect angle vertically
    }

    // Normalize direction to keep it between 0° and 360°
    if (direction < 0) {
        direction += 360;
    }
    if (direction >= 360) {
        direction -= 360;
    }
}


// Move dartboard with arrow keys
function bounceDartboard() {
    dartboardX += Math.cos(direction * Math.PI / 180) * speed;
    dartboardY += Math.sin(direction * Math.PI / 180) * speed;

    direction += Math.random();

    // Bounce off vertical walls (left/right)
    if (dartboardX + dartboardW >= canvas.width) {
        dartboardX = canvas.width - dartboardW;
        bounceOfWall(true); // Vertical bounce
    }
    if (dartboardX <= 0) {
        dartboardX = 0;
        bounceOfWall(true); // Vertical bounce
    }

    // Bounce off horizontal walls (top/bottom)
    if (dartboardY + dartboardH >= canvas.height) {
        dartboardY = canvas.height - dartboardH;
        bounceOfWall(false); // Horizontal bounce
    }
    if (dartboardY <= 0) {
        dartboardY = 0;
        bounceOfWall(false); // Horizontal bounce
    }

    draw();
}

// Converts internal value of shots left into a visual representation
function convertShotsLeftElement(){
    if (shotsLeftInternal == 3){
        //shotsLeftElement.textContent = "X X X";
        document.getElementById("shotsLeft").replaceWith(dart3Image);
    }
    if (shotsLeftInternal == 2){
        document.getElementById("shotsLeft").appendChild(dart2Image);
    }
    if (shotsLeftInternal == 1){
        document.getElementById("shotsLeft").appendChild(dart1Image);
    }
    if (shotsLeftInternal == 0){
        shotsLeftElement.textContent = "";
    }
}

function resetRoundScore(){
    // Play Sound
    playReset();

    // Add current stats to leaderboard.
    addLeaderboardEntry(initial, roundScore, roundNumber);

    roundNumber += 1;
    shotsLeftInternal = 3;
    roundScoreElement.textContent = 0;
    roundScore = 0;
    convertShotsLeftElement();

    console.log(rounds);
}

// Adds scored score to roundScore only if shotsLeft is more than 0.
function addScoreToRoundScore(scoreToAdd){
    if (shotsLeftInternal > 0){
        roundScore += scoreToAdd;
        roundScoreElement.textContent = roundScore;
    }
    
}

function addLeaderboardEntry(initial, score, round){
    const now = new Date();
    const time = now.toTimeString().slice(0, 8); 
    rounds.push([initial, score, round, shotsLeftInternal, time]);
}

function changeInitial(){
    initial = prompt("Enter Your Initial");
    applyInitial();
}

function applyInitial(){
    initialButtonElement.textContent = initial;
}



// Function for game running.
// main function
function update(){
    bounceDartboard();
    fadeColourToBlack(scoreColour);
    fadeColourToBlack(roundScoreColour);
    applyScoreColour();

    draw();
}   


// DO NOT TOUCH BENEATH
{
// NO CLUE HOW THIS IS WORKING BUT IT WORKS!
function gameloop(){
    update();
    requestAnimationFrame(update);
}



setInterval(update, 16);
// Initialize game
dartboardImage.onload = () => {
    draw();
    gameloop();
}
};
