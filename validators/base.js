var validators = require('./');

function getType(subject) {
	var type = typeof subject;

	if(type === 'object') {
		if(subject === null) return 'null';
		if(Array.isArray(subject)) return 'array';
	}

	if(type === 'number' && subject === Math.round(subject)) return 'integer';

	return type;
}


function allOf(subject, schema, context) {
	var schemas = schema.allOf;

	if(!Array.isArray(schemas))
		throw new Error('Invalid schema: "allOf" value must be an array');

	var i = schemas.length,
		invalidCount = 0;
	while(i--) {
		if(!validateBase(subject, schemas[i], context)) {
			invalidCount += 1;
		}
	}

	if(invalidCount === 0) return true;

	context.addError('Failed "allOf" criteria', subject, schemas);
	return false;
}

function anyOf(subject, schema, context) {
	var schemas = schema.anyOf;

	if(!Array.isArray(schemas))
		throw new Error('Invalid schema: "anyOf" value must be an array');

	var matched = context.silently(function() {
		var i = schemas.length;
		while(i--) {
			if(validateBase(subject, schemas[i], context)) return true;
		}
		return false;
	});

	if(matched) return true;

	context.addError('Failed "anyOf" criteria', subject, schemas);
	return false;
}

function oneOf(subject, schema, context) {
	var schemas = schema.oneOf;

	if(!Array.isArray(schemas))
		throw new Error('Invalid schema: "oneOf" value must be an array');

	var i = schemas.length,
		validCount = 0;
	context.silently(function() {
		while(i--) {
			if(validateBase(subject, schemas[i], context)) validCount += 1;
		}
	});

	if(validCount === 1) return true;

	context.addError('Failed "oneOf" criteria', subject, schemas);
	return false;
}

function not(subject, schema, context) {
	var badSchema = schema.not,
		valid = context.silently(function() {
			return !validateBase(subject, badSchema, context);
		});

	if(valid) return true;

	context.addError('Failed "not" criteria', subject, schema);
	return false;
}

function disallow(subject, schema, context, type) {
	var invalidTypes = Array.isArray(schema.disallow) ? schema.disallow : [ schema.disallow ],
		valid = !invalidTypes.some(function(invalidType) {
			if(invalidType === 'any') return true;

			if(typeof invalidType === 'object') {
				return context.silently(function() {
					return validateBase(subject, invalidType, context);
				});
			}

			if(!(invalidType in validators.types))
				throw new Error('Invalid schema: invalid type (' + invalidType + ')');

			if(invalidType === 'number' && type === 'integer') return true;

			return type === invalidType;
		});

	if(!valid) {
		context.addError('Failed "disallow" criteria: expecting ' + invalidTypes.join(' or ') + ', found ' + type, subject, schema);
	}

	return valid;
}

function validateExtends(subject, schema, context) {
	var schemas = Array.isArray(schema["extends"]) ? schema["extends"] : [ schema["extends"] ];

	var i = schemas.length,
		invalidCount = 0;
	while(i--) {
		if(!validateBase(subject, schemas[i], context)) {
			invalidCount += 1;
		}
	}

	return invalidCount === 0;
}

function validateEnum(subject, schema, context) {
	var values = schema['enum'];

	if(!Array.isArray(values))
		throw new Error('Invalid schema: "enum" value must be an array');

	var i = values.length;
	while(i--) {
		if(validators.deepEqual(subject, values[i])) return true;
	}

	context.addError('Failed "enum" criteria', subject, values);
	return false;
}

function validateType(subject, schema, context, type) {
	var validTypes = Array.isArray(schema.type) ? schema.type : [ schema.type ],
		valid = validTypes.some(function(validType) {
			if(validType === 'any') return true;

			if(typeof validType === 'object') {
				return context.silently(function() {
					return validateBase(subject, validType, context);
				});
			}

			if(!(validType in validators.types))
				throw new Error('Invalid schema: invalid type (' + validType + ')');

			if(validType === 'number' && type === 'integer') return true;

			return type === validType;
		});

	if(!valid) {
		context.addError('Failed "type" criteria: expecting ' + validTypes.join(' or ') + ', found ' + type, subject, schema);
	}

	return valid;
}

function typeValidations(subject, schema, context, type) {
	return validators.types[type](subject, schema, context);
}

function $ref(subject, schema, context) {
	var absolute = /^#|\//.test(schema.$ref),
		ref = absolute ? schema.$ref : context.id.join('') + schema.$ref,
		refSchema = context.refs.get(ref, context.schema);

	if(schema.$ref[0] !== '#') {
		context = context.subcontext(context.refs.get(ref, context.schema, true));
	}

	return validateBase(subject, refSchema, context);
}



function validateBase(subject, schema, context) {
	if(schema.$ref) {
		return $ref(subject, schema, context);
	}

	if(schema.id) {
		context.id.push(schema.id);
	}

	var valid = true,
		type = getType(subject);
	if('type' in schema) valid = validateType(subject, schema, context, type) && valid;
	if('disallow' in schema) valid = disallow(subject, schema, context, type) && valid;
	if('enum' in schema) valid = validateEnum(subject, schema, context) && valid;
	valid = typeValidations(subject, schema, context, type) && valid;
	if('extends' in schema) valid = validateExtends(subject, schema, context) && valid;
	if('allOf' in schema) valid = allOf(subject, schema, context) && valid;
	if('anyOf' in schema) valid = anyOf(subject, schema, context) && valid;
	if('oneOf' in schema) valid = oneOf(subject, schema, context) && valid;
	if('not' in schema) valid = not(subject, schema, context) && valid;

	if(schema.id) {
		context.id.pop();
	}

	return valid;
}

module.exports = validateBase;
