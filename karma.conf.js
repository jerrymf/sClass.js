module.exports = function(config) {
    config.set({
        basePath: ".",

        files: [
            "index.js",
            "test.js"
        ],

        singleRun: true,

        frameworks: ["jasmine"],

        browsers: ["PhantomJS"],

        plugins: [
            "karma-phantomjs-launcher",
            "karma-jasmine"
        ],

        junitReporter: {
            outputFile: "test_out/unit.xml",
            suite: "unit"
        }

    });
};