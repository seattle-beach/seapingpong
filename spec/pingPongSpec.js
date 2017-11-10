function aServes(pp) {
    expect(pp.teams[0].serving).toBe(true);
    expect(pp.teams[1].serving).toBe(false);
}
function bServes(pp) {
    expect(pp.teams[0].serving).toBe(false);
    expect(pp.teams[1].serving).toBe(true);
}

describe("The PingPong app", function() {
    var PingPong = require('../public/game');
    it("should initialize to a blank game", function() {
        var pp = new PingPong();
        expect(pp.teams.length).toBe(2);
        expect(pp.totalScore()).toBe(0);
    });

    it("team a should start serving", function() {
        var pp = new PingPong();
        expect(pp.teams[0].serving).toBe(true);
        expect(pp.teams[1].serving).toBe(false);
    });

    it("should declare win condition points the winner", function() {
        var pp = new PingPong();
        pp.scorePoint(0, pp.winCondition);
        expect(pp.teams[0].winner).toBe(true);
        expect(pp.teams[1].winner).toBe(false);
    });

    it("should not declare win condition if not exceeding the delta", function() {
        var pp = new PingPong();
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

    it("should alternate who serves every 2 points", function() {
        var pp = new PingPong();

        aServes(pp);
        pp.scorePoint(0, 1);
        aServes(pp);
        pp.scorePoint(0, 1);

        bServes(pp);
        pp.scorePoint(0, 1);
        bServes(pp);
        pp.scorePoint(0, 1);

        aServes(pp);
        pp.scorePoint(1, 1);
        aServes(pp);
        pp.scorePoint(1, 1);

        bServes(pp);
        pp.scorePoint(1, 1);
        bServes(pp);
        pp.scorePoint(1, 1);

        aServes(pp);
        pp.scorePoint(0, 1);
        aServes(pp);
        pp.scorePoint(1, 1);

        bServes(pp);
        pp.scorePoint(1, 1);
        bServes(pp);
        pp.scorePoint(0, 1);

        aServes(pp);
        pp.scorePoint(0, 1);
        aServes(pp);
        pp.scorePoint(0, 1);

        bServes(pp);
        pp.scorePoint(0, 1);
        bServes(pp);
        pp.scorePoint(0, 1);

        aServes(pp);
        pp.scorePoint(1, 1);
        aServes(pp);
        pp.scorePoint(0, 1);

        expect(pp.teams[0].winner).toBe(true);
        expect(pp.teams[1].winner).toBe(false);
    });
});