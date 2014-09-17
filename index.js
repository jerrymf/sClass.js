(function(m, w) {

    var implementInterface = function(f, implementing) {
        if (!implementing || typeof implementing != "object") {

            throw new Error("SClass: I can not implement interface of " + typeof implementing);

        }

        for (var p in implementing) {

            if (typeof implementing[p] == "object") {

                f.prototype[p] = JSON.parse(JSON.stringify(implementing[p]));

            } else {

                f.prototype[p] = implementing[p];

            }
        }

    };

    var makeExtension = function(f, extended) {

        f.prototype = Object.create(extended.prototype);

        for (var p in extended.prototype) {

            if (typeof extended.prototype[p] != "object") {

                continue;

            }

            f.prototype[p] = JSON.parse(JSON.stringify(extended.prototype[p]));

        }

        f.prototype.$super = function() {

            var caller = arguments.callee.caller;
            var callerName = "";

            if (caller == this.constructor) {

                return this.___PARENT___.apply(this, arguments);

            }

            var proto = this.constructor.prototype;

            for (var p in proto) {

                if (proto[p] == caller) {

                    callerName = p;
                    break;

                }

            }

            var method = this.___PARENT___.prototype[callerName];

            if (!method) {

                throw new Error("There is not $super method named " + callerName + " in parent class");

            }

            return method.apply(this, arguments);

        };

        f.prototype.constructor = f;
        f.prototype.___PARENT___ = extended;

    };

    var SClass = function(conf) {

        conf = conf || {};

        if (conf && (typeof conf != "object" || conf instanceof Array)) {

            throw new Error("SClass accepts only object as its argument.");

        }

        var f = function() {

            if (this.$constructor) {

                if (typeof this.$constructor == "function") {

                    if (console && console.warn) {

                        console.warn("SClass: $constructor should by a function not " + typeof this.$constructor);

                    }

                }

                this.$constructor.apply(this, arguments);

                return this;

            }

        };

        if (conf.extended) {

            var extended = conf.extended;

            if (typeof(extended) != "function") {
                throw new Error("SClass: extended can be only construct function not " + typeof extended);
            }

            makeExtension(f, extended);

        }

        if (conf.implementing) {

            var implementing = [].concat(conf.implementing);

            for (var i = 0, len = implementing.length; i < len; i++) {

                var imp = implementing[i];

                if (imp.prototype) {

                    implementInterface(f, imp.prototype);

                }

                implementInterface(f, imp);

            }

        }

        f.___SCLASS___ = true;

        return f;
    };

    if (m) {

        module.exports.SClass = SClass;

    } else if (w) {

        w.SClass = SClass;

    }

})(
    typeof(module) != "undefined" ? module : null,
    typeof(window) != "undefined" ? window : null
);