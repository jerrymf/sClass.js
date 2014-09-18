describe("It tests if $Class function exists in window", function() {

    it("should exist in window", function() {

        expect(typeof window.$Class).toEqual("function");

    });

});

describe("It tests if $Class can create class", function() {

    var F = null;

    beforeEach(function() {

        F = $Class();

        F.prototype.$constructor = function(test) {
            this.test = test || "test";
        };

        F.prototype.getTest = function() {
            return this.test;
        };

    });

    it("should create construct function", function() {

        expect(typeof F).toEqual("function");

    });

    it("should correctly create instance of class", function() {
        var f = new F();

        expect(typeof f).toEqual("object");
        expect(typeof f.getTest).toEqual("function");
        expect(f.getTest()).toEqual("test");

    });

    it("should correctly pass the parameter", function() {
        var f = new F("custom");

        expect(typeof f).toEqual("object");
        expect(typeof f.getTest).toEqual("function");
        expect(f.getTest()).toEqual("custom");
    })

    it("should throw an error", function() {

        expect(function() { var F = $Class(1); }).toThrow(new Error("$Class: I accept only object as argument."));

    });

});

describe("It tests if $Class can create singleton", function() {

    var F = null;

    beforeEach(function() {

        F = $Class( { singleton: true } );

        F.prototype.$constructor = function() {
            this.test = "test";
        };

        F.prototype.getTest = function() {
            return this.test;
        };

    });

    it("should create function", function() {

        expect(typeof F).toEqual("function");

    });

    it("should correctly create singleton", function() {

        expect( function() { var f = new F(); } ).toThrow(new Error("$Class: I am singleton. You can not call me this way. Use getInstance method to get referenced for object."));
        expect(typeof F.getInstance).toEqual("function");
        expect(typeof F.getInstance()).toEqual("object");
        expect(F.getInstance().getTest()).toEqual("test");

    });

});

describe("It tests if $Class can correctly perform inheritance", function() {

    var F = null;
    var F2 = null;

    beforeEach(function() {

        F = $Class();

        F.prototype.$constructor = function() {
            this.test1 = "test1-old";
            this.test2 = "test2-old";
        };

        F.prototype.getTest1 = function() {
            return this.test1;
        };

        F.prototype.getTest2 = function() {
            return this.test2;
        };

        F.prototype.obj = { a : 1 };

        F2 = $Class( { extending: F } );

        F2.prototype.getTest2 = function() {
            return "test2-new";
        };

    });

    it("should create functions", function() {

        expect(typeof F).toEqual("function");
        expect(typeof F2).toEqual("function");

    });

    it("should create instance of inherited class", function() {

        var f = new F();
        var f2 = new F2();

        expect(f2 instanceof F2).toEqual(true);
        expect(f instanceof F).toEqual(true);
        expect(typeof f2).toEqual("object");
        expect(typeof f2.getTest1).toEqual("function");
        expect(typeof f2.getTest2).toEqual("function");
        expect(f2.getTest1()).toEqual("test1-old");
        expect(f2.getTest2()).toEqual("test2-new");
        expect(f2.obj).toEqual(f.obj);

    })

});

describe("It tests if $Class can correctly perform $super", function() {

    var F = null;
    var F2 = null;

    beforeEach(function() {

        F = $Class();

        F.prototype.$constructor = function() {
            this.test1 = "test1-old";
            this.test2 = "test2-old";
        };

        F.prototype.getTest1 = function() {
            return this.test1;
        };

        F.prototype.getTest2 = function() {
            return this.test2;
        };

        F2 = $Class( { extending: F } );

        F2.prototype.$constructor = function() {
            this.$super();
            this.test2 = "test2-new";
        };

        F2.prototype.getTest2 = function() {
            return this.test2;
        };

    });

    it("should create functions", function() {

        expect(typeof F).toEqual("function");
        expect(typeof F2).toEqual("function");

    });

    it("should create instance of inherited class", function() {

        var f = new F();
        var f2 = new F2();

        expect(typeof f2).toEqual("object");
        expect(typeof f2.getTest1).toEqual("function");
        expect(typeof f2.getTest2).toEqual("function");
        expect(f2.getTest1()).toEqual("test1-old");
        expect(f2.getTest2()).toEqual("test2-new");

    })

});

