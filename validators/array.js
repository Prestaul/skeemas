function validateArray(subject, schema, result, context) {
	if(!Array.isArray(subject)) {
		result.addError('Failed type:array criteria', schema, result, context);
		return false;
	}

	return true;
}

module.exports = validateArray;
