var validateNumber = validators.types.number;

describe('Number validator', function() {
	describe('for type:number', function() {
		it('should validate an integer', function() {
			assert.isTrue(validateNumber(42, { type:'number' }, validationResult(), []));
		});

		it('should validate a non-integer number', function() {
			assert.isTrue(validateNumber(42.1337, { type:'number' }, validationResult(), []));
		});

		it('should validate a number over minimum', function() {
			assert.isTrue(validateNumber(42.1337, { type:'number', minimum:0 }, validationResult(), []));
		});

		it('should invalidate a number under minimum', function() {
			assert.isFalse(validateNumber(42.1337, { type:'number', minimum:1337 }, validationResult(), []));
		});

		it('should validate a number under maximum', function() {
			assert.isTrue(validateNumber(42.1337, { type:'number', maximum:1337 }, validationResult(), []));
		});

		it('should invalidate a number over maximum', function() {
			assert.isFalse(validateNumber(42.1337, { type:'number', maximum:0 }, validationResult(), []));
		});

		it('should validate that 4.5 is divisible by 1.5', function() {
			assert.isTrue(validateNumber(4.5, { divisibleBy:1.5 }, validationResult(), []));
		});

		it('should validate that 0.0075 is multiple of 0.0001', function() {
			assert.isTrue(validateNumber(0.0075, { multipleOf:0.0001 }, validationResult(), []));
		});
	});

	describe('for type:integer', function() {
		it('should validate an integer', function() {
			assert.isTrue(validateNumber(42, { type:'integer' }, validationResult(), []));
		});

		it('should validate a non-integer number', function() {
			assert.isFalse(validateNumber(42.1337, { type:'integer' }, validationResult(), []));
		});

		it('should validate an integer over minimum', function() {
			assert.isTrue(validateNumber(42, { type:'integer', minimum:0 }, validationResult(), []));
		});

		it('should invalidate an integer under minimum', function() {
			assert.isFalse(validateNumber(42, { type:'integer', minimum:1337 }, validationResult(), []));
		});

		it('should validate an integer under maximum', function() {
			assert.isTrue(validateNumber(42, { type:'integer', maximum:1337 }, validationResult(), []));
		});

		it('should invalidate an integer over maximum', function() {
			assert.isFalse(validateNumber(42, { type:'integer', maximum:0 }, validationResult(), []));
		});

		it('should validate that 42 is divisible by 6', function() {
			assert.isTrue(validateNumber(42, { divisibleBy:6 }, validationResult(), []));
		});
	});
});
