function validateBoolean(subject, schema, context) {
	if(typeof subject !== 'boolean') {
		context.addError('Failed type:boolean criteria', subject, schema);
		return false;
	}
	return true;
}

module.exports = validateBoolean;
