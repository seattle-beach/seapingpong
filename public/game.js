'use strict';

function PingPong() {
    this.winCondition = 11;
    this.winDelta = 2;

    this.teams = [{
        score: 0,
        players: 0,
        id: 'Team A',
        serving: false,
        winner: false
    }, {
        score: 0,
        players: 0,
        id: 'Team B',
        serving: false,
        winner: false
    }];

    this.totalScore = function() {
        return  this.teams[0].score + this.teams[1].score;
    };

    this.diffScore = function() {
        return Math.abs(this.teams[0].score - this.teams[1].score);
    };

    this.maxScore = function() {
        return Math.max(this.teams[0].score, this.teams[1].score);
    };

    this.updateServing = function() {
        if (this.teams[0].score >= 10 && this.teams[1].score >= 10)
        {
            var teamAServes = (this.totalScore() & 1) == 0;
        } else {
            var teamAServes = (this.totalScore() & 2) == 0;
        }

        this.teams[0].serving = teamAServes;
        this.teams[1].serving = !teamAServes;
    };

    this.reset = function () {
        Array.prototype.forEach.call(this.teams, function (t, idx) {
            t.score = 0;
            t.serving = false;
            t.winner = false;
        });

        this.updateServing();
    };

    this.scorePoint = function(teamIdx, numPoints) {
        this.teams[teamIdx].score += numPoints;

        if ((this.maxScore() >= this.winCondition) && (this.diffScore() >= this.winDelta))
        {
            this.teams[teamIdx].winner = true;
            return;
        }

        this.updateServing();
    };

    this.handleButtonPress = function(btn_id, duration) {
        if (duration < 50) {
            return;
        }

        if (btn_id == "reset") {
            this.reset();
            return;
        }

        let points = 1;
        if (duration > 500) {
            points = -1;
        }

        this.scorePoint(btn_id == "a" ? 0 : 1, points);
    };

    this.reset();
};

// Export node module.
module.exports = PingPong;