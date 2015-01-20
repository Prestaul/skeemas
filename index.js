var validators = require('./validators'),
	validationContext = require('./validation-context'),
	jsonRefs = require('skeemas-json-refs');

module.exports = function() {
	var refs = jsonRefs();
	return {
		refs: refs,
		validate: function(instance, schema) {
			var context = validationContext({ instance:instance, schema:schema, refs:refs });
			validators.base(instance, schema, context.result, context);
			return context.result;
		}
	};
};

module.exports.validate = function(instance, schema) {
	var context = validationContext({ instance:instance, schema:schema });
	validators.base(instance, schema, context.result, context);
	return context.result;
};
