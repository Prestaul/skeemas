var validateBase = require('./base'),
	deepEqual = require('./deep-equal');

function items(context, subject, schema, cleanItems) {
	var valid = true;

	if(Array.isArray(schema.items)) {
		valid = tupleItems(context, subject, schema, cleanItems);
		if('additionalItems' in schema) valid = additionalItems(context, subject, schema, cleanItems) && valid;
	} else if(schema.items) {
		valid = itemSchema(context, subject, schema, cleanItems);
	}

	return valid;
}

function itemSchema(context, subject, schema, cleanItems) {
	var items = schema.items;

	if(typeof items !== 'object')
		throw new Error('Invalid schema: invalid "items"');

	var lastPath = context.path.length;
	for(var i = 0, len = subject.length; i < len; i++) {
		context.path[lastPath] = i;
		if(!validateBase(context, subject[i], items)) {
			context.addError('Failed "items" criteria', subject, items);
			context.path.length = lastPath;
			return false;
		}
		cleanItems.push(context.cleanSubject);
	}
	context.path.length = lastPath;

	return true;
}

function tupleItems(context, subject, schema, cleanItems) {
	var items = schema.items,
		lastPath = context.path.length;
	for(var i = 0, len = items.length, lenSubject = subject.length; i < len && i < lenSubject; i++) {
		context.path[lastPath] = i;
		if(!validateBase(context, subject[i], items[i])) {
			context.addError('Failed "items" criteria', subject, items);
			context.path.length = lastPath;
			return false;
		}
		cleanItems.push(context.cleanSubject);
	}
	context.path.length = lastPath;

	return true;
}

function additionalItems(context, subject, schema, cleanItems) {
	var i = schema.items.length,
		len = subject.length,
		additionalItemSchema = schema.additionalItems;

	if(additionalItemSchema === false) {
		if(len <= i) return true;

		context.addError('Failed "additionalItems" criteria: no additional items are allowed', subject, schema);
		return false;
	}

	if(typeof additionalItemSchema !== 'object')
		throw new Error('Invalid schema: invalid "additionalItems"');

	var lastPath = context.path.length;
	for(; i < len; i++) {
		context.path[lastPath] = i;
		if(!validateBase(context, subject[i], additionalItemSchema)) {
			context.addError('Failed "additionalItems" criteria', subject, schema);
			context.path.length = lastPath;
			return false;
		}
		cleanItems.push(context.cleanSubject);
	}
	context.path.length = lastPath;

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

	var cleanItems = [],
		valid = context.runValidations([
			[ 'minItems' in schema, minItems ],
			[ 'maxItems' in schema, maxItems ],
			[ 'uniqueItems' in schema, uniqueItems ],
			[ 'items' in schema, items ]
		], subject, schema, cleanItems);

	if('items' in schema)
		context.cleanSubject = cleanItems;
	else
		context.cleanSubject = subject.slice();

	return valid;
};
