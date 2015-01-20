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


function allOf(context, subject, schema) {
	var schemas = schema.allOf;

	if(!Array.isArray(schemas))
		throw new Error('Invalid schema: "allOf" value must be an array');

	var i = schemas.length,
		invalidCount = 0;
	while(i--) {
		if(!validateBase(context, subject, schemas[i])) {
			invalidCount += 1;
		}
	}

	if(invalidCount === 0) return true;

	context.addError('Failed "allOf" criteria', subject, schemas);
	return false;
}

function anyOf(context, subject, schema) {
	var schemas = schema.anyOf;

	if(!Array.isArray(schemas))
		throw new Error('Invalid schema: "anyOf" value must be an array');

	var matched = context.silently(function() {
		var i = schemas.length;
		while(i--) {
			if(validateBase(context, subject, schemas[i])) return true;
		}
		return false;
	});

	if(matched) return true;

	context.addError('Failed "anyOf" criteria', subject, schemas);
	return false;
}

function oneOf(context, subject, schema) {
	var schemas = schema.oneOf;

	if(!Array.isArray(schemas))
		throw new Error('Invalid schema: "oneOf" value must be an array');

	var i = schemas.length,
		validCount = 0;
	context.silently(function() {
		while(i--) {
			if(validateBase(context, subject, schemas[i])) validCount += 1;
		}
	});

	if(validCount === 1) return true;

	context.addError('Failed "oneOf" criteria', subject, schemas);
	return false;
}

function not(context, subject, schema) {
	var badSchema = schema.not,
		valid = context.silently(function() {
			return !validateBase(context, subject, badSchema);
		});

	if(valid) return true;

	context.addError('Failed "not" criteria', subject, schema);
	return false;
}

function disallow(context, subject, schema, type) {
	var invalidTypes = Array.isArray(schema.disallow) ? schema.disallow : [ schema.disallow ],
		valid = !invalidTypes.some(function(invalidType) {
			if(invalidType === 'any') return true;

			if(typeof invalidType === 'object') {
				return context.silently(function() {
					return validateBase(context, subject, invalidType);
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

function validateExtends(context, subject, schema) {
	var schemas = Array.isArray(schema["extends"]) ? schema["extends"] : [ schema["extends"] ];

	var i = schemas.length,
		invalidCount = 0;
	while(i--) {
		if(!validateBase(context, subject, schemas[i])) {
			invalidCount += 1;
		}
	}

	return invalidCount === 0;
}

function validateEnum(context, subject, schema) {
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

function validateType(context, subject, schema, type) {
	var validTypes = Array.isArray(schema.type) ? schema.type : [ schema.type ],
		valid = validTypes.some(function(validType) {
			if(validType === 'any') return true;

			if(typeof validType === 'object') {
				return context.silently(function() {
					return validateBase(context, subject, validType);
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

function typeValidations(context, subject, schema, type) {
	return validators.types[type](context, subject, schema);
}

function $ref(context, subject, schema) {
	var absolute = /^#|\//.test(schema.$ref),
		ref = absolute ? schema.$ref : context.id.join('') + schema.$ref,
		refSchema = context.refs.get(ref, context.schema);

	if(schema.$ref[0] !== '#') {
		context = context.subcontext(context.refs.get(ref, context.schema, true));
	}

	return validateBase(context, subject, refSchema);
}



function runValidations(validations, context, subject, schema) {
	var breakOnError = context.breakOnError,
		args = Array.prototype.slice.call(arguments, 1),
		valid = true,
		validation;

	for(var i = 0, len = validations.length; i < len; i++) {
		validation = validations[i];
		if(!validation[0]) continue;
		valid = validation[1].apply(null, args) && valid;
		if(breakOnError && !valid) return false;
	}

	return valid;
}


function validateBase(context, subject, schema) {
	if(schema.$ref) {
		return $ref(context, subject, schema);
	}

	if(schema.id) {
		context.id.push(schema.id);
	}

	var valid = context.runValidations([
		[ 'type' in schema, validateType ],
		[ 'disallow' in schema, disallow ],
		[ 'enum' in schema, validateEnum ],
		[ true, typeValidations ],
		[ 'extends' in schema, validateExtends ],
		[ 'allOf' in schema, allOf ],
		[ 'anyOf' in schema, anyOf ],
		[ 'oneOf' in schema, oneOf ],
		[ 'not' in schema, not ]
	], subject, schema, getType(subject));

	if(schema.id) {
		context.id.pop();
	}

	return valid;
}

module.exports = validateBase;
