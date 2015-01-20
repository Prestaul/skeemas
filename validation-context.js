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
		return makeContext(schema, this);
	}
};

var makeContext = module.exports = function(schema, context) {
	context = context || {};
	return Object.create(protoContext, {
		instance: { enumerable:true, writable:false, value:context.instance || null },
		id: { enumerable:true, writable:false, value: [] },
		schema: { enumerable:true, writable:false, value: schema || context.schema },
		path: { enumerable:true, writable:false, value: context.path && context.path.slice() || ['#'] },
		result: { enumerable:true, writable:false, value: context.result || validationResult(context.instance) },
		refs: { enumerable:true, writable:false, value: context.refs || jsonRefs() },
		silent: { enumerable:true, writable:true, value:false }
	});
};
