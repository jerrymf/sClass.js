/**
 * sClass.js - 1.0.1
 * (c) 2014 Marek Fojtl <jerrymf@gmail.com>, https://github.com/jerrymf/sClass/
 * License: MIT
 */

(function(m, w) {

	if (typeof Object.create != "function") {

		Object.create = (function() {

			var F = function() {};

			return function (prototype) {

				if (arguments.length > 1) {
					throw Error("Second argument not supported");
				}

				if (typeof prototype != "object") {
					throw TypeError("Argument must be an object");
				}

				F.prototype = prototype;
				var result = new F();
				F.prototype = null;

				return result;

			};

		})();

	}

	var makeClass = function() {

		var f = function() {

			if (this.$constructor) {
				if (typeof this.$constructor != "function") {
					if (console && console.warn) {
						console.warn("$Class: $constructor should be a function not " + typeof this.$constructor);
					}
				} else {
					this.$constructor.apply(this, arguments);
				}

			}

			return this;

		};

		return f;

	};

	var makeSingleton = function() {

		var instance = null;

		var f = function() {

			throw new Error("$Class: I am singleton. You can not call me this way. Use getInstance method to get referenced for object.");

		};

		f.getInstance = function() {

			if (instance) {
				return instance;
			}

			instance = Object.create(f.prototype);

			if (instance.$constructor) {
				if (typeof instance.$constructor != "function") {
					if (console && console.warn) {
						console.warn("$Class: $constructor should by a function not " + typeof this.$constructor);
					}
				} else {
					instance.$constructor.apply(instance);
				}

			}

			return instance;

		};

		return f;

	};

	var implementInterface = function(f, implementing) {

		if (!implementing || (typeof implementing != "object" && typeof implementing != "function")) {
			throw new Error("$Class: I can not implement interface of " + typeof implementing);
		}

		for (var p in implementing) {
			var item = implementing[p];

			if (typeof item == "object") {
				f.prototype[p] = JSON.parse(JSON.stringify(item));
			} else {
				f.prototype[p] = item;
			}
		}

	};

	var makeExtension = function(f, extending) {

		f.prototype = Object.create(extending.prototype);

		for (var p in extending.prototype) {
			if (typeof extending.prototype[p] != "object") {
				continue;
			}

			f.prototype[p] = JSON.parse(JSON.stringify(extending.prototype[p]));
		}

		f.prototype.$super = function() {

			var caller = arguments.callee.caller;
			var proto = this.constructor.prototype;

			if (!caller.___SUPERNAME___) {
				for (var p in proto) {
					var item = proto[p];

					if (typeof item != "function") {
						continue; 
					}

					item.___SUPERNAME___ = p;
				}
			}

			var callerName = caller.___SUPERNAME___;

			if (!callerName) {
				throw new Error("$Class: I can not call $super, because I can not get caller name.");
			}

			var method = this.___PARENT___.prototype[callerName];

			if (!method) {
				throw new Error("$Class: There is not $super method named " + callerName + " in parent class");
			}

			return method.apply(this, arguments);

		};

		f.prototype.constructor = f;
		f.prototype.___PARENT___ = extending;

	};

	var $Class = function(conf) {

		conf = conf || {};

		if (conf && (typeof conf != "object" || conf instanceof Array)) {
			throw new Error("$Class: I accept only object as argument.");
		}

		var f = null;

		if (!conf.singleton) {
			f = makeClass();
		} else {
			f = makeSingleton();
		}

		f.___SCLASS___ = true;

		if (conf.extending) {
			var extending = conf.extending;

			if (typeof(extending) != "function") {
				throw new Error("$Class: extending can be only construct function not " + typeof extending);
			}

			if (!extending.___SCLASS___) {
				throw new Error("$Class: I can not extend non $Class class.");	
			}

			makeExtension(f, extending);
		}

		if (conf.implementing) {
			var implementing = [].concat(conf.implementing);

			for (var i = 0, len = implementing.length; i < len; i++) {
				var imp = implementing[i];

				if (!imp || (typeof imp != "function" && typeof imp != "object")) {
					if (console && console.warn) {
						console.warn("$Class: You are trying implement " + typeof imp + ". I can work only with object.");
					}
				}

				if (imp.prototype) {
					implementInterface(f, imp.prototype);
				}

				implementInterface(f, imp);
			}
		}

		return f;
	};

	if (m && typeof m == "object" && m.exports && typeof m.exports == "object") {
		m.exports.$Class = $Class;
	} else if (w) {
		w.$Class = $Class;
	}

})(
	typeof(module) != "undefined" ? module : null,
	typeof(window) != "undefined" ? window : null
);
