(function(m, w) {

	var makeClass = function() {

		var f = function() {

			if (this.$constructor) {
				if (typeof this.$constructor != "function") {
					if (console && console.warn) {
						console.warn("sClass: $constructor should by a function not " + typeof this.$constructor);
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

			throw new Error("sClass: I am singleton. You can not call me this way. Use getInstance method to get referenced for object.");

		};

		f.getInstance = function() {

			if (instance) {
				return instance;
			}

			instance = Object.create(f.prototype);

			if (instance.$constructor) {
				if (typeof instance.$constructor != "function") {
					if (console && console.warn) {
						console.warn("sClass: $constructor should by a function not " + typeof this.$constructor);
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

		if (!implementing || typeof implementing != "object") {
			throw new Error("sClass: I can not implement interface of " + typeof implementing);
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

			if (caller == this.constructor) {
				return this.___PARENT___.apply(this, arguments);
			}

			var proto = this.constructor.prototype;

			if (!caller.___SUPERNAME___) {
				for (var p in proto) {
					var method = proto[p];

					if (typeof method != "function") { 
						continue; 
					}

					method.___SUPERNAME___ = p;
				}
			}

			var callerName = caller.___SUPERNAME___ || "";

			if (!callerName) {
				for (var p in proto) {
					if (proto[p] == caller) {
						callerName = p;
						break;
					}
				}
			}

			var method = this.___PARENT___.prototype[callerName];

			if (!method) {
				throw new Error("There is not $super method named " + callerName + " in parent class");
			}

			return method.apply(this, arguments);

		};

		f.prototype.constructor = f;
		f.prototype.___PARENT___ = extending;

	};

	var sClass = function(conf) {

		conf = conf || {};

		if (conf && (typeof conf != "object" || conf instanceof Array)) {
			throw new Error("sClass accepts only object as its argument.");
		}

		var f = null;

		if (!conf.singleton) {
			f = makeClass();
		} else {
			f = makeSingleton();
		}

		if (conf.extending) {
			var extending = conf.extending;

			if (typeof(extending) != "function") {
				throw new Error("sClass: extending can be only construct function not " + typeof extending);
			}

			makeExtension(f, extending);
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

		return f;
	};

	if (m && typeof m == "object" && m.exports && typeof m.exports == "object") {
		m.exports.sClass = sClass;
	} else if (w) {
		w.sClass = sClass;
	}

})(
	typeof(module) != "undefined" ? module : null,
	typeof(window) != "undefined" ? window : null
);