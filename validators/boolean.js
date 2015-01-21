function validateBoolean(context, subject, schema) {
	if(typeof subject !== 'boolean') {
		context.addError('Failed type:boolean criteria', subject, schema);
		return false;
	}

	context.cleanSubject = subject;

	return true;
}

module.exports = validateBoolean;
