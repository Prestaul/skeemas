var validateBase = validators.base;

describe('Base validator', function() {
	describe('an empty schema', function() {
		it('should validateBase an array', function() {
			assert.isTrue(validateBase([], {}, validationResult(), ['subject']));
		});

		it('should validateBase a boolean true value', function() {
			assert.isTrue(validateBase(true, {}, validationResult(), ['subject']));
		});

		it('should validateBase a boolean false value', function() {
			assert.isTrue(validateBase(false, {}, validationResult(), ['subject']));
		});

		it('should validateBase an integer', function() {
			assert.isTrue(validateBase(42, {}, validationResult(), ['subject']));
		});

		it('should validateBase a null', function() {
			assert.isTrue(validateBase(null, {}, validationResult(), ['subject']));
		});

		it('should validateBase a number', function() {
			assert.isTrue(validateBase(42.1337, {}, validationResult(), ['subject']));
		});

		it('should validateBase an object', function() {
			assert.isTrue(validateBase({ test:true }, {}, validationResult(), ['subject']));
		});

		it('should validateBase an empty object', function() {
			assert.isTrue(validateBase({}, {}, validationResult(), ['subject']));
		});

		it('should validateBase a string', function() {
			assert.isTrue(validateBase('test', {}, validationResult(), ['subject']));
		});

		it('should validateBase an empty string', function() {
			assert.isTrue(validateBase('', {}, validationResult(), ['subject']));
		});
	});

	describe('result object', function() {
		it('should have valid:true when valid', function() {
			var result = validationResult();
			validateBase('test', {}, result, ['subject']);
			assert.isTrue(result.valid);
		});

		it('should have valid:false when invalid', function() {
			var result = validationResult();
			validateBase('test', { type:'object' }, result, ['subject']);
			assert.isFalse(result.valid);
		});

		it('should have an empty errors array when valid', function() {
			var result = validationResult();
			validateBase('test', {}, result, ['subject']);
			assert.isArray(result.errors);
			assert.lengthOf(result.errors, 0);
		});

		it('should have populated errors array when invalid', function() {
			var result = validationResult();
			validateBase('test', { type:'object' }, result, ['subject']);
			assert.isArray(result.errors);
			assert.lengthOf(result.errors, 1);
		});
	});
});
