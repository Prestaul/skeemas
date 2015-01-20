function validateNumber(subject, schema, context) {
	if(typeof subject !== 'number') {
		context.addError('Failed type:number criteria', subject, schema);
		return false;
	}

	return true;
}

function validateInteger(subject, schema, context) {
	if(typeof subject !== 'number' || subject !== Math.round(subject)) {
		context.addError('Failed type:integer criteria', subject, schema);
		return false;
	}

	return true;
}

function minimum(subject, schema, context) {
	var valid = (schema.exclusiveMinimum)
		? subject > schema.minimum
		: subject >= schema.minimum;

	if(!valid) context.addError('Failed "minimum" criteria', subject, schema);

	return valid;
}

function maximum(subject, schema, context) {
	var valid = (schema.exclusiveMaximum)
		? subject < schema.maximum
		: subject <= schema.maximum;

	if(!valid) context.addError('Failed "maximum" criteria', subject, schema);

	return valid;
}

function multipleOf(key, subject, schema, context) {
	var valid = !(subject / schema[key] % 1);

	if(!valid) context.addError('Failed "' + key + '" criteria', subject, schema);

	return valid;
}



module.exports = function(subject, schema, context) {
	var valid = true, isType = true;

	if(schema.type === 'number') isType = validateNumber(subject, schema, context);
	if(schema.type === 'integer') isType = validateInteger(subject, schema, context);
	if(isType && 'minimum' in schema) valid = minimum(subject, schema, context) && valid;
	if(isType && 'maximum' in schema) valid = maximum(subject, schema, context) && valid;
	if(isType && schema.multipleOf) valid = multipleOf('multipleOf', subject, schema, context) && valid;
	if(isType && schema.divisibleBy) valid = multipleOf('divisibleBy', subject, schema, context) && valid;

	return isType && valid;
};
