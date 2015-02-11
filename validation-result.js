function errorToString() {
	return this.message + ' (pointer: ' + this.context + ')';
}

var protoValidationResult = {
	addError: function(message, subject, criteria, context) {
		this.errors.push({
			message: message,
			context: context.path.join('/'),
			value: subject,
			criteria: criteria,
			toString: errorToString
		});
		this.valid = false;
		return this;
	}
};

module.exports = function(instance) {
	return Object.create(protoValidationResult, {
		instance: { enumerable:true, writable:false, value:instance },
		cleanInstance: { enumerable:true, writable:true, value: undefined },
		valid: { enumerable:true, writable:true, value:true },
		errors: { enumerable:true, writable:false, value:[] }
	});
};
