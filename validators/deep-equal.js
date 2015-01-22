function getType(subject) {
	var type = typeof subject;

	if(type === 'object') {
		if(subject === null) return 'null';
		if(Array.isArray(subject)) return 'array';
	}
	return type;
}

function arrayEqual(a, b) {
	var i = a.length;

	if(i !== b.length) return false;

	while(i--) {
		if(!deepEqual(a[i], b[i])) return false;
	}

	return true;
}

function objectEqual(a, b) {
	var keys = Object.keys(a),
		i = keys.length;

	if(i !== Object.keys(b).length) return false;

	while(i--) {
		if(!deepEqual(a[keys[i]], b[keys[i]])) return false;
	}

	return true;
}

var deepEqual = module.exports = function(a, b) {
	if(a === b) return true;

	var t = getType(a);

	if(t !== getType(b)) return false;

	if(t === 'array') return arrayEqual(a, b);
	if(t === 'object') return objectEqual(a, b);

	return false;
};
