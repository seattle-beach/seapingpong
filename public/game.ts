'use strict';

class PingPong
{
    private winCondition = 11;
    private winDelta = 2;

    public teams = [{
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

    constructor() {
        this.reset();
    };

    public updateTeam(idx, newTeamVal) {
        this.teams[idx].score = newTeamVal.score;
        this.teams[idx].players = newTeamVal.players;
        this.teams[idx].id = newTeamVal.id;
        this.teams[idx].serving = newTeamVal.serving;
        this.teams[idx].winner = newTeamVal.winner;
    }

    public gameOver() {
        return this.teams[0].winner || this.teams[1].winner;
    }

    public totalScore() {
        return this.teams[0].score + this.teams[1].score;
    }

    public diffScore() {
        return Math.abs(this.teams[0].score - this.teams[1].score);
    }

    public maxScore() {
        return Math.max(this.teams[0].score, this.teams[1].score);
    }

    public updateServing() {
        if (this.teams[0].score >= 10 && this.teams[1].score >= 10)
        {
            var teamAServes = (this.totalScore() & 1) == 0;
        } else {
            var teamAServes = (this.totalScore() & 2) == 0;
        }

        this.teams[0].serving = teamAServes;
        this.teams[1].serving = !teamAServes;
    }

    public reset() {
        Array.prototype.forEach.call(this.teams, function (t, idx) {
            t.score = 0;
            t.serving = false;
            t.winner = false;
        });

        this.updateServing();
    }

    public scorePoint(teamIdx, numPoints) {
        if (this.gameOver())
        {
            return;
        }

        this.teams[teamIdx].score += numPoints;

        if ((this.maxScore() >= this.winCondition) && (this.diffScore() >= this.winDelta))
        {
            this.teams[teamIdx].winner = true;
            return;
        }

        this.updateServing();
    }

    public handleButtonPress(btn_id, duration) {
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
    }
}

// Export node module.
module.exports = PingPong;