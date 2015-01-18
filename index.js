var validators = require('./validators'),
	validationResult = require('./validation-result'),
	jsonRefs = require('skeemas-json-refs');

module.exports = function() {
	var refs = jsonRefs();
	return {
		refs: refs,
		validate: function(subject, schema) {
			var result = validationResult();
			validators.base(subject, schema, result, {
				id: [],
				schema: schema,
				path: ['subject'],
				refs: refs
			});
			return result;
		}
	};
};

module.exports.validate = function(subject, schema) {
	var result = validationResult();
	validators.base(subject, schema, result, {
		id: [],
		schema: schema,
		path: ['subject'],
		refs: jsonRefs()
	});
	return result;
};
