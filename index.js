var validators = require('./validators'),
	validationResult = require('./validation-result');

module.exports = function(subject, schema) {
	var result = validationResult(),
		context = {
			schema: schema,
			path: ['subject']
		};
	validators.base(subject, schema, result, context);
	return result;
};
