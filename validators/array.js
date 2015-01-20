var validateBase = require('./base'),
	deepEqual = require('./deep-equal');

function items(context, subject, schema) {
	var valid = true;
	if(Array.isArray(schema.items)) {
		valid = tupleItems(context, subject, schema);
		if('additionalItems' in schema) valid = additionalItems(context, subject, schema) && valid;
	} else if(schema.items) {
		valid = itemSchema(context, subject, schema);
	}
	return valid;
}

function itemSchema(context, subject, schema) {
	var items = schema.items;

	if(typeof items !== 'object')
		throw new Error('Invalid schema: invalid "items"');

	var lastPath = context.path.length;
	for(var i = 0, len = subject.length; i < len; i++) {
		context.path[lastPath] = i;
		if(!validateBase(context, subject[i], items)) {
			context.addError('Failed "items" criteria', subject, items);
			return false;
		}
	}
	context.length = lastPath;

	return true;
}

function tupleItems(context, subject, schema) {
	var items = schema.items,
		lastPath = context.path.length;
	for(var i = 0, len = items.length; i < len; i++) {
		context.path[lastPath] = i;
		if(!validateBase(context, subject[i], items[i])) {
			context.addError('Failed "items" criteria', subject, items);
			return false;
		}
	}
	context.length = lastPath;

	return true;
}

function additionalItems(context, subject, schema) {
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
		if(!validateBase(context, subject[i], additionalItems)) {
			context.addError('Failed "additionalItems" criteria', subject, schema);
			return false;
		}
	}
	context.length = lastPath;

	return true;
}

function minItems(context, subject, schema) {
	if(subject.length < schema.minItems) {
		context.addError('Failed "minItems" criteria', subject, schema);
		return false;
	}

	return true;
}

function maxItems(context, subject, schema) {
	if(subject.length > schema.maxItems) {
		context.addError('Failed "maxItems" criteria', subject, schema);
		return false;
	}

	return true;
}

function uniqueItems(context, subject, schema) {
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


module.exports = function(context, subject, schema) {
	if(!Array.isArray(subject)) {
		context.addError('Failed type:array criteria', schema);
		return false;
	}

	return context.runValidations([
		[ 'minItems' in schema, minItems ],
		[ 'maxItems' in schema, maxItems ],
		[ 'uniqueItems' in schema, uniqueItems ],
		[ 'items' in schema, items ]
	], subject, schema);
};
