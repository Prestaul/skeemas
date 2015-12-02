var skeemas = require('../');

describe('Validate', function() {
	it('should throw an error if missing schema', function() {
		assert.throws(function() {
			validate('test');
		});
	});

	it('should throw an error if adding a reference schema without a uri/id', function() {
		assert.throws(function() {
			skeemas().addRef({});
		});
	});

	describe('an empty schema', function() {
		it('should validate an array', function() {
			assert.isTrue(validate([], {}).valid);
		});

		it('should validate a boolean true value', function() {
			assert.isTrue(validate(true, {}).valid);
		});

		it('should validate a boolean false value', function() {
			assert.isTrue(validate(false, {}).valid);
		});

		it('should validate an integer', function() {
			assert.isTrue(validate(42, {}).valid);
		});

		it('should validate a null', function() {
			assert.isTrue(validate(null, {}).valid);
		});

		it('should validate a number', function() {
			assert.isTrue(validate(42.1337, {}).valid);
		});

		it('should validate an object', function() {
			assert.isTrue(validate({ test:true }, {}).valid);
		});

		it('should validate an empty object', function() {
			assert.isTrue(validate({}, {}).valid);
		});

		it('should validate a string', function() {
			assert.isTrue(validate('test', {}).valid);
		});

		it('should validate an empty string', function() {
			assert.isTrue(validate('', {}).valid);
		});
	});

	describe('result object', function() {
		it('should have valid:true when valid', function() {
			var result = validate('test', {});
			assert.isTrue(result.valid);
		});

		it('should have valid:false when invalid', function() {
			var result = validate('test', { type:'object' });
			assert.isFalse(result.valid);
		});

		it('should have an empty errors array when valid', function() {
			var result = validate('test', {});
			assert.isArray(result.errors);
			assert.lengthOf(result.errors, 0);
		});

		it('should have populated errors array when invalid', function() {
			var result = validate('test', { type:'object' });
			assert.isArray(result.errors);
			assert.lengthOf(result.errors, 1);
		});

		it('should have multiple errors when multiple conditions are invalid', function() {
			var result = validate('test', { enum:['foobar'], minLength:5 });
			assert.isArray(result.errors);
			assert.lengthOf(result.errors, 2);
		});

		it('should have single error if breakOnError', function() {
			var result = validate('test', { enum:['foobar'], minLength:5 }, { breakOnError:true });
			assert.isArray(result.errors);
			assert.lengthOf(result.errors, 1);
		});
	});

	describe('result.cleanInstance', function() {
		it('should leave null untouched', function() {
			var result = validate(null, { type:'null' });
			assert.strictEqual(result.cleanInstance, null);
		});

		it('should leave true untouched', function() {
			var result = validate(true, { type:'boolean' });
			assert.strictEqual(result.cleanInstance, true);
		});

		it('should leave false untouched', function() {
			var result = validate(false, { type:'boolean' });
			assert.strictEqual(result.cleanInstance, false);
		});

		it('should leave an integer untouched', function() {
			var result = validate(1337, { type:'integer' });
			assert.strictEqual(result.cleanInstance, 1337);
		});

		it('should leave a number untouched', function() {
			var result = validate(42.1337, { type:'number' });
			assert.strictEqual(result.cleanInstance, 42.1337);
		});

		it('should leave a string untouched', function() {
			var result = validate('test', { type:'string' });
			assert.strictEqual(result.cleanInstance, 'test');
		});

		it('should clone an array', function() {
			var subject = [1, 2, 3],
				result = validate(subject, { type:'array' });
			assert.deepEqual(result.cleanInstance, subject);
			assert.notStrictEqual(result.cleanInstance, subject);
		});

		describe('an object', function() {
			it('should leave defined properties', function() {
				var result = validate({
					foo: 'bar',
					foobar: 42,
					foobat: [1, 'test'],
					foobaz: 'far',
					boo: 'far',
					boofar: 'bad'
				}, {
					properties: {
						foo: {},
						boo: {}
					}
				});

				assert.deepEqual(result.cleanInstance, {
					foo: 'bar',
					boo: 'far'
				});
			});

			it('should leave pattern properties', function() {
				var result = validate({
					foo: 'bar',
					foobar: 42,
					foobat: [1, 'test'],
					foobaz: 'far',
					boo: 'far',
					boofar: 'bad'
				}, {
					properties: {
						boo: {}
					},
					patternProperties: {
						'^foo': {}
					}
				});

				assert.deepEqual(result.cleanInstance, {
					foo: 'bar',
					foobar: 42,
					foobat: [1, 'test'],
					foobaz: 'far',
					boo: 'far'
				});
			});

			it('should remove undefined additional properties', function() {
				var result = validate({
					foo: 'bar',
					foobar: 42,
					boo: 'far'
				}, {
					properties: {
						foo: {}
					},
					additionalProperties: true
				});

				assert.deepEqual(result.cleanInstance, {
					foo: 'bar'
				});
			});

			it('should leave defined additional properties', function() {
				var result = validate({
					foo: 'bar',
					foobar: 42,
					boo: 'far'
				}, {
					properties: {
						foo: {}
					},
					additionalProperties: { type:'any' }
				});

				assert.deepEqual(result.cleanInstance, {
					foo: 'bar',
					foobar: 42,
					boo: 'far'
				});
			});

			it('should leave defined nested properties', function() {
				var result = validate({
					foo: 'bar',
					boo: 'far',
					nested: {
						foo: 'nestbar',
						boo: 'nestfar',
						arr: [{
							foo:'arrfoo',
							boo:'nestbar'
						}]
					}
				}, {
					definitions: {
						foo: {
							properties: {
								foo: {},
								arr: {
									items: { $ref:'#/definitions/foo' }
								},
								nested: { $ref:'#/definitions/foo' }
							}
						}
					},
					$ref:'#/definitions/foo'
				});

				assert.deepEqual(result.cleanInstance, {
					foo: 'bar',
					nested: {
						foo: 'nestbar',
						arr: [{
							foo:'arrfoo'
						}]
					}
				});
			});

			it('should clean instance properly even with reference properties', function() {
				var localValidator = skeemas().addRef('/ref', {}),
					result = localValidator.validate({
						foo: 'bar',
						boo: 'far'
					}, {
						properties: {
							foo: { '$ref':'/ref' },
							boo: {}
						}
					});

				assert.deepEqual(result.cleanInstance, {
					foo: 'bar',
					boo: 'far'
				});
			});

			describe('with cleanWithDefaults', function() {
				it('should add defaults', function() {
					var result = validate({}, {
						properties: {
							foo: { default:'bar' },
							boo: { default:'far' }
						}
					}, { cleanWithDefaults:true });

					assert.deepEqual(result.cleanInstance, {
						foo: 'bar',
						boo: 'far'
					});
				});

				it('should not override values with defaults', function() {
					var result = validate({
						foo: 'bat'
					}, {
						properties: {
							foo: { default:'bar' },
							boo: { default:'far' }
						}
					}, { cleanWithDefaults:true });

					assert.deepEqual(result.cleanInstance, {
						foo: 'bat',
						boo: 'far'
					});
				});

				it('should add complex default', function() {
					var result = validate({}, {
						properties: {
							foo: { default: { bar:'bat' } }
						}
					}, { cleanWithDefaults:true });

					assert.deepEqual(result.cleanInstance, {
						foo: { bar:'bat' }
					});
				});

				it('should add null default', function() {
					var result = validate({}, {
						properties: {
							foo: { default: null }
						}
					}, { cleanWithDefaults:true });

					assert.deepEqual(result.cleanInstance, {
						foo: null
					});
				});
			});
		});
	});

	describe('with reference schema', function() {
		var localValidator = skeemas().addRef('/some/schema', {
			properties: { foo: { type:'string' } }
		});

		it('should validate against a referenced schema', function() {
			assert.isTrue(localValidator.validate({ foo:'test' }, '/some/schema').valid);
		});

		it('should invalidate against a referenced schema', function() {
			assert.isFalse(localValidator.validate({ foo:42 }, '/some/schema').valid);
		});

		it('should validate against a referenced schema fragment', function() {
			assert.isTrue(localValidator.validate('test', '/some/schema#/properties/foo').valid);
		});

		it('should invalidate against a referenced schema fragment', function() {
			assert.isFalse(localValidator.validate(42, '/some/schema#/properties/foo').valid);
		});

		it('should throw an error for missing reference', function() {
			assert.throws(function() {
				localValidator.validate('test', '/some/missing/schema');
			});
		});

		it('should throw an error for missing fragment reference', function() {
			assert.throws(function() {
				localValidator.validate('test', '/some/schema#/not/here');
			});
		});
	});

	describe('with reference schema added by id', function() {
		var localValidator = skeemas().addRef({
			id: '/some/schema',
			properties: { foo: { type:'string' } }
		});

		it('should validate against a referenced schema', function() {
			assert.isTrue(localValidator.validate({ foo:'test' }, '/some/schema').valid);
		});

		it('should invalidate against a referenced schema', function() {
			assert.isFalse(localValidator.validate({ foo:42 }, '/some/schema').valid);
		});

		it('should validate against a referenced schema fragment', function() {
			assert.isTrue(localValidator.validate('test', '/some/schema#/properties/foo').valid);
		});

		it('should invalidate against a referenced schema fragment', function() {
			assert.isFalse(localValidator.validate(42, '/some/schema#/properties/foo').valid);
		});

		it('should throw an error for missing reference', function() {
			assert.throws(function() {
				localValidator.validate('test', '/some/missing/schema');
			});
		});

		it('should throw an error for missing fragment reference', function() {
			assert.throws(function() {
				localValidator.validate('test', '/some/schema#/not/here');
			});
		});
	});

	describe('schema having anyOf with references', function() {
		var localValidator = skeemas().addRef('/foo/schema', {
				enum: [ 'foo' ]
			}),
			schema = {
				definitions: {
					bars: {
						enum: [ 'bar' ]
					},
					ints: {
						type: 'integer'
					}
				},
				anyOf: [
					{ $ref: '#/definitions/ints' },
					{ $ref: '/foo/schema' },
					{ $ref: '#/definitions/bars' }
				]
			};

		it('should validate correctly', function() {
			assert.isTrue(localValidator.validate(42, schema).valid, 'should validate an int');
			assert.isTrue(localValidator.validate('foo', schema).valid, 'should validate "foo"');
			assert.isTrue(localValidator.validate('bar', schema).valid, 'should validate "bar"');
		});

		it('should invalidate correctly', function() {
			var result = localValidator.validate(42.1337, schema);
			assert.isFalse(result.valid, 'float should be invalid');
			assert.lengthOf(result.errors, 1, 'should have one error');
			assert.match(result.errors[0].message, /anyOf/, 'should be an "anyOf" error');

			result = localValidator.validate('boo', schema);
			assert.isFalse(result.valid, '"boo" should be invalid');
			assert.lengthOf(result.errors, 1, 'should have one error');
			assert.match(result.errors[0].message, /anyOf/, 'should be an "anyOf" error');
		});
	});

	describe('schema having oneOf with references', function() {
		var localValidator = skeemas().addRef('/foo/schema', {
				enum: [ 'foo' ]
			}),
			schema = {
				definitions: {
					bars: {
						enum: [ 'bar' ]
					},
					ints: {
						type: 'integer'
					}
				},
				oneOf: [
					{ $ref: '#/definitions/ints' },
					{ $ref: '/foo/schema' },
					{ $ref: '#/definitions/bars' }
				]
			};

		it('should validate correctly', function() {
			assert.isTrue(localValidator.validate(42, schema).valid, 'should validate an int');
			assert.isTrue(localValidator.validate('foo', schema).valid, 'should validate "foo"');
			assert.isTrue(localValidator.validate('bar', schema).valid, 'should validate "bar"');
		});

		it('should invalidate correctly', function() {
			var result = localValidator.validate(42.1337, schema);
			assert.isFalse(result.valid, 'float should be invalid');
			assert.lengthOf(result.errors, 1, 'should have one error');
			assert.match(result.errors[0].message, /oneOf/, 'should be an "oneOf" error');

			result = localValidator.validate('boo', schema);
			assert.isFalse(result.valid, '"boo" should be invalid');
			assert.lengthOf(result.errors, 1, 'should have one error');
			assert.match(result.errors[0].message, /oneOf/, 'should be an "oneOf" error');
		});
	});

	it('should handle required:true in props', function() {
		var schema = {
			properties: {
				foo: {
					required: true
				}
			}
		};
		assert.isTrue(validate({ foo: { bar:1 } }, schema).valid);
		assert.isFalse(validate({ boo: { bar:1 } }, schema).valid);
	});

	it('should handle required:[] in props', function() {
		var schema = {
			properties: {
				foo: {
					required: ['bar']
				}
			}
		};
		assert.isTrue(validate({ foo: { bar:1 } }, schema).valid);
		assert.isFalse(validate({ foo: { far:1 } }, schema).valid);
		assert.isTrue(validate({ boo: { far:1 } }, schema).valid);
	});

	describe('errors', function() {
		describe('after arrays of objects', function() {
			it('should have correct context', function() {
				var result = validate({
					"someArray": [ {} ]
				}, {
					properties: {
						someArray: {
							items: {
								type: "object",
								properties: {
									foo: { required: true }
								}
							}
						},
						missingProp: {
							required: true
						}
					}
				});

				assert.isFalse(result.valid);
				assert.lengthOf(result.errors, 3);
				assert.strictEqual(result.errors[2].context, '#');
			});
		});
	});
});
