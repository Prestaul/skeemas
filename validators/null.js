function validateNull(context, subject, schema) {
	if(subject !== null) {
		context.addError('Failed type:null criteria', subject, schema);
		return false;
	}
	return true;
}

module.exports = validateNull;
