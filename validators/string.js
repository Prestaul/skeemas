var decode = require('punycode').ucs2.decode,
	formats = {
		'date-time': /^\d{4}-(0[0-9]{1}|1[0-2]{1})-[0-9]{2}[t ]\d{2}:\d{2}:\d{2}(\.\d+)?([zZ]|[+-]\d{2}:\d{2})$/i,
		'date': /^\d{4}-(0[0-9]{1}|1[0-2]{1})-[0-9]{2}$/,
		'time': /^\d{2}:\d{2}:\d{2}$/,
		'color': /^(#[0-9a-f]{3}|#[0-9a-f]{6}|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|orange|purple|red|silver|teal|white|yellow)$/i,
		'style': /^(?:\s*-?[_a-zA-Z]+[_a-zA-Z0-9-]*:[^\n\r\f;]+;)*\s*-?[_a-zA-Z]+[_a-zA-Z0-9-]*:[^\n\r\f;]+;?\s*$/,
		'phone': /^(?:(?:\(?(?:00|\+)(?:[1-4]\d\d|[1-9]\d?)\)?)?[\-\.\ \\\/]?)?(?:(?:\(?\d{1,}\)?[\-\.\ \\\/]?){0,})(?:[\-\.\ \\\/]?(?:#|ext\.?|extension|x)[\-\.\ \\\/]?(?:\d+))?$/i,
		'uri': /^(?:([a-z0-9+.-]+:\/\/)((?:(?:[a-z0-9-._~!$&'()*+,;=:]|%[0-9A-F]{2})*)@)?((?:[a-z0-9-._~!$&'()*+,;=]|%[0-9A-F]{2})*)(:(?:\d*))?(\/(?:[a-z0-9-._~!$&'()*+,;=:@\/]|%[0-9A-F]{2})*)?|([a-z0-9+.-]+:)(\/?(?:[a-z0-9-._~!$&'()*+,;=:@]|%[0-9A-F]{2})+(?:[a-z0-9-._~!$&'()*+,;=:@\/]|%[0-9A-F]{2})*)?)(\?(?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*)?(#(?:[a-z0-9-._~!$&'()*+,;=:\/?@]|%[0-9A-F]{2})*)?$/i,
		'email': /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
		'ipv4': /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
		'ipv6': /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/,

		// hostname regex from: http://stackoverflow.com/a/1420225/5628
		'hostname': /^(?=.{1,255}$)[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?(?:\.[0-9A-Za-z](?:(?:[0-9A-Za-z]|-){0,61}[0-9A-Za-z])?)*\.?$/,

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

// aliases
formats['host-name'] = formats.hostname;
formats['ip-address'] = formats.ipv4;


function minLength(subject, schema, context) {
	if(decode(subject).length < schema.minLength) {
		context.addError('Failed "minLength" criteria', subject, schema);
		return false;
	}

	return true;
}

function maxLength(subject, schema, context) {
	if(decode(subject).length > schema.maxLength) {
		context.addError('Failed "maxLength" criteria', subject, schema);
		return false;
	}

	return true;
}

function pattern(subject, schema, context) {
	var pattern = schema.pattern;

	if(!subject.match(pattern)) {
		context.addError('Failed "pattern" criteria (' + pattern + ')', subject, pattern);
		return false;
	}

	return true;
}

function format(subject, schema, context) {
	var format = schema.format,
		validator = formats[format];

	if(!validator)
		throw new Error('Invalid schema: unknown format (' + format + ')');

	var valid = validator.test ? validator.test(subject) : validator(subject);
	if(!valid) {
		context.addError('Failed "format" criteria (' + format + ')', subject, pattern);
	}

	return valid;
}



function validateString(subject, schema, context) {
	if(typeof subject !== 'string') {
		context.addError('Failed type:string criteria', schema);
		return false;
	}

	var valid = true;

	if('minLength' in schema) valid = minLength(subject, schema, context) && valid;
	if('maxLength' in schema) valid = maxLength(subject, schema, context) && valid;
	if('pattern' in schema) valid = pattern(subject, schema, context) && valid;
	if('format' in schema) valid = format(subject, schema, context) && valid;

	return valid;
}

module.exports = validateString;
