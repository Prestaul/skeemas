describe('Validate', function() {
	describe('an empty schema', function() {
		it('should validate an array', function() {
			assert.isTrue(validate([], {}).valid);
		});

		it('should validate a boolean true value', function() {
			assert.isTrue(validate(true, {}).valid);
		});

		it('should validate a boolean false value', function() {
			assert.isTrue(validate(false, {}).valid);
		});

		it('should validate an integer', function() {
			assert.isTrue(validate(42, {}).valid);
		});

		it('should validate a null', function() {
			assert.isTrue(validate(null, {}).valid);
		});

		it('should validate a number', function() {
			assert.isTrue(validate(42.1337, {}).valid);
		});

		it('should validate an object', function() {
			assert.isTrue(validate({ test:true }, {}).valid);
		});

		it('should validate an empty object', function() {
			assert.isTrue(validate({}, {}).valid);
		});

		it('should validate a string', function() {
			assert.isTrue(validate('test', {}).valid);
		});

		it('should validate an empty string', function() {
			assert.isTrue(validate('', {}).valid);
		});
	});

	describe('result object', function() {
		it('should have valid:true when valid', function() {
			var result = validate('test', {});
			assert.isTrue(result.valid);
		});

		it('should have valid:false when invalid', function() {
			var result = validate('test', { type:'object' });
			assert.isFalse(result.valid);
		});

		it('should have an empty errors array when valid', function() {
			var result = validate('test', {});
			assert.isArray(result.errors);
			assert.lengthOf(result.errors, 0);
		});

		it('should have populated errors array when invalid', function() {
			var result = validate('test', { type:'object' });
			assert.isArray(result.errors);
			assert.lengthOf(result.errors, 1);
		});
	});
});
