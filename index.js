var validators = require('./validators'),
	validationResult = require('./validation-result');

module.exports = function(subject, schema) {
	var result = validationResult();
	validators.base(subject, schema, result, ['subject']);
	return result;
};
