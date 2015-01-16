function validateNull(subject, schema, result, context) {
	if(subject !== null) {
		result.addError('Failed type:null criteria', schema, result, context);
		return false;
	}
	return true;
}

module.exports = validateNull;
