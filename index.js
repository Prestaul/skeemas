var Validator = require('jsonschema').Validator,
	bodyParser = require('body-parser').json();

module.exports = function() {
	var validator = new Validator(),
		schemas = {};

	function addSchema(schema, id) {
		id = id || schema.id;

		if(!id) throw new Error('Cannot add a json schema without an id.');

		schemas[id] = schema;

		validator.addSchema(schema, id);

		return this;
	}

	function validateSchema(schema) {
		if(typeof schema === 'string') {
			if(!(schema in schemas)) throw new Error('The requested json schema (' + schema + ') is not registered.');

			schema = schemas[schema];
		}

		if(!schema) throw new Error('Invalid json schema provided to validate.');

		return schema;
	}

	function middleware(schema) {
		return [bodyParser, function(req, res, next) {
			var result = validate(req.body, schema);

			if(result.valid) return next();

			res.jsend.fail({ validation:result.errors });
		}];
	}

	function validate(val, schema) {
		schema = validateSchema(schema);
		return validator.validate(val, schema);
	}

	return {
		validate: validate,
		bodyParser: middleware,
		add: addSchema
	};
};
