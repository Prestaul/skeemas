var validators = require('./'),
	validationResult = require('../validation-result');


function allOf(subject, schemas, result, context) {
	if(!Array.isArray(schemas))
		throw new Error('Invalid schema: "allOf" value must be an array');

	var i = schemas.length,
		invalidCount = 0;
	while(i--) {
		if(!validateBase(subject, schemas[i], result, context)) {
			invalidCount += 1;
		}
	}

	return invalidCount === 0;
}

function anyOf(subject, schemas, result, context) {
	if(!Array.isArray(schemas))
		throw new Error('Invalid schema: "anyOf" value must be an array');

	var i = schemas.length;
	while(i--) {
		if(validateBase(subject, schemas[i], validationResult(), context)) return true;
	}

	result.addError('Failed "anyOf" criteria', subject, schemas, context);
	return false;
}

function oneOf(subject, schemas, result, context) {
	if(!Array.isArray(schemas))
		throw new Error('Invalid schema: "oneOf" value must be an array');

	var resultInner = validationResult(),
		i = schemas.length,
		validCount = 0;
	while(i--) {
		if(validateBase(subject, schemas[i], resultInner, context)) validCount += 1;
	}

	if(validCount === 1) return true;

	result.addError('Failed "oneOf" criteria', subject, schemas, context);
	return false;
}

function not(subject, schema, result, context) {
	if(validateBase(subject, schema, validationResult(), context)) {
		result.addError('Failed "not" criteria', subject, schema, context);
		return false;
	}
	return true;
}

function disallow(type, subject, schema, result, context) {
	var invalidTypes = Array.isArray(schema.disallow) ? schema.disallow : [ schema.disallow ],
		valid = !invalidTypes.some(function(invalidType) {
			if(invalidType === 'any') return true;

			if(typeof invalidType === 'object') {
				return validateBase(subject, invalidType, validationResult(), context);
			}

			if(!(invalidType in validators.types))
				throw new Error('Invalid schema: invalid type (' + invalidType + ')');

			if(invalidType === 'number' && type === 'integer') return true;

			return type === invalidType;
		});

	if(!valid) {
		result.addError('Failed "disallow" criteria: expecting ' + invalidTypes.join(' or ') + ', found ' + type, subject, schema, context);
	}

	return valid;
}

function validateExtends(subject, schema, result, context) {
	var schemas = Array.isArray(schema["extends"]) ? schema["extends"] : [ schema["extends"] ];

	var i = schemas.length,
		invalidCount = 0;
	while(i--) {
		if(!validateBase(subject, schemas[i], result, context)) {
			invalidCount += 1;
		}
	}

	return invalidCount === 0;
}

function validateEnum(subject, values, result, context) {
	if(!Array.isArray(values))
		throw new Error('Invalid schema: "enum" value must be an array');

	var i = values.length;
	while(i--) {
		if(validators.deepEqual(subject, values[i])) return true;
	}

	result.addError('Failed "enum" criteria', subject, values, context);
	return false;
}

function validateType(type, subject, schema, result, context) {
	var validTypes = Array.isArray(schema.type) ? schema.type : [ schema.type ],
		valid = validTypes.some(function(validType) {
			if(validType === 'any') return true;

			if(typeof validType === 'object') {
				return validateBase(subject, validType, validationResult(), context);
			}

			if(!(validType in validators.types))
				throw new Error('Invalid schema: invalid type (' + validType + ')');

			if(validType === 'number' && type === 'integer') return true;

			return type === validType;
		});

	if(!valid) {
		result.addError('Failed "type" criteria: expecting ' + validTypes.join(' or ') + ', found ' + type, subject, schema, context);
	}

	return valid;
}

function typeValidations(type, subject, schema, result, context) {
	return validators.types[type](subject, schema, result, context);
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

function $ref(subject, schema, result, context) {
	var absolute = /^#|\//.test(schema.$ref),
		ref = absolute ? schema.$ref : context.id.join('') + schema.$ref,
		refSchema = context.refs.get(ref, context.schema);
	if(schema.$ref[0] !== '#') {
		context = {
			id: [],
			schema: context.refs.get(ref, context.schema, true),
			path: context.path.slice(),
			refs: context.refs
		};
	}

	return validateBase(subject, refSchema, result, context);
}



function validateBase(subject, schema, result, context) {
	if(schema.$ref) {
		return $ref(subject, schema, result, context);
	}

	if(schema.id) {
		context.id.push(schema.id);
	}

	var valid = true,
		type = getType(subject);
	if(schema.type) valid = validateType(type, subject, schema, result, context) && valid;
	if(schema.disallow) valid = disallow(type, subject, schema, result, context) && valid;
	if(schema['enum']) valid = validateEnum(subject, schema['enum'], result, context) && valid;
	valid = typeValidations(type, subject, schema, result, context) && valid;
	if(schema['extends']) valid = validateExtends(subject, schema, result, context) && valid;
	if(schema.allOf) valid = allOf(subject, schema.allOf, result, context) && valid;
	if(schema.anyOf) valid = anyOf(subject, schema.anyOf, result, context) && valid;
	if(schema.oneOf) valid = oneOf(subject, schema.oneOf, result, context) && valid;
	if(schema.not) valid = not(subject, schema.not, result, context) && valid;

	if(schema.id) {
		context.id.pop();
	}

	return valid;
}

module.exports = validateBase;
