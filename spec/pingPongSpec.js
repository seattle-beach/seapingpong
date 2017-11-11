function test_aServes(pp) {
    expect(pp.teams[0].serving).toBe(true);
    expect(pp.teams[1].serving).toBe(false);
}
function test_bServes(pp) {
    expect(pp.teams[0].serving).toBe(false);
    expect(pp.teams[1].serving).toBe(true);
}

describe("The PingPong app", function() {
    var PingPong = require('../public/game');
    it("should initialize to a blank game", function() {
        var pp = new PingPong.Game();
        expect(pp.teams.length).toBe(2);
        expect(pp.totalScore()).toBe(0);
    });

    it("team a should start serving", function() {
        var pp = new PingPong.Game();
        test_aServes(pp);
    });

    it("should declare win condition points the winner", function() {
        var pp = new PingPong.Game();
        pp.scorePoint(0, pp.winCondition);
        expect(pp.teams[0].winner).toBe(true);
        expect(pp.teams[1].winner).toBe(false);
    });

    it("should not declare win condition if not exceeding the delta", function() {
        var pp = new PingPong.Game();
        pp.scorePoint(0, pp.winCondition - 1);
        pp.scorePoint(1, pp.winCondition - 1);

        expect(pp.teams[0].winner).toBe(false);
        expect(pp.teams[1].winner).toBe(false);

        pp.scorePoint(0, 1);

        expect(pp.teams[0].winner).toBe(false);
        expect(pp.teams[1].winner).toBe(false);

        pp.scorePoint(0, 1);

        expect(pp.teams[0].winner).toBe(true);
        expect(pp.teams[1].winner).toBe(false);
    });

    it("should not increase the score after a winner", function() {
        var pp = new PingPong.Game();

        pp.scorePoint(0, pp.winCondition);
        expect(pp.teams[0].winner).toBe(true);
        expect(pp.teams[1].winner).toBe(false);

        pp.scorePoint(0, 1);
        expect(pp.totalScore()).toBe(pp.winCondition);
        pp.scorePoint(1, 1);
        expect(pp.totalScore()).toBe(pp.winCondition);

    });

    it("should alternate who serves every 2 points", function() {
        var pp = new PingPong.Game();

        test_aServes(pp);
        pp.scorePoint(0, 1);
        test_aServes(pp);
        pp.scorePoint(0, 1);

        test_bServes(pp);
        pp.scorePoint(0, 1);
        test_bServes(pp);
        pp.scorePoint(0, 1);

        test_aServes(pp);
        pp.scorePoint(1, 1);
        test_aServes(pp);
        pp.scorePoint(1, 1);

        test_bServes(pp);
        pp.scorePoint(1, 1);
        test_bServes(pp);
        pp.scorePoint(1, 1);

        test_aServes(pp);
        pp.scorePoint(0, 1);
        test_aServes(pp);
        pp.scorePoint(1, 1);

        test_bServes(pp);
        pp.scorePoint(1, 1);
        test_bServes(pp);
        pp.scorePoint(0, 1);

        test_aServes(pp);
        pp.scorePoint(0, 1);
        test_aServes(pp);
        pp.scorePoint(0, 1);

        test_bServes(pp);
        pp.scorePoint(0, 1);
        test_bServes(pp);
        pp.scorePoint(0, 1);

        test_aServes(pp);
        pp.scorePoint(1, 1);
        test_aServes(pp);
        pp.scorePoint(0, 1);

        expect(pp.teams[0].winner).toBe(true);
        expect(pp.teams[1].winner).toBe(false);
    });

    it("should implement deuce rules", function() {
        var pp = new PingPong.Game();
        // 10 : 10
        pp.scorePoint(0, 10);
        pp.scorePoint(1, 10);
        test_aServes(pp);
        expect(pp.teams[0].winner).toBe(false);
        expect(pp.teams[1].winner).toBe(false);

        // 11 : 10
        pp.scorePoint(0, 1);
        test_bServes(pp);
        expect(pp.teams[0].winner).toBe(false);
        expect(pp.teams[1].winner).toBe(false);

        // 11 : 11
        pp.scorePoint(1, 1);
        test_aServes(pp);
        expect(pp.teams[0].winner).toBe(false);
        expect(pp.teams[1].winner).toBe(false);

        // 12 : 11
        pp.scorePoint(0, 1);
        test_bServes(pp);
        expect(pp.teams[0].winner).toBe(false);
        expect(pp.teams[1].winner).toBe(false);

        // 12 : 12
        pp.scorePoint(1, 1);
        test_aServes(pp);
        expect(pp.teams[0].winner).toBe(false);
        expect(pp.teams[1].winner).toBe(false);

        // 13 : 12
        pp.scorePoint(0, 1);
        test_bServes(pp);
        expect(pp.teams[0].winner).toBe(false);
        expect(pp.teams[1].winner).toBe(false);

        // 13 : 12
        pp.scorePoint(0, 1);
        expect(pp.teams[0].winner).toBe(true);
        expect(pp.teams[1].winner).toBe(false);
    });

    it("supports scoring history", function() {
        var pp = new PingPong.Game();
        // 3 : 0
        pp.scorePoint(0, 1);
        pp.scorePoint(0, 1);
        pp.scorePoint(0, 1);

        // 3 : 1
        pp.scorePoint(1, 1);

        // 6 : 1
        pp.scorePoint(0, 1);
        pp.scorePoint(0, 1);
        pp.scorePoint(0, 1);

        // 6 : 4
        pp.scorePoint(1, 1);
        pp.scorePoint(1, 1);
        pp.scorePoint(1, 1);

        // 9 : 4
        pp.scorePoint(0, 1);
        pp.scorePoint(0, 1);
        pp.scorePoint(0, 1);

        // 9 : 7
        pp.scorePoint(1, 1);
        pp.scorePoint(1, 1);
        pp.scorePoint(1, 1);

        // 11 : 7
        pp.scorePoint(0, 1);
        pp.scorePoint(0, 1);

        expect(pp.totalScore()).toBe(18);
        expect(pp.scores.length).toBe(18);
        var expectedScores = [0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0];
        for(var i = 0; i < 18; i++) {
            expect(pp.scores[i]).toBe(expectedScores[i]);
        }
    });

    it("supports scoring history removal", function() {
        var pp = new PingPong.Game();
        pp.scorePoint(0, 5);
        pp.scorePoint(1, 2);
        pp.scorePoint(0, 5);
        pp.scorePoint(1, 2);
        pp.scorePoint(1, -2);
        expect(pp.gameOver()).toBe(false);
        pp.scorePoint(0, 1);
        expect(pp.gameOver()).toBe(true);

        expect(pp.totalScore()).toBe(13);
        expect(pp.scores.length).toBe(13);
        var expectedScores = [0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0];
        for(var i = 0; i < 13; i++) {
            expect(pp.scores[i]).toBe(expectedScores[i]);
        }
    });
});