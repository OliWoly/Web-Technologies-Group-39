var isLeaderboardLoaded = false;

class LeaderboardEntry{
    constructor(name, score, round, shotsLeft, time){
        this.name = name;
        this.score = score;
        this.round = round;
        this.shotsLeft = shotsLeft;
        this.time = time;
    }
}







function loadLeaderboard(){
    isLeaderboardLoaded = true;
    var leaderboardEntries = [];

    const scoresString = localStorage.getItem("Leaderboard");
    const scores = JSON.parse(scoresString);

    cleanLeaderboardData(scores);
    parseLeaderboardData(scores, leaderboardEntries);
    populateLeaderboardTable(leaderboardEntries);
}

// Clears empty arrays.
function cleanLeaderboardData(scores){
    for (i=scores.length-1; i >= 0; i--){
        if (scores[i].length < 1){
            scores.splice(i, 1);
        }
        else if (scores[i][0].length < 1){
            scores.splice(i, 1);
        }
    }
}

// Assigns all localStorage to leaderboard entry class.
function parseLeaderboardData(scores, leaderboardEntries){
    for (i=0; i < scores.length; i++){
        entry = new LeaderboardEntry(scores[i][0], scores[i][1], scores[i][2], scores[i][3], scores[i][4]);
        leaderboardEntries.push(entry);
    }
}

function populateLeaderboardTable(leaderboardEntries) {
    const tableBody = document.querySelector("#leaderboardTable tbody");
    tableBody.innerHTML = "";


    // For each entry create a new row in the table by modifying the html.
    leaderboardEntries.forEach(entry => {
        const row = document.createElement("tr");

        // actual row data with each field here being a table heading.
        row.innerHTML = `
            <td>${entry.name}</td>
            <td>${entry.score}</td>
            <td>${entry.round}</td>
            <td>${entry.shotsLeft}</td>
            <td>${entry.time}</td>
        `;

        tableBody.appendChild(row);
    });
}

function update(){
    if (isLeaderboardLoaded == false){
        loadLeaderboard();
    }
}

// Dont Touch
function main(){
    update();
}
// un-comment if want to run as a loop.
//setInterval(update, 16);
main();