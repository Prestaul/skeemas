var protoValidationResult = {
	addError: function(message, subject, criteria, context) {
		this.errors.push({
			message: message,
			context: context.join('.'),
			value: subject,
			criteria: criteria
		});
		this.valid = false;
		return this;
	},
	merge: function(result) {
		this.errors.push.apply(this.errors, result.errors);
		this.valid = this.valid && result.valid;
		return this;
	}
};

module.exports = function() {
	return Object.create(protoValidationResult, {
		valid: { enumerable:true, writable:true, value:true },
		errors: { enumerable:true, writable:false, value:[] }
	});
};
