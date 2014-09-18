describe("It tests if sClass function exists in window", function() {

    it("should exist in window", function() {

        expect(typeof window.sClass).toEqual("function");

    });

});

describe("It tests if sClass can create class", function() {

    var F = null;

    beforeEach(function() {

        F = sClass();

        F.prototype.$constructor = function() {
            this.a = "test";
        };

        F.prototype.getA = function() {
            return this.a;
        };

    });

    it("should create construct function", function() {

        expect(typeof F).toEqual("function");

    });

    it("should correctly create instance of class", function() {
        var f = new F();

        expect(typeof f).toEqual("object");
        expect(typeof f.getA).toEqual("function");
        expect(f.getA()).toEqual("test");

    });

});