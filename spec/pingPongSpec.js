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
});