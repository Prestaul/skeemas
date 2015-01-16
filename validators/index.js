exports.types = {
	'array': require('./array'),
	'boolean': require('./boolean'),
	'integer': require('./number'),
	'null': require('./null'),
	'number': require('./number'),
	'object': require('./object'),
	'string': require('./string')
};

// base cannot be required until other validators are added
exports.base = require('./base');
