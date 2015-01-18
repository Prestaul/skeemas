var validateBase = require('./base'),
	deepEqual = require('./deep-equal');

function items(subject, items, result, context) {
	if(typeof items !== 'object')
		throw new Error('Invalid schema: invalid "items"');

	var lastPath = context.path.length;
	for(var i = 0, len = subject.length; i < len; i++) {
		context.path[lastPath] = i;
		if(!validateBase(subject[i], items, result, context)) return false;
	}
	context.length = lastPath;

	return true;
}

function tupleItems(subject, items, result, context) {
	var lastPath = context.path.length;
	for(var i = 0, len = items.length; i < len; i++) {
		context.path[lastPath] = i;
		if(!validateBase(subject[i], items[i], result, context)) return false;
	}
	context.length = lastPath;

	return true;
}

function additionalItems(subject, schema, result, context) {
	var i = schema.items.length,
		len = subject.length,
		additionalItems = schema.additionalItems;

	if(additionalItems === false) {
		if(len <= i) return true;

		result.addError('Failed "additionalItems" criteria: no additional items are allowed', subject, schema, context);
		return false;
	}

	if(typeof additionalItems !== 'object')
		throw new Error('Invalid schema: invalid "additionalItems"');

	var lastPath = context.path.length;
	for(; i < len; i++) {
		context.path[lastPath] = i;
		if(!validateBase(subject[i], additionalItems, result, context)) return false;
	}
	context.length = lastPath;

	return true;
}

function minItems(subject, schema, result, context) {
	if(subject.length < schema.minItems) {
		result.addError('Failed "minItems" criteria', subject, schema, context);
		return false;
	}

	return true;
}

function maxItems(subject, schema, result, context) {
	if(subject.length > schema.maxItems) {
		result.addError('Failed "maxItems" criteria', subject, schema, context);
		return false;
	}

	return true;
}

function uniqueItems(subject, schema, result, context) {
	var i = subject.length, j;

	while(i--) {
		j = i;
		while(j--) {
			if(deepEqual(subject[i], subject[j])) {
				result.addError('Failed "uniqueItems" criteria', subject, schema, context);
				return false;
			}
		}
	}

	return true;
}


module.exports = function(subject, schema, result, context) {
	if(!Array.isArray(subject)) {
		result.addError('Failed type:array criteria', schema, result, context);
		return false;
	}

	var valid = true;

	if('minItems' in schema) valid = minItems(subject, schema, result, context) && valid;
	if('maxItems' in schema) valid = maxItems(subject, schema, result, context) && valid;
	if(schema.uniqueItems) valid = uniqueItems(subject, schema, result, context) && valid;

	if(Array.isArray(schema.items)) {
		valid = tupleItems(subject, schema.items, result, context) && valid;
		if('additionalItems' in schema) valid = additionalItems(subject, schema, result, context) && valid;
	} else if(schema.items) {
		valid = items(subject, schema.items, result, context) && valid;
	}

	return valid;
};
