var validateBase = require('./base');

function properties(handledKeys, subject, props, result, context) {
	var valid = true;
	for(var key in props) {
		if(key in subject) {
			handledKeys.push(key);
			context.path.push(key);
			valid = validateBase(subject[key], props[key], result, context) && valid;
			context.path.pop();
		} else if(props[key].required) {
			result.addError('Failed "required" criteria: missing property (' + key + ')', subject, props, context);
			valid = false;
		}
	}

	return valid;
}

function patternProperties(handledKeys, subject, schema, result, context) {
	var patternProps = schema.patternProperties;

	if(typeof patternProps !== 'object')
		throw new Error('Invalid schema: "patternProperties" must be an object');

	var valid = true,
		patterns = Object.keys(patternProps),
		len = patterns.length,
		keys = Object.keys(subject),
		i = keys.length,
		j, key;

	while(i--) {
		key = keys[i];

		if(~handledKeys.indexOf(key)) continue;

		j = len;
		while(j--) {
			if(key.match(patterns[j])) {
				handledKeys.push(key);
				context.path.push(key);
				valid = validateBase(subject[key], patternProps[patterns[j]], result, context) && valid;
				context.path.pop();
			}
		}
	}

	return valid;
}

function additionalProperties(handledKeys, subject, schema, result, context) {
	var additionalProps = schema.additionalProperties;

	if(additionalProps === true) return true;
	if(additionalProps === false) {
		var keys = Object.keys(subject),
			i = keys.length;
		while(i--) {
			if(!~handledKeys.indexOf(keys[i])) {
				result.addError('Failed "additionalProperties" criteria: unexpected property (' + keys[i] + ')', subject, schema, context);
				return false;
			}
		}
		return true;
	}

	if(typeof additionalProps !== 'object')
		throw new Error('Invalid schema: "additionalProperties" must be a valid schema');

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

	var handledKeys = [];

	if(schema.properties) valid = valid && properties(handledKeys, subject, schema.properties, result, context);
	if(schema.patternProperties) valid = valid && patternProperties(handledKeys, subject, schema, result, context);
	if('additionalProperties' in schema) valid = valid && additionalProperties(handledKeys, subject, schema, result, context);
	if(schema.required) valid = valid && required(subject, schema.required, result, context);

	return valid;
}

module.exports = validateObject;
