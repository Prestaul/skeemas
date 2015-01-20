var validators = require('./validators'),
	validationContext = require('./validation-context'),
	jsonRefs = require('skeemas-json-refs');

module.exports = function() {
	var refs = jsonRefs();
	return {
		refs: refs,
		validate: function(instance, schema) {
			var context = validationContext(schema, { instance:instance, refs:refs });
			validators.base(instance, schema, context);
			return context.result;
		}
	};
};

module.exports.validate = function(instance, schema) {
	var context = validationContext(schema, { instance:instance });
	validators.base(instance, schema, context);
	return context.result;
};
