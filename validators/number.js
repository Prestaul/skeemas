function validateNumber(subject, schema, result, context) {
	if(typeof subject !== 'number') {
		result.addError('Failed type:number criteria', subject, schema, context);
		return false;
	}

	return true;
}

function validateInteger(subject, schema, result, context) {
	if(typeof subject !== 'number' || subject !== Math.round(subject)) {
		result.addError('Failed type:integer criteria', subject, schema, context);
		return false;
	}

	return true;
}

function minimum(subject, schema, result, context) {
	var valid = (schema.exclusiveMinimum)
		? subject > schema.minimum
		: subject >= schema.minimum;

	if(!valid) result.addError('Failed "minimum" criteria', subject, schema, context);

	return valid;
}

function maximum(subject, schema, result, context) {
	var valid = (schema.exclusiveMaximum)
		? subject < schema.maximum
		: subject <= schema.maximum;

	if(!valid) result.addError('Failed "maximum" criteria', subject, schema, context);

	return valid;
}

function multipleOf(key, subject, schema, result, context) {
	var valid = !(subject / schema[key] % 1);

	if(!valid) result.addError('Failed "' + key + '" criteria', subject, schema, context);

	return valid;
}



module.exports = function(subject, schema, result, context) {
	var valid = true, isType = true;

	if(schema.type === 'number') isType = validateNumber(subject, schema, result, context);
	if(schema.type === 'integer') isType = validateInteger(subject, schema, result, context);
	if(isType && 'minimum' in schema) valid = minimum(subject, schema, result, context) && valid;
	if(isType && 'maximum' in schema) valid = maximum(subject, schema, result, context) && valid;
	if(isType && schema.multipleOf) valid = multipleOf('multipleOf', subject, schema, result, context) && valid;
	if(isType && schema.divisibleBy) valid = multipleOf('divisibleBy', subject, schema, result, context) && valid;

	return isType && valid;
};
