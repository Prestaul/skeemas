var validationResult = require('./validation-result'),
	jsonRefs = require('skeemas-json-refs');

var protoContext = {
	addError: function(message, subject, criteria) {
		if(!this.silent) this.result.addError(message, subject, criteria, this);
		return this;
	},
	silently: function(fn) {
		this.silent = true;
		var result = fn();
		this.silent = false;
		return result;
	},
	subcontext: function(schema) {
		return makeContext(schema, this, this.silent);
	},
	runValidations: function(validations, subject, schema) {
		var breakOnError = this.breakOnError,
			args = Array.prototype.slice.call(arguments),
			valid = true,
			validation;

		args[0] = this;

		for(var i = 0, len = validations.length; i < len; i++) {
			validation = validations[i];
			if(!validation[0]) continue;
			valid = validation[1].apply(null, args) && valid;
			if(breakOnError && !valid) return false;
		}

		return valid;
	}
};

var makeContext = module.exports = function(schema, context, forceNewResult) {
	context = context || {};
	return Object.create(protoContext, {
		id: { enumerable:true, writable:false, value: [] },
		schema: { enumerable:true, writable:false, value: schema || context.schema },
		path: { enumerable:true, writable:false, value: context.path && context.path.slice() || ['#'] },
		result: { enumerable:true, writable:false, value: (!forceNewResult && context.result) || validationResult(context.instance) },
		refs: { enumerable:true, writable:false, value: context.refs || jsonRefs() },
		silent: { enumerable:true, writable:true, value: false },
		breakOnError: { enumerable:true, writable:true, value: context.breakOnError || false },
		cleanWithDefaults: { enumerable:true, writable:true, value: context.cleanWithDefaults || false },
		cleanSubject: { enumerable:true, writable:true, value: undefined }
	});
};
