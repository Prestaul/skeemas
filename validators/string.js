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
	var strPattern = schema.pattern;

	if(!subject.match(strPattern)) {
		context.addError('Failed "pattern" criteria (' + strPattern + ')', subject, strPattern);
		return false;
	}

	return true;
}



function validateString(context, subject, schema) {
	if(typeof subject !== 'string') {
		context.addError('Failed type:string criteria', schema);
		return false;
	}

	context.cleanSubject = subject;

	return context.runValidations([
		[ 'minLength' in schema, minLength ],
		[ 'maxLength' in schema, maxLength ],
		[ 'pattern' in schema, pattern ]
	], subject, schema);
}

module.exports = validateString;
