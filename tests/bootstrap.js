global.assert = require('chai').assert;
global.validator = require('../')();

validator.refs
	.add('http://json-schema.org/draft-03/schema', require('./refs/json-schema-draft-03'))
	.add('http://json-schema.org/draft-04/schema', require('./refs/json-schema-draft-04'))
	.add('http://localhost:1234/integer.json', require('./json-schema-test-suite/remotes/integer.json'))
	.add('http://localhost:1234/subSchemas.json', require('./json-schema-test-suite/remotes/subSchemas.json'))
	.add('http://localhost:1234/folder/folderInteger.json', require('./json-schema-test-suite/remotes/folder/folderInteger.json'));

global.validate = validator.validate;
global.validators = require('../validators');
global.validationContext = require('../validation-context')
