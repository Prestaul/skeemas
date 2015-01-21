var validators = require('./validators'),
	validationContext = require('./validation-context'),
	jsonRefs = require('skeemas-json-refs');

module.exports = function() {
	var refs = jsonRefs();
	return {
		addRef: function(uri, ref) {
			if(typeof uri === 'object') {
				ref = uri;
				uri = null;
			}
			uri = uri || ref.id;

			if(!uri) throw new Error('Cannot add a json schema reference without a uri/id.');

			refs.add(uri, ref);

			return this;
		},
		validate: function(instance, schema, breakOnError) {
			if(!schema) throw new Error('No schema specified in call to validate.');

			if(typeof schema === 'string') {
				var uri = schema;
				schema = refs.get(uri);

				if(!schema) throw new Error('Unable to locate schema (' + uri + '). Did you call addRef with this schema?');
			}

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
