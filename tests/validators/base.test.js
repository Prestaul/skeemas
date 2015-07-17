var validateBase = require('../../validators').base,
	validationContext = require('../../validation-context');


describe('Base validator', function() {
	describe('an empty schema', function() {
		it('should validate an array', function() {
			var ctx = validationContext({});
			assert.isTrue(validateBase(ctx, [], ctx.schema));
		});

		it('should validate a boolean true value', function() {
			var ctx = validationContext({});
			assert.isTrue(validateBase(ctx, true, ctx.schema));
		});

		it('should validate a boolean false value', function() {
			var ctx = validationContext({});
			assert.isTrue(validateBase(ctx, false, ctx.schema));
		});

		it('should validate an integer', function() {
			var ctx = validationContext({});
			assert.isTrue(validateBase(ctx, 42, ctx.schema));
		});

		it('should validate a null', function() {
			var ctx = validationContext({});
			assert.isTrue(validateBase(ctx, null, ctx.schema));
		});

		it('should validate a number', function() {
			var ctx = validationContext({});
			assert.isTrue(validateBase(ctx, 42.1337, ctx.schema));
		});

		it('should validate an object', function() {
			var ctx = validationContext({});
			assert.isTrue(validateBase(ctx, { test:true }, ctx.schema));
		});

		it('should validate an empty object', function() {
			var ctx = validationContext({});
			assert.isTrue(validateBase(ctx, {}, ctx.schema));
		});

		it('should validate a string', function() {
			var ctx = validationContext({});
			assert.isTrue(validateBase(ctx, 'test', ctx.schema));
		});

		it('should validate an empty string', function() {
			var ctx = validationContext({});
			assert.isTrue(validateBase(ctx, '', ctx.schema));
		});
	});

	describe('format', function() {
		it('should validate integer string utc-millisec', function() {
			var ctx = validationContext({ format:'utc-millisec' });
			assert.isTrue(validateBase(ctx, '1337', ctx.schema));
		});

		it('should invalidate float string utc-millisec', function() {
			var ctx = validationContext({ format:'utc-millisec' });
			assert.isFalse(validateBase(ctx, '1337.42', ctx.schema));
		});

		it('should validate integer number utc-millisec', function() {
			var ctx = validationContext({ format:'utc-millisec' });
			assert.isTrue(validateBase(ctx, 1337, ctx.schema));
		});

		it('should invalidate float number utc-millisec', function() {
			var ctx = validationContext({ format:'utc-millisec' });
			assert.isFalse(validateBase(ctx, 1337.42, ctx.schema));
		});

		it('should validate an email string', function() {
			var ctx = validationContext({ format:'email' });
			assert.isTrue(validateBase(ctx, 'foo@bar.com', ctx.schema));
		});

		it('should validate an uncommon email string', function() {
			var ctx = validationContext({ format:'email' });
			assert.isTrue(validateBase(ctx, 'foo.bar+junk@boo.far.museum', ctx.schema));
		});
	});

	describe('result object', function() {
		it('should have valid:true when valid', function() {
			var ctx = validationContext({});
			validateBase(ctx, 'test', ctx.schema);
			assert.isTrue(ctx.result.valid);
		});

		it('should have valid:false when invalid', function() {
			var ctx = validationContext({ type:'object' });
			validateBase(ctx, 'test', ctx.schema);
			assert.isFalse(ctx.result.valid);
		});

		it('should have an empty errors array when valid', function() {
			var ctx = validationContext({});
			validateBase(ctx, 'test', ctx.schema);
			assert.isArray(ctx.result.errors);
			assert.lengthOf(ctx.result.errors, 0);
		});

		it('should have populated errors array when invalid', function() {
			var ctx = validationContext({ type:'object' });
			validateBase(ctx, 'test', ctx.schema);
			assert.isArray(ctx.result.errors);
			assert.lengthOf(ctx.result.errors, 1);
		});
	});
});
