var validateBase = require('./base'),
	deepEqual = require('./deep-equal');

function items(subject, items, context) {
	if(typeof items !== 'object')
		throw new Error('Invalid schema: invalid "items"');

	var lastPath = context.path.length;
	for(var i = 0, len = subject.length; i < len; i++) {
		context.path[lastPath] = i;
		if(!validateBase(subject[i], items, context)) {
			context.addError('Failed "items" criteria', subject, items);
			return false;
		}
	}
	context.length = lastPath;

	return true;
}

function tupleItems(subject, items, context) {
	var lastPath = context.path.length;
	for(var i = 0, len = items.length; i < len; i++) {
		context.path[lastPath] = i;
		if(!validateBase(subject[i], items[i], context)) {
			context.addError('Failed "items" criteria', subject, items);
			return false;
		}
	}
	context.length = lastPath;

	return true;
}

function additionalItems(subject, schema, context) {
	var i = schema.items.length,
		len = subject.length,
		additionalItems = schema.additionalItems;

	if(additionalItems === false) {
		if(len <= i) return true;

		context.addError('Failed "additionalItems" criteria: no additional items are allowed', subject, schema);
		return false;
	}

	if(typeof additionalItems !== 'object')
		throw new Error('Invalid schema: invalid "additionalItems"');

	var lastPath = context.path.length;
	for(; i < len; i++) {
		context.path[lastPath] = i;
		if(!validateBase(subject[i], additionalItems, context)) {
			context.addError('Failed "additionalItems" criteria', subject, schema);
			return false;
		}
	}
	context.length = lastPath;

	return true;
}

function minItems(subject, schema, context) {
	if(subject.length < schema.minItems) {
		context.addError('Failed "minItems" criteria', subject, schema);
		return false;
	}

	return true;
}

function maxItems(subject, schema, context) {
	if(subject.length > schema.maxItems) {
		context.addError('Failed "maxItems" criteria', subject, schema);
		return false;
	}

	return true;
}

function uniqueItems(subject, schema, context) {
	var i = subject.length, j;

	while(i--) {
		j = i;
		while(j--) {
			if(deepEqual(subject[i], subject[j])) {
				context.addError('Failed "uniqueItems" criteria', subject, schema);
				return false;
			}
		}
	}

	return true;
}


module.exports = function(subject, schema, context) {
	if(!Array.isArray(subject)) {
		context.addError('Failed type:array criteria', schema);
		return false;
	}

	var valid = true;

	if('minItems' in schema) valid = minItems(subject, schema, context) && valid;
	if('maxItems' in schema) valid = maxItems(subject, schema, context) && valid;
	if(schema.uniqueItems) valid = uniqueItems(subject, schema, context) && valid;

	if(Array.isArray(schema.items)) {
		valid = tupleItems(subject, schema.items, context) && valid;
		if('additionalItems' in schema) valid = additionalItems(subject, schema, context) && valid;
	} else if(schema.items) {
		valid = items(subject, schema.items, context) && valid;
	}

	return valid;
};
