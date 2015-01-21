var decode = require('punycode').ucs2.decode;


function minLength(context, subject, schema) {
	if(decode(subject).length < schema.minLength) {
		context.addError('Failed "minLength" criteria', subject, schema);
		return false;
	}

	return true;
}

function maxLength(context, subject, schema) {
	if(decode(subject).length > schema.maxLength) {
		context.addError('Failed "maxLength" criteria', subject, schema);
		return false;
	}

	return true;
}

function pattern(context, subject, schema) {
	var pattern = schema.pattern;

	if(!subject.match(pattern)) {
		context.addError('Failed "pattern" criteria (' + pattern + ')', subject, pattern);
		return false;
	}

	return true;
}



function validateString(context, subject, schema) {
	if(typeof subject !== 'string') {
		context.addError('Failed type:string criteria', schema);
		return false;
	}

	return context.runValidations([
		[ 'minLength' in schema, minLength ],
		[ 'maxLength' in schema, maxLength ],
		[ 'pattern' in schema, pattern ]
	], subject, schema);
}

module.exports = validateString;
