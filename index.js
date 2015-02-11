var validators = require('./validators'),
	validationContext = require('./validation-context'),
	jsonRefs = require('skeemas-json-refs');

var protoValidator = {
	addRef: function(uri, ref) {
		if(typeof uri === 'object') {
			ref = uri;
			uri = null;
		}
		uri = uri || ref.id;

		if(!uri) throw new Error('Cannot add a json schema reference without a uri/id.');

		this._refs.add(uri, ref);

		return this;
	},
	validate: function(instance, schema, options) {
		if(instance === undefined) throw new Error('Instance undefined in call to validate.');
		if(!schema) throw new Error('No schema specified in call to validate.');

		if(typeof schema === 'string') {
			var uri = schema;
			schema = this._refs.get(uri);

			if(!schema) throw new Error('Unable to locate schema (' + uri + '). Did you call addRef with this schema?');
		}

		var context = validationContext(schema, {
			instance: instance,
			refs: this._refs,
			breakOnError: options && options.breakOnError,
			cleanWithDefaults: options && options.cleanWithDefaults
		});
		validators.base(context, instance, schema);
		if(context.result.valid) context.result.cleanInstance = context.cleanSubject;
		return context.result;
	}
};

function makeValidator() {
	return Object.create(protoValidator, {
		_refs: { enumerable:false, writable:false, value:jsonRefs() }
	});
}

module.exports = makeValidator;

module.exports.validate = function(instance, schema, options) {
	if(instance === undefined) throw new Error('Instance undefined in call to validate.');
	if(!schema) throw new Error('No schema specified in call to validate.');

	var context = validationContext(schema, {
		instance: instance,
		breakOnError: options && options.breakOnError,
		cleanWithDefaults: options && options.cleanWithDefaults
	});
	validators.base(context, instance, schema);
	if(context.result.valid) context.result.cleanInstance = context.cleanSubject;
	return context.result;
};

module.exports.use = function(plugin) {
	if(typeof plugin !== 'function') throw new Error('skeemas.use called with non-function. Plugins are in the form function(skeemas){}.');
	plugin(protoValidator);
	return this;
};
