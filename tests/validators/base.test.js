var validateBase = validators.base;


describe('Base validator', function() {
	describe('an empty schema', function() {
		it('should validate an array', function() {
			var ctx = validationContext({});
			assert.isTrue(validateBase([], ctx.schema, ctx));
		});

		it('should validate a boolean true value', function() {
			var ctx = validationContext({});
			assert.isTrue(validateBase(true, ctx.schema, ctx));
		});

		it('should validate a boolean false value', function() {
			var ctx = validationContext({});
			assert.isTrue(validateBase(false, ctx.schema, ctx));
		});

		it('should validate an integer', function() {
			var ctx = validationContext({});
			assert.isTrue(validateBase(42, ctx.schema, ctx));
		});

		it('should validate a null', function() {
			var ctx = validationContext({});
			assert.isTrue(validateBase(null, ctx.schema, ctx));
		});

		it('should validate a number', function() {
			var ctx = validationContext({});
			assert.isTrue(validateBase(42.1337, ctx.schema, ctx));
		});

		it('should validate an object', function() {
			var ctx = validationContext({});
			assert.isTrue(validateBase({ test:true }, ctx.schema, ctx));
		});

		it('should validate an empty object', function() {
			var ctx = validationContext({});
			assert.isTrue(validateBase({}, ctx.schema, ctx));
		});

		it('should validate a string', function() {
			var ctx = validationContext({});
			assert.isTrue(validateBase('test', ctx.schema, ctx));
		});

		it('should validate an empty string', function() {
			var ctx = validationContext({});
			assert.isTrue(validateBase('', ctx.schema, ctx));
		});
	});

	describe('result object', function() {
		it('should have valid:true when valid', function() {
			var ctx = validationContext({});
			validateBase('test', ctx.schema, ctx);
			assert.isTrue(ctx.result.valid);
		});

		it('should have valid:false when invalid', function() {
			var ctx = validationContext({ type:'object' });
			validateBase('test', ctx.schema, ctx);
			assert.isFalse(ctx.result.valid);
		});

		it('should have an empty errors array when valid', function() {
			var ctx = validationContext({});
			validateBase('test', ctx.schema, ctx);
			assert.isArray(ctx.result.errors);
			assert.lengthOf(ctx.result.errors, 0);
		});

		it('should have populated errors array when invalid', function() {
			var ctx = validationContext({ type:'object' });
			validateBase('test', ctx.schema, ctx);
			assert.isArray(ctx.result.errors);
			assert.lengthOf(ctx.result.errors, 1);
		});
	});
});
