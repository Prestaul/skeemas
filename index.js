var validators = require('./validators'),
	validationContext = require('./validation-context'),
	jsonRefs = require('skeemas-json-refs');

module.exports = function() {
	var refs = jsonRefs();
	return {
		refs: refs,
		validate: function(instance, schema, breakOnError) {
			var context = validationContext(schema, { instance:instance, refs:refs, breakOnError:breakOnError });
			validators.base(context, instance, schema);
			if(context.result.valid) context.result.cleanInstance = context.cleanSubject;
			return context.result;
		}
	};
};

module.exports.validate = function(instance, schema, breakOnError) {
	var context = validationContext(schema, { instance:instance, breakOnError:breakOnError });
	validators.base(context, instance, schema);
	if(context.result.valid) context.result.cleanInstance = context.cleanSubject;
	return context.result;
};
