var skeemas = require('../');

describe('Plugins', function() {
	it('should be called correctly', function() {
		var called = false;
		skeemas.use(function(protoValidator) {
			called = true;
			assert.isObject(protoValidator);
		});
		assert.isTrue(called);
	});

	it('should allow validator modifications', function() {
		skeemas.use(function(protoValidator) {
			protoValidator.testMethod = function() {
				assert.isFunction(this.validate);
				assert.isObject(this._refs);
				return this;
			};
		});

		var validator = skeemas();
		assert.isFunction(validator.testMethod);
		assert.strictEqual(validator.testMethod(), validator);
	});
});
