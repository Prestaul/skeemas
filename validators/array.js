function items(subject, items, result, context) {

	return true;
}

function additionalItems(subject, schema, result, context) {

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

	return valid;
};
