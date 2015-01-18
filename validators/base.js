var validators = require('./'),
	validationResult = require('../validation-result'),
	refs = require('skeemas-json-refs')();


function allOf(subject, schemas, result, context) {
	if(!Array.isArray(schemas))
		throw new Error('Invalid schema: "allOf" value must be an array');

	// @TODO: How do we set the context here?

	var i = schemas.length,
		invalidCount = 0;
	while(i--) {
		if(!validate(subject, schemas[i], result, context)) {
			invalidCount += 1;
		}
	}

	return invalidCount === 0;
}

function anyOf(subject, schemas, result, context) {
	if(!Array.isArray(schemas))
		throw new Error('Invalid schema: "anyOf" value must be an array');

	var resultInner = validationResult(),
		i = schemas.length;
	while(i--) {
		if(validate(subject, schemas[i], resultInner, context)) return true;
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
		if(validate(subject, schemas[i], resultInner, context)) validCount += 1;
	}

	if(validCount === 1) return true;

	result.addError('Failed "oneOf" criteria', subject, schemas, context);
	return false;
}

function not(subject, schema, result, context) {
	if(validate(subject, schema, validationResult(), context)) {
		result.addError('Failed "not" criteria', subject, schema, context);
		return false;
	}
	return true;
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
			if(!(validType in validators.types))
				throw new Error('Invalid schema: invalid type (' + schema.type + ')');

			if(validType === 'integer') return type === 'number';

			return type === validType;
		});

	if(!valid) {
		result.addError('Failed "type" criteria: expecting ' + validTypes.join(' or ') + ', found ' + type, subject, schema, context);
	}

	return valid;
}

function typeValidations(type, subject, schema, result, context) {
	return validators.types[schema.type || type](subject, schema, result, context);
}

function getType(subject) {
	var type = typeof subject;

	if(type === 'object') {
		if(subject === null) return 'null';
		if(Array.isArray(subject)) return 'array';
	}
	return type;
}

function $ref(subject, schema, result, context) {
	var refSchema = refs.get(schema.$ref, subject),
		refContext = {
			schema: refSchema,
			path: context.path.slice()
		};

	return validate(subject, refSchema, result, refContext);
}



function validate(subject, schema, result, context) {
	if(schema.$ref) {
		return $ref(subject, schema, result, context);
	}

	var valid = true,
		type = getType(subject);
	if(schema.type) valid = valid && validateType(type, subject, schema, result, context);
	if(schema['enum']) valid = valid && validateEnum(subject, schema['enum'], result, context);
	valid = valid && typeValidations(type, subject, schema, result, context);
	if(schema.allOf) valid = valid && allOf(subject, schema.allOf, result, context);
	if(schema.anyOf) valid = valid && anyOf(subject, schema.anyOf, result, context);
	if(schema.oneOf) valid = valid && oneOf(subject, schema.oneOf, result, context);
	if(schema.not) valid = valid && not(subject, schema.not, result, context);

	return valid;
}

module.exports = validate;
