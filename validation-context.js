var validationResult = require('./validation-result'),
	jsonRefs = require('skeemas-json-refs');

var protoContext = {
	addError: function(message) {
		this.result.addError(message, this);
	}
};

module.exports = function(context) {
	context = context || {};
	return Object.create(protoContext, {
		instance: { enumerable:true, writable:false, value:context.instance || null },
		id: { enumerable:true, writable:false, value: context.id && context.id.slice() || [] },
		schema: { enumerable:true, writable:false, value: context.schema || schema },
		path: { enumerable:true, writable:false, value: context.path && context.path.slice() || ['#'] },
		result: { enumerable:true, writable:false, value: context.result || validationResult(context.instance) },
		refs: { enumerable:true, writable:false, value: context.refs || jsonRefs() }
	});
};
