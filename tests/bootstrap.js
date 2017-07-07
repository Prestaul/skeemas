var validator = require('../')();

validator
	.addRef('http://json-schema.org/draft-03/schema', require('./refs/json-schema-draft-03'))
	.addRef('http://json-schema.org/draft-04/schema', require('./refs/json-schema-draft-04'))
	.addRef('http://localhost:1234/integer.json', require('./json-schema-test-suite/remotes/integer.json'))
	.addRef('http://localhost:1234/name.json', require('./json-schema-test-suite/remotes/name.json'))
	.addRef('http://localhost:1234/subSchemas.json', require('./json-schema-test-suite/remotes/subSchemas.json'))
	.addRef('http://localhost:1234/folder/folderInteger.json', require('./json-schema-test-suite/remotes/folder/folderInteger.json'));

global.validate = validator.validate.bind(validator);
global.assert = require('chai').assert;
