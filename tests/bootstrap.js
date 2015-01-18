global.assert = require('chai').assert;
global.validator = require('../')();
validator.refs.add('http://json-schema.org/draft-03/schema', require('./refs/json-schema-draft-03'));
global.validate = validator.validate;
global.validators = require('../validators');
global.validationResult = require('../validation-result');
