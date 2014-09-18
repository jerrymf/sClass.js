describe("It tests if sClass function exists in window", function() {

    it("should exist in window", function() {

        expect(typeof window.sClass).toEqual("function");

    });

});

describe("It tests if sClass can create class", function() {

    var F = null;

    beforeEach(function() {
        F = sClass();

        F.prototype.method = function() {
            return 1;
        };
    });

    it("should create construct function", function() {

        expect(typeof F).toEqual("function");

    });

    it("should create instance of class", function() {
        var f = new F();

        expect(typeof f).toEqual("object");
        expect(typeof f.method).toEqual("function");
        expect(f.method()).toEqual(1);

    });

});