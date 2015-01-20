var validators = require('./');


function allOf(subject, schemas, context) {
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

function anyOf(subject, schemas, context) {
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

function oneOf(subject, schemas, context) {
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
	var valid = context.silently(function() {
		return !validateBase(subject, schema, context);
	});

	if(valid) return true;

	context.addError('Failed "not" criteria', subject, schema);
	return false;
}

function disallow(type, subject, schema, context) {
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

function validateEnum(subject, values, context) {
	if(!Array.isArray(values))
		throw new Error('Invalid schema: "enum" value must be an array');

	var i = values.length;
	while(i--) {
		if(validators.deepEqual(subject, values[i])) return true;
	}

	context.addError('Failed "enum" criteria', subject, values);
	return false;
}

function validateType(type, subject, schema, context) {
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

function typeValidations(type, subject, schema, context) {
	return validators.types[type](subject, schema, context);
}

function getType(subject) {
	var type = typeof subject;

	if(type === 'object') {
		if(subject === null) return 'null';
		if(Array.isArray(subject)) return 'array';
	}

	if(type === 'number' && subject === Math.round(subject)) return 'integer';

	return type;
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
	if(schema.type) valid = validateType(type, subject, schema, context) && valid;
	if(schema.disallow) valid = disallow(type, subject, schema, context) && valid;
	if(schema['enum']) valid = validateEnum(subject, schema['enum'], context) && valid;
	valid = typeValidations(type, subject, schema, context) && valid;
	if(schema['extends']) valid = validateExtends(subject, schema, context) && valid;
	if(schema.allOf) valid = allOf(subject, schema.allOf, context) && valid;
	if(schema.anyOf) valid = anyOf(subject, schema.anyOf, context) && valid;
	if(schema.oneOf) valid = oneOf(subject, schema.oneOf, context) && valid;
	if(schema.not) valid = not(subject, schema.not, context) && valid;

	if(schema.id) {
		context.id.pop();
	}

	return valid;
}

module.exports = validateBase;
