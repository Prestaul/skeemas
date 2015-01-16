function validateBoolean(subject, schema, result, context) {
	if(typeof subject !== 'boolean') {
		result.addError('Failed type:boolean criteria', schema, result, context);
		return false;
	}
	return true;
}

module.exports = validateBoolean;
