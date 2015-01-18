var decode = require('punycode').ucs2.decode,
	formats = {
		'date-time': /^\d{4}-(0[0-9]{1}|1[0-2]{1})-[0-9]{2}[t ]\d{2}:\d{2}:\d{2}(\.\d+)?([zZ]|[+-]\d{2}:\d{2})$/i,
		'date': /^\d{4}-(0[0-9]{1}|1[0-2]{1})-[0-9]{2}$/,
		'time': /^\d{2}:\d{2}:\d{2}$/,
		'color': /^(#[0-9a-f]{3}|#[0-9a-f]{6}|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow)$/i,
		'style': false,
		'phone': false,
		'uri': /^(?:([a-z0-9+.-]+:\/\/)((?:(?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*)@)?((?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*)(:(?:\d*))?(\/(?:[a-z0-9-._~!$&'()*+,;=:@\/]|%[0-9A-F]{2})*)?|([a-z0-9+.-]+:)(\/?(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})+(?:[a-z0-9-._~!$&'()*+,;=:@\/]|%[0-9A-F]{2})*)?)(\?(?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*)?(#(?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*)?$/i,
		'email': /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
		'ip-address': /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
		'ipv6': /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,

		// hostname regex from: http://stackoverflow.com/a/1420225/5628
		'host-name': /^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?)*\.?$/,

		'utc-millisec': function(subject) {
			var parsed = parseInt(subject, 10);

			return !isNaN(parsed) && parsed.toString() === subject.toString();
		},
		'regex': function (subject) {
			try { new RegExp(subject); }
			catch(e) { return false; }
			return true;
		}
	};

function minLength(subject, schema, result, context) {
	if(decode(subject).length < schema.minLength) {
		result.addError('Failed "minLength" criteria', subject, schema, context);
		return false;
	}

	return true;
}

function maxLength(subject, schema, result, context) {
	if(decode(subject).length > schema.maxLength) {
		result.addError('Failed "maxLength" criteria', subject, schema, context);
		return false;
	}

	return true;
}

function pattern(subject, pattern, result, context) {
	if(!subject.match(pattern)) {
		result.addError('Failed "pattern" criteria', subject, pattern, context);
		return false;
	}

	return true;
}

function format(subject, format, result, context) {
	var validator = formats[format];

	if(!validator)
		throw new Error('Invalid schema: unknown format (' + format + ')');

	var valid = validator.test ? validator.test(subject) : validator(subject);
	if(!valid) {
		result.addError('Failed "format" criteria', subject, pattern, context);
	}

	return valid;
}



function validateString(subject, schema, result, context) {
	if(typeof subject !== 'string') {
		result.addError('Failed type:string criteria', schema, result, context);
		return false;
	}

	var valid = true;

	if(schema.minLength) valid = minLength(subject, schema, result, context) && valid;
	if(schema.maxLength) valid = maxLength(subject, schema, result, context) && valid;
	if(schema.pattern) valid = pattern(subject, schema.pattern, result, context) && valid;
	if(schema.format) valid = format(subject, schema.format, result, context) && valid;

	return valid;
}

module.exports = validateString;
