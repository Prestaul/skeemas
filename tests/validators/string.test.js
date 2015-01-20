var validateString = validators.types.string;


describe('String validator', function() {
	describe('format', function() {
		it('should validate integer string utc-millisec', function() {
			var ctx = validationContext({ format:'utc-millisec' });
			assert.isTrue(validateString(ctx, '1337', ctx.schema));
		});

		it('should invalidate float string utc-millisec', function() {
			var ctx = validationContext({ format:'utc-millisec' });
			assert.isFalse(validateString(ctx, '1337.42', ctx.schema));
		});

		it.skip('should validate integer number utc-millisec', function() {
			var ctx = validationContext({ format:'utc-millisec' });
			assert.isTrue(validateString(ctx, 1337, ctx.schema));
		});

		it('should invalidate float number utc-millisec', function() {
			var ctx = validationContext({ format:'utc-millisec' });
			assert.isFalse(validateString(ctx, 1337.42, ctx.schema));
		});
	});
});
