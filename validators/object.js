var validateBase = require('./base');

function properties(context, subject, schema, handledProps) {
	var props = schema.properties,
		valid = true;
	for(var key in props) {
		if(key in subject) {
			context.path.push(key);
			valid = validateBase(context, subject[key], props[key]) && valid;
			context.path.pop();
			handledProps[key] = context.cleanSubject;
		} else if(props[key].required === true) {
			context.addError('Failed "required" criteria: missing property (' + key + ')', subject, props);
			valid = false;
		}
	}

	return valid;
}

function patternProperties(context, subject, schema, handledProps) {
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
				context.path.push(key);
				valid = validateBase(context, subject[key], patternProps[patterns[j]]) && valid;
				context.path.pop();
				if(!(key in handledProps)) handledProps[key] = context.cleanSubject;
			}
		}
	}

	return valid;
}

function additionalProperties(context, subject, schema, handledProps) {
	var additionalProps = schema.additionalProperties;

	if(additionalProps === true) return true;

	var keys = Object.keys(subject),
		i = keys.length;
	if(additionalProps === false) {
		while(i--) {
			if(!(keys[i] in handledProps)) {
				context.addError('Failed "additionalProperties" criteria: unexpected property (' + keys[i] + ')', subject, schema);
				return false;
			}
		}
		return true;
	}

	if(typeof additionalProps !== 'object')
		throw new Error('Invalid schema: "additionalProperties" must be a valid schema');

	var valid;
	while(i--) {
		if(keys[i] in handledProps) continue;

		context.path.push(keys[i]);
		valid = validateBase(context, subject[keys[i]], additionalProps) && valid;
		context.path.pop();
		handledProps[keys[i]] = context.cleanSubject;
	}

	return valid;
}

function minProperties(context, subject, schema) {
	var keys = Object.keys(subject);
	if(keys.length < schema.minProperties) {
		context.addError('Failed "minProperties" criteria', subject, schema);
		return false;
	}
	return true;
}

function maxProperties(context, subject, schema) {
	var keys = Object.keys(subject);
	if(keys.length > schema.maxProperties) {
		context.addError('Failed "maxProperties" criteria', subject, schema);
		return false;
	}
	return true;
}

function required(context, subject, schema) {
	var requiredProps = schema.required;

	if(!Array.isArray(requiredProps))
		throw new Error('Invalid schema: "required" must be an array');

	var valid = true,
		i = requiredProps.length;
	while(i--) {
		if(!(requiredProps[i] in subject)) {
			context.addError('Missing required property "' + requiredProps[i] + '"', subject, requiredProps[i]);
			valid = false;
		}
	}

	return valid;
}

function dependencies(context, subject, schema) {
	var deps = schema.dependencies;

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
					context.addError('Missing required property "' + requiredProps[j] + '"', subject, requiredProps[j]);
					valid = false;
				}
			}
		} else if(typeof requiredProps === 'object') {
			valid = validateBase(context, subject, requiredProps) && valid;
		} else {
			throw new Error('Invalid schema: dependencies must be string, array, or object');
		}
	}

	return valid;
}

function addDefaults(subject, schema) {
	var props = schema.properties;

	if(!props) return;

	for(var key in props) {
		if('default' in props[key] && !(key in subject)) {
			subject[key] = props[key].default;
		}
	}
}


function validateObject(context, subject, schema) {
	if(typeof subject !== 'object') {
		context.addError('Failed type:object criteria', subject, schema);
		return false;
	}

	var handledProps = {},
		valid = context.runValidations([
			[ 'properties' in schema, properties ],
			[ 'patternProperties' in schema, patternProperties ],
			[ 'additionalProperties' in schema, additionalProperties ],
			[ 'minProperties' in schema, minProperties ],
			[ 'maxProperties' in schema, maxProperties ],
			[ Array.isArray(schema.required), required ],
			[ 'dependencies' in schema, dependencies ]
		], subject, schema, handledProps);

	if(context.cleanWithDefaults) addDefaults(handledProps, schema);

	context.cleanSubject = handledProps;

	return valid;
}

module.exports = validateObject;
