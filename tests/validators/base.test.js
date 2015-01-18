var validateBase = validators.base;

function context(schema) {
	return {
		schema: schema,
		path: []
	};
}

describe('Base validator', function() {
	describe('an empty schema', function() {
		it('should validate an array', function() {
			var ctx = context({});
			assert.isTrue(validateBase([], ctx.schema, validationResult(), ctx));
		});

		it('should validate a boolean true value', function() {
			var ctx = context({});
			assert.isTrue(validateBase(true, ctx.schema, validationResult(), ctx));
		});

		it('should validate a boolean false value', function() {
			var ctx = context({});
			assert.isTrue(validateBase(false, ctx.schema, validationResult(), ctx));
		});

		it('should validate an integer', function() {
			var ctx = context({});
			assert.isTrue(validateBase(42, ctx.schema, validationResult(), ctx));
		});

		it('should validate a null', function() {
			var ctx = context({});
			assert.isTrue(validateBase(null, ctx.schema, validationResult(), ctx));
		});

		it('should validate a number', function() {
			var ctx = context({});
			assert.isTrue(validateBase(42.1337, ctx.schema, validationResult(), ctx));
		});

		it('should validate an object', function() {
			var ctx = context({});
			assert.isTrue(validateBase({ test:true }, ctx.schema, validationResult(), ctx));
		});

		it('should validate an empty object', function() {
			var ctx = context({});
			assert.isTrue(validateBase({}, ctx.schema, validationResult(), ctx));
		});

		it('should validate a string', function() {
			var ctx = context({});
			assert.isTrue(validateBase('test', ctx.schema, validationResult(), ctx));
		});

		it('should validate an empty string', function() {
			var ctx = context({});
			assert.isTrue(validateBase('', ctx.schema, validationResult(), ctx));
		});
	});

	describe('result object', function() {
		it('should have valid:true when valid', function() {
			var result = validationResult(),
				ctx = context({});
			validateBase('test', ctx.schema, result, ctx);
			assert.isTrue(result.valid);
		});

		it('should have valid:false when invalid', function() {
			var result = validationResult(),
				ctx = context({ type:'object' });
			validateBase('test', ctx.schema, result, ctx);
			assert.isFalse(result.valid);
		});

		it('should have an empty errors array when valid', function() {
			var result = validationResult(),
				ctx = context({});
			validateBase('test', ctx.schema, result, ctx);
			assert.isArray(result.errors);
			assert.lengthOf(result.errors, 0);
		});

		it('should have populated errors array when invalid', function() {
			var result = validationResult(),
				ctx = context({ type:'object' });
			validateBase('test', ctx.schema, result, ctx);
			assert.isArray(result.errors);
			assert.lengthOf(result.errors, 1);
		});
	});
});
