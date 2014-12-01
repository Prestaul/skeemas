var assert = require('chai').assert,
	schemas = require('./')();

var schemaString = { type:'string' },
	schemaNumber = { id:'/numberthing', type:'number' },
	schemaObject = { type:'object', properties: { foo:{ type:'string', required:true }}},
	schemaObjectRef = { type:'object', properties: { foo:{ '$ref':'stringthing' }, answer:{ '$ref':'numberthing' }}};

schemas.add(schemaString, '/stringthing');
schemas.add(schemaNumber);

describe('Schemas', function() {
	it('should be defined properly', function() {
		assert.isObject(schemas);

		assert.property(schemas, 'add');
		assert.isFunction(schemas.add);

		assert.property(schemas, 'validate');
		assert.isFunction(schemas.validate);
	});

	it('should validate a simple schema', function() {
		var result = schemas.validate('foo', schemaString);
		assert.isObject(result);
		assert.isTrue(result.valid);
	});

	it('should invalidate a simple schema', function() {
		var result = schemas.validate(41, schemaString);
		assert.isFalse(result.valid);
	});

	it('should validate an object', function() {
		var result = schemas.validate({ foo:'bar' }, schemaObject);
		assert.isTrue(result.valid);
	});

	it('should invalidate an object', function() {
		var result = schemas.validate({ boo:'far' }, schemaObject);
		assert.isFalse(result.valid);
	});

	it('should validate against schema added with id argument', function() {
		var result = schemas.validate('foo', '/stringthing');
		assert.isObject(result);
		assert.isTrue(result.valid);
	});

	it('should invalidate against schema added with id argument', function() {
		var result = schemas.validate(41, '/stringthing');
		assert.isFalse(result.valid);
	});

	it('should validate against schema added with id property', function() {
		var result = schemas.validate(42, '/numberthing');
		assert.isObject(result);
		assert.isTrue(result.valid);
	});

	it('should invalidate against schema added with id property', function() {
		var result = schemas.validate('boo', '/numberthing');
		assert.isFalse(result.valid);
	});

	it('should validate against a schema with a reference', function() {
		var result = schemas.validate({ foo:'bar', answer:42 }, schemaObjectRef);
		assert.isObject(result);
		assert.isTrue(result.valid);
	});

	it('should validate against a schema with a reference', function() {
		var result = schemas.validate({ foo:41, answer:'foo' }, schemaObjectRef);
		assert.isFalse(result.valid);
		assert.isArray(result.errors);
		assert.lengthOf(result.errors, 2);
	});

	it('should throw an error if schema id is not regiestered', function() {
		assert.throws(function() {
			schemas.validate('boo', '/anotherthing');
		}, 'The requested json schema (/anotherthing) is not registered.');
	});
});
