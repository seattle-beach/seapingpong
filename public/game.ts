'use strict';

export module PingPong {

    export class Team {
        public score: number = 0;
        public players: number = 0;
        public id: string = '';
        public serving: boolean = false;
        public winner: boolean = false;

        constructor(id: string) {
            this.id = id;
        }
    }

    export class Game {
        private winCondition: number = 11;
        private winDelta: number = 2;
        public scores: number[] = [];

        public teams: Team[] = [
            new Team('Team A'),
            new Team('Team B')
        ];

        constructor() {
            this.reset();
        }

        public updateTeam(idx: number, newTeamVal: Team) {
            this.teams[idx].score = newTeamVal.score;
            this.teams[idx].players = newTeamVal.players;
            this.teams[idx].id = newTeamVal.id;
            this.teams[idx].serving = newTeamVal.serving;
            this.teams[idx].winner = newTeamVal.winner;
        }

        public gameOver(): boolean {
            return this.teams[0].winner || this.teams[1].winner;
        }

        public totalScore(): number {
            return this.teams[0].score + this.teams[1].score;
        }

        public diffScore(): number {
            return Math.abs(this.teams[0].score - this.teams[1].score);
        }

        public maxScore(): number {
            return Math.max(this.teams[0].score, this.teams[1].score);
        }

        public updateServing() {
            if (this.teams[0].score >= 10 && this.teams[1].score >= 10) {
                let teamAServes = (this.totalScore() & 1) == 0;
            } else {
                let teamAServes = (this.totalScore() & 2) == 0;
            }

            this.teams[0].serving = teamAServes;
            this.teams[1].serving = !teamAServes;
        }

        public reset() {
            Array.prototype.forEach.call(this.teams, function (t) {
                t.score = 0;
                t.serving = false;
                t.winner = false;
            });

            this.scores = [];
            this.updateServing();
        }

        public scorePoint(teamIdx: number, numPoints: number) {
            if (this.gameOver()) {
                return;
            }

            if (numPoints > 0) {
                for (let i = 0; i < numPoints; i++) {
                    this.teams[teamIdx].score += 1;
                    this.scores.push(teamIdx);
                }
            } else {
                for(let i = this.scores.length, p = 0; i >= 0 && p < Math.abs(numPoints); i--){
                    if (this.scores[i] == teamIdx) {
                        this.teams[teamIdx].score -= 1;
                        delete this.scores[i];
                        p++;
                    }
                }

                this.scores = this.scores.filter(i => i != null);
            }

            if ((this.maxScore() >= this.winCondition) && (this.diffScore() >= this.winDelta)) {
                this.teams[teamIdx].winner = true;
                return;
            }

            this.updateServing();
        }

        public handleButtonPress(btn_id: string, duration: number) {
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
}

// Export node module.
export = PingPong;