describe("It tests if $Class can correctly implement interface", function() {

    var F = null;
    var F2 = null;
    var F3 = null;
    var IFace1 = null;
    var IFace2 = null;

    beforeEach(function() {

        IFace1 = {
            getTest1: function() {
                return "test1";
            },
            getTest2: function() {
                return "test2";
            }
        };

        IFace2 = function() {};

        IFace2.prototype.getTest3 = function() {
            return "test3";
        };

        IFace2.prototype.getTest4 = function() {
            return "test4";
        };

        F = $Class({ implementing: IFace1 });
        F2 = $Class({ implementing: IFace2 });
        F3 = $Class({ implementing: [IFace1, IFace2] });

    });

    it("should create functions", function() {

        expect(typeof F).toEqual("function");
        expect(typeof F2).toEqual("function");
        expect(typeof F3).toEqual("function");

    });

    it("should create instance of implemented class", function() {

        var f = new F();
        var f2 = new F2();
        var f3 = new F3();

        expect(typeof f).toEqual("object");
        expect(typeof f.getTest1).toEqual("function");
        expect(typeof f.getTest2).toEqual("function");
        expect(f.getTest1()).toEqual("test1");
        expect(f.getTest2()).toEqual("test2");

        expect(typeof f2).toEqual("object");
        expect(typeof f2.getTest3).toEqual("function");
        expect(typeof f2.getTest4).toEqual("function");
        expect(f2.getTest3()).toEqual("test3");
        expect(f2.getTest4()).toEqual("test4");

        expect(typeof f3).toEqual("object");
        expect(typeof f3.getTest1).toEqual("function");
        expect(typeof f3.getTest2).toEqual("function");
        expect(typeof f3.getTest3).toEqual("function");
        expect(typeof f3.getTest4).toEqual("function");
        expect(f3.getTest1()).toEqual("test1");
        expect(f3.getTest2()).toEqual("test2");
        expect(f3.getTest3()).toEqual("test3");
        expect(f3.getTest4()).toEqual("test4");

    });

});

describe("It tests if $Class can correctly perform inheritance and implement interface together", function() {

    var F = null;
    var F2 = null;
    var IFace = null;

    beforeEach(function() {

        IFace = {
            getTest3: function() {
                return "test3";
            },
            getTest4: function() {
                return "test4";
            }
        };

        F = $Class();

        F.prototype.$constructor = function() {
            this.test1 = "test1-old";
            this.test2 = "test2-old";
        };

        F.prototype.getTest1 = function() {
            return this.test1;
        };

        F.prototype.getTest2 = function() {
            return this.test2;
        };

        F2 = $Class({ extending: F, implementing: IFace });

        F2.prototype.getTest5 = function() {
            return "test5";
        };

    });

    it("should create functions", function() {

        expect(typeof F2).toEqual("function");

    });

    it("should create instance of inherited and implemented class", function() {

        var f = new F();
        var f2 = new F2();

        expect(typeof f2).toEqual("object");
        expect(typeof f2.getTest1).toEqual("function");
        expect(typeof f2.getTest2).toEqual("function");
        expect(typeof f2.getTest3).toEqual("function");
        expect(typeof f2.getTest4).toEqual("function");
        expect(typeof f2.getTest5).toEqual("function");
        expect(f2.getTest1()).toEqual("test1-old");
        expect(f2.getTest2()).toEqual("test2-old");
        expect(f2.getTest3()).toEqual("test3");
        expect(f2.getTest4()).toEqual("test4");
        expect(f2.getTest5()).toEqual("test5");

    })

});