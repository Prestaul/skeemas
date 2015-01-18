var validateString = validators.types.string;

function context(schema) {
	return {
		schema: schema,
		path: []
	};
}

describe('String validator', function() {
	describe('format', function() {
		it('should validate integer string utc-millisec', function() {
			var ctx = context({ format:'utc-millisec' });
			assert.isTrue(validateString('1337', ctx.schema, validationResult(), ctx));
		});

		it('should invalidate float string utc-millisec', function() {
			var ctx = context({ format:'utc-millisec' });
			assert.isFalse(validateString('1337.42', ctx.schema, validationResult(), ctx));
		});

		it.skip('should validate integer number utc-millisec', function() {
			var ctx = context({ format:'utc-millisec' });
			assert.isTrue(validateString(1337, ctx.schema, validationResult(), ctx));
		});

		it('should invalidate float number utc-millisec', function() {
			var ctx = context({ format:'utc-millisec' });
			assert.isFalse(validateString(1337.42, ctx.schema, validationResult(), ctx));
		});
	});
});
