var validateBase = validators.base;

describe('Base validator', function() {
	describe('an empty schema', function() {
		it('should validate an array', function() {
			assert.isTrue(validateBase([], {}, validationResult(), []));
		});

		it('should validate a boolean true value', function() {
			assert.isTrue(validateBase(true, {}, validationResult(), []));
		});

		it('should validate a boolean false value', function() {
			assert.isTrue(validateBase(false, {}, validationResult(), []));
		});

		it('should validate an integer', function() {
			assert.isTrue(validateBase(42, {}, validationResult(), []));
		});

		it('should validate a null', function() {
			assert.isTrue(validateBase(null, {}, validationResult(), []));
		});

		it('should validate a number', function() {
			assert.isTrue(validateBase(42.1337, {}, validationResult(), []));
		});

		it('should validate an object', function() {
			assert.isTrue(validateBase({ test:true }, {}, validationResult(), []));
		});

		it('should validate an empty object', function() {
			assert.isTrue(validateBase({}, {}, validationResult(), []));
		});

		it('should validate a string', function() {
			assert.isTrue(validateBase('test', {}, validationResult(), []));
		});

		it('should validate an empty string', function() {
			assert.isTrue(validateBase('', {}, validationResult(), []));
		});
	});

	describe('result object', function() {
		it('should have valid:true when valid', function() {
			var result = validationResult();
			validateBase('test', {}, result, []);
			assert.isTrue(result.valid);
		});

		it('should have valid:false when invalid', function() {
			var result = validationResult();
			validateBase('test', { type:'object' }, result, []);
			assert.isFalse(result.valid);
		});

		it('should have an empty errors array when valid', function() {
			var result = validationResult();
			validateBase('test', {}, result, []);
			assert.isArray(result.errors);
			assert.lengthOf(result.errors, 0);
		});

		it('should have populated errors array when invalid', function() {
			var result = validationResult();
			validateBase('test', { type:'object' }, result, []);
			assert.isArray(result.errors);
			assert.lengthOf(result.errors, 1);
		});
	});
});
