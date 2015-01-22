function validateNumber(context, subject, schema) {
	if(typeof subject !== 'number') {
		context.addError('Failed type:number criteria', subject, schema);
		return false;
	}

	return true;
}

function validateInteger(context, subject, schema) {
	if(typeof subject !== 'number' || subject !== Math.round(subject)) {
		context.addError('Failed type:integer criteria', subject, schema);
		return false;
	}

	return true;
}

function minimum(context, subject, schema) {
	var valid = (schema.exclusiveMinimum) ? subject > schema.minimum : subject >= schema.minimum;

	if(!valid) context.addError('Failed "minimum" criteria', subject, schema);

	return valid;
}

function maximum(context, subject, schema) {
	var valid = (schema.exclusiveMaximum) ? subject < schema.maximum : subject <= schema.maximum;

	if(!valid) context.addError('Failed "maximum" criteria', subject, schema);

	return valid;
}

function multipleOf(context, subject, schema, key) {
	key = key || 'multipleOf';

	var valid = (subject / schema[key] % 1) === 0;

	if(!valid) context.addError('Failed "' + key + '" criteria', subject, schema);

	return valid;
}

function divisibleBy(context, subject, schema) {
	return multipleOf(context, subject, schema, 'divisibleBy');
}



module.exports = function(context, subject, schema) {
	var valid = true,
		isType = true;

	if(schema.type === 'number') isType = validateNumber(context, subject, schema);
	if(schema.type === 'integer') isType = validateInteger(context, subject, schema);

	context.cleanSubject = subject;

	return isType && context.runValidations([
		[ 'minimum' in schema, minimum ],
		[ 'maximum' in schema, maximum ],
		[ 'multipleOf' in schema, multipleOf ],
		[ 'divisibleBy' in schema, divisibleBy ]
	], subject, schema);
};
