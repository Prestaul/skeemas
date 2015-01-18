var validateBase = require('./base');

function properties(keys, subject, props, result, context) {
	var valid = true;
	for(var key in props) {
		if(key in subject) {
			keys.push(key);
			valid = valid && validateBase(subject[key], props[key], result, context.path.concat(key));
		} else if(props[key].required) {
			result.addError('Failed "required" criteria: missing property (' + key + ')', subject, props, context);
			valid = false;
		}
	}

	return valid;
}

function patternProperties(keys, subject, patternProps, result, context) {
	if(!Array.isArray(patternProps))
		throw new Error();


	return true;
}

function additionalProperties(keys, subject, additionalProps, result, context) {
	if(!Array.isArray(additionalProps))
		throw new Error();


	return true;
}

function required(subject, requiredProps, result, context) {
	if(!Array.isArray(requiredProps))
		throw new Error();

	var valid = true,
		i = requiredProps.length;
	while(i--) {
		if(!(requiredProps[i] in subject)) {
			result.addError('Missing required property "' + requiredProps[i] + '"', subject, requiredProps[i], context);
			valid = false;
		}
	}

	return valid;
}


function validateObject(subject, schema, result, context) {
	var valid = true;

	if(typeof subject !== 'object') {
		result.addError('Failed type:object criteria', subject, schema, context);
		valid = false;
	}

	var keys = [];

	if(schema.properties) valid = valid && properties(keys, subject, schema.properties, result, context);
	if(schema.patternProperties) valid = valid && patternProperties(keys, subject, schema.patternProperties, result, context);
	if(schema.additionalProperties) valid = valid && additionalProperties(keys, subject, schema.additionalProperties, result, context);
	if(schema.required) valid = valid && required(subject, schema.required, result, context);

	return valid;
}

module.exports = validateObject;
