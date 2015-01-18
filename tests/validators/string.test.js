var validateString = validators.types.string;

describe('String validator', function() {
	describe('format', function() {
		it('should validate integer string utc-millisec', function() {
			assert.isTrue(validateString('1337', { format:'utc-millisec' }, validationResult(), []));
		});

		it('should invalidate float string utc-millisec', function() {
			assert.isFalse(validateString('1337.42', { format:'utc-millisec' }, validationResult(), []));
		});

		it.skip('should validate integer number utc-millisec', function() {
			assert.isTrue(validateString(1337, { format:'utc-millisec' }, validationResult(), []));
		});

		it('should invalidate float number utc-millisec', function() {
			assert.isFalse(validateString(1337.42, { format:'utc-millisec' }, validationResult(), []));
		});
	});
});
