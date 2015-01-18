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

		j = len;
		while(j--) {
			if(key.match(patterns[j])) {
				if(!~handledKeys.indexOf(key)) handledKeys.push(key);
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

	var keys = Object.keys(subject),
		i = keys.length;
	if(additionalProps === false) {
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

	var valid;
	while(i--) {
		if(~handledKeys.indexOf(keys[i])) continue;

		context.path.push(keys[i]);
		valid = validateBase(subject[keys[i]], additionalProps, result, context) && valid;
		context.path.pop();
	}

	return valid;
}

function minProperties(subject, schema, result, context) {
	var keys = Object.keys(subject);
	if(keys.length < schema.minProperties) {
		result.addError('Failed "minProperties" criteria', subject, schema, context);
		return false;
	}
	return true;
}

function maxProperties(subject, schema, result, context) {
	var keys = Object.keys(subject);
	if(keys.length > schema.maxProperties) {
		result.addError('Failed "maxProperties" criteria', subject, schema, context);
		return false;
	}
	return true;
}

function required(subject, requiredProps, result, context) {
	if(!Array.isArray(requiredProps))
		throw new Error('Invalid schema: "required" must be an array');

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

function dependencies(subject, deps, result, context) {
	if(typeof deps !== 'object')
		throw new Error('Invalid schema: "dependencies" must be an object');

	var valid = true,
		keys = Object.keys(deps),
		i = keys.length,
		requiredProps, j;

	while(i--) {
		if(!(keys[i] in subject)) continue;

		requiredProps = deps[keys[i]];

		if(typeof requiredProps === 'string') requiredProps = [ requiredProps ];

		if(Array.isArray(requiredProps)) {
			j = requiredProps.length;
			while(j--) {
				if(!(requiredProps[j] in subject)) {
					result.addError('Missing required property "' + requiredProps[j] + '"', subject, requiredProps[j], context);
					valid = false;
				}
			}
		} else if(typeof requiredProps === 'object') {
			valid = validateBase(subject, requiredProps, result, context) && valid;
		} else {
			throw new Error('Invalid schema: dependencies must be string, array, or object');
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

	if(schema.properties) valid = properties(handledKeys, subject, schema.properties, result, context) && valid;
	if(schema.patternProperties) valid = patternProperties(handledKeys, subject, schema, result, context) && valid;
	if('additionalProperties' in schema) valid = additionalProperties(handledKeys, subject, schema, result, context) && valid;
	if('minProperties' in schema) valid = minProperties(subject, schema, result, context) && valid;
	if('maxProperties' in schema) valid = maxProperties(subject, schema, result, context) && valid;
	if(schema.required) valid = required(subject, schema.required, result, context) && valid;
	if(schema.dependencies) valid = dependencies(subject, schema.dependencies, result, context) && valid;

	return valid;
}

module.exports = validateObject;
