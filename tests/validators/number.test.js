var validateNumber = require('../../validators').types.number,
	validationContext = require('../../validation-context');


describe('Number validator', function() {
	describe('for type:number', function() {
		it('should validate an integer', function() {
			var ctx = validationContext({ type:'number' });
			assert.isTrue(validateNumber(ctx, 42, ctx.schema));
		});

		it('should validate a non-integer number', function() {
			var ctx = validationContext({ type:'number' });
			assert.isTrue(validateNumber(ctx, 42.1337, ctx.schema));
		});

		it('should validate a number over minimum', function() {
			var ctx = validationContext({ type:'number', minimum:0 });
			assert.isTrue(validateNumber(ctx, 42.1337, ctx.schema));
		});

		it('should invalidate a number under minimum', function() {
			var ctx = validationContext({ type:'number', minimum:1337 });
			assert.isFalse(validateNumber(ctx, 42.1337, ctx.schema));
		});

		it('should validate a number under maximum', function() {
			var ctx = validationContext({ type:'number', maximum:1337 });
			assert.isTrue(validateNumber(ctx, 42.1337, ctx.schema));
		});

		it('should invalidate a number over maximum', function() {
			var ctx = validationContext({ type:'number', maximum:0 });
			assert.isFalse(validateNumber(ctx, 42.1337, ctx.schema));
		});

		it('should validate that 4.5 is divisible by 1.5', function() {
			var ctx = validationContext({ divisibleBy:1.5 });
			assert.isTrue(validateNumber(ctx, 4.5, ctx.schema));
		});

		it('should validate that 0.0075 is multiple of 0.0001', function() {
			var ctx = validationContext({ multipleOf:0.0001 });
			assert.isTrue(validateNumber(ctx, 0.0075, ctx.schema));
		});
	});

	describe('for type:integer', function() {
		it('should validate an integer', function() {
			var ctx = validationContext({ type:'integer' });
			assert.isTrue(validateNumber(ctx, 42, ctx.schema));
		});

		it('should validate a non-integer number', function() {
			var ctx = validationContext({ type:'integer' });
			assert.isFalse(validateNumber(ctx, 42.1337, ctx.schema));
		});

		it('should validate an integer over minimum', function() {
			var ctx = validationContext({ type:'integer', minimum:0 });
			assert.isTrue(validateNumber(ctx, 42, ctx.schema));
		});

		it('should invalidate an integer under minimum', function() {
			var ctx = validationContext({ type:'integer', minimum:1337 });
			assert.isFalse(validateNumber(ctx, 42, ctx.schema));
		});

		it('should validate an integer under maximum', function() {
			var ctx = validationContext({ type:'integer', maximum:1337 });
			assert.isTrue(validateNumber(ctx, 42, ctx.schema));
		});

		it('should invalidate an integer over maximum', function() {
			var ctx = validationContext({ type:'integer', maximum:0 });
			assert.isFalse(validateNumber(ctx, 42, ctx.schema));
		});

		it('should validate that 42 is divisible by 6', function() {
			var ctx = validationContext({ divisibleBy:6 });
			assert.isTrue(validateNumber(ctx, 42, ctx.schema));
		});
	});
});
