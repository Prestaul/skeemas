var validateNumber = validators.types.number;

function context(schema) {
	return {
		schema: schema,
		path: []
	};
}

describe('Number validator', function() {
	describe('for type:number', function() {
		it('should validate an integer', function() {
			var ctx = context({ type:'number' });
			assert.isTrue(validateNumber(42, ctx.schema, validationResult(), ctx));
		});

		it('should validate a non-integer number', function() {
			var ctx = context({ type:'number' });
			assert.isTrue(validateNumber(42.1337, ctx.schema, validationResult(), ctx));
		});

		it('should validate a number over minimum', function() {
			var ctx = context({ type:'number', minimum:0 });
			assert.isTrue(validateNumber(42.1337, ctx.schema, validationResult(), ctx));
		});

		it('should invalidate a number under minimum', function() {
			var ctx = context({ type:'number', minimum:1337 });
			assert.isFalse(validateNumber(42.1337, ctx.schema, validationResult(), ctx));
		});

		it('should validate a number under maximum', function() {
			var ctx = context({ type:'number', maximum:1337 });
			assert.isTrue(validateNumber(42.1337, ctx.schema, validationResult(), ctx));
		});

		it('should invalidate a number over maximum', function() {
			var ctx = context({ type:'number', maximum:0 });
			assert.isFalse(validateNumber(42.1337, ctx.schema, validationResult(), ctx));
		});

		it('should validate that 4.5 is divisible by 1.5', function() {
			var ctx = context({ divisibleBy:1.5 });
			assert.isTrue(validateNumber(4.5, ctx.schema, validationResult(), ctx));
		});

		it('should validate that 0.0075 is multiple of 0.0001', function() {
			var ctx = context({ multipleOf:0.0001 });
			assert.isTrue(validateNumber(0.0075, ctx.schema, validationResult(), ctx));
		});
	});

	describe('for type:integer', function() {
		it('should validate an integer', function() {
			var ctx = context({ type:'integer' });
			assert.isTrue(validateNumber(42, ctx.schema, validationResult(), ctx));
		});

		it('should validate a non-integer number', function() {
			var ctx = context({ type:'integer' });
			assert.isFalse(validateNumber(42.1337, ctx.schema, validationResult(), ctx));
		});

		it('should validate an integer over minimum', function() {
			var ctx = context({ type:'integer', minimum:0 });
			assert.isTrue(validateNumber(42, ctx.schema, validationResult(), ctx));
		});

		it('should invalidate an integer under minimum', function() {
			var ctx = context({ type:'integer', minimum:1337 });
			assert.isFalse(validateNumber(42, ctx.schema, validationResult(), ctx));
		});

		it('should validate an integer under maximum', function() {
			var ctx = context({ type:'integer', maximum:1337 });
			assert.isTrue(validateNumber(42, ctx.schema, validationResult(), ctx));
		});

		it('should invalidate an integer over maximum', function() {
			var ctx = context({ type:'integer', maximum:0 });
			assert.isFalse(validateNumber(42, ctx.schema, validationResult(), ctx));
		});

		it('should validate that 42 is divisible by 6', function() {
			var ctx = context({ divisibleBy:6 });
			assert.isTrue(validateNumber(42, ctx.schema, validationResult(), ctx));
		});
	});
});
