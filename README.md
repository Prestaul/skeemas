# skeemas
Comprehensive JSON Schema (drafts 3 and 4) validation.


## Installation
```bash
npm install skeemas --save
```


## Basic Validation
**`skeemas.validate(subject, schema[, options])`**

```js
var skeemas = require('skeemas');

skeemas.validate('foo', { type:'string' }).valid; // true
skeemas.validate(10000, { type:'string' }).valid; // false
skeemas.validate(10000, { type:'number' }).valid; // true

// Result contains an array of errors
var result = skeemas.validate('test', { enum:['foobar'], minLength:5 });
result.valid; // false
result.errors; // array with 2 error objects

// Pass the "breakOnError" option to stop processing on the first error
var result = skeemas.validate('test', { enum:['foobar'], minLength:5 }, { breakOnError:true });
result.valid; // false
result.errors; // array with 1 error object

var result = skeemas.validate({
    foo: 'bar',
    nested: {
        stuff: [1,2,3],
        ignoreMe: 'undeclared property'
    }
}, {
    properties: {
        foo: { type:'string' },
        nested: {
            properties: {
                stuff: {
                    type: 'array',
                    items: { type:'integer' }
                }
                // We aren't going to declare `ignoreMe`. To disallow extra 
                // props we could set `additionalProperties:false`.
            }
        }
    }
}); 
result.valid; // true
assert.deepEqual(result.cleanInstance, {
    foo: 'bar',
    nested: {
        stuff: [1,2,3]
        // notice the `ignoreMe` property is removed from `cleanInstance`
    }
});
```

For more information about constructing schemas see http://json-schema.org/ or the wonderful guide at http://spacetelescope.github.io/understanding-json-schema/index.html


## Adding Schemas
Skeemas supports validation by schema id and refrences between schemas via the `$ref` property:

```js
// Create an instance of a validator
var validator = require('skeemas')();

// Add schemas to the validator
validator.addRef({ type:'string', pattern:'^[a-z0-9]+$' }, '/identifier');

// Validate by uri/id
validator.validate('foo123', '/identifier').valid; // true

// Use a $ref reference in other schemas
validator.validate(user, { 
    type: 'object',
    properties: {
        id: { '$ref':'/identifier' },
        name: { type:'string' }
    } 
}).valid; // true
```


## Related Modules

- [skeemas-body-parser](https://github.com/Prestaul/skeemas-body-parser) - json body parser middleware with schema validation
- [skeemas-markdown-validation](https://github.com/Prestaul/skeemas-markdown-validation) - simple testing of json blocks in your markdown documentation


## Development
Our tests are running the JSON Schema test suite at [https://github.com/json-schema/JSON-Schema-Test-Suite](https://github.com/json-schema/JSON-Schema-Test-Suite). Those tests are referenced as a submodule and therefore dev setup is a little non-standard.
```bash
# clone the repo

# install dependencies from npm
npm install

# install the test suite
git submodule init
git submodule update

# run the tests
npm test
```



## Feature Status

- [X] Full Validation (all errors)
- [X] Quick Validation (first error)
- [X] Instance cleaning
- [X] Manual reference additions
- [X] Validate by reference
- [ ] Missing reference resolution
- [ ] Custom format validation
- [ ] Custom attribute validation
- [X] Plugins
- [X] JSON-Schema draft 03 and 04 feature support
    - Ignored schema attributes
        - $schema
        - title
        - description
        - default
    - [X] References
        - [X] id
        - [X] definitions
        - [X] $ref
    - [X] Validations by type
        - [X] any
            - [X] type
            - [X] enum
            - [X] extends
            - [X] allOf
            - [X] anyOf
            - [X] oneOf
            - [X] not
            - [X] disallow
            - [X] required
            - [X] format
        - [X] array
            - [X] items
            - [X] additionalItems
            - [X] minItems
            - [X] maxItems
            - [X] uniqueItems
        - [X] boolean
        - [X] null
        - [X] number, integer
            - [X] multipleOf
            - [X] divisibleBy
            - [X] minimum
            - [X] maximum
            - [X] exclusiveMinimum
            - [X] exclusiveMaximum
        - [X] object
            - [X] properties
            - [X] patternProperties
            - [X] additionalProperties
            - [X] required
            - [X] dependencies
            - [X] minProperties
            - [X] maxProperties
            - [X] dependencies
        - [X] string
            - [X] minLength
            - [X] maxLength
            - [X] pattern
            - [X] format
                - [X] date-time
                - [X] date
                - [X] time
                - [X] utc-millisec
                - [X] email
                - [X] hostname
                - [X] host-name
                - [X] ip-address
                - [X] ipv4
                - [X] ipv6
                - [X] uri
                - [X] regex
                - [X] color
                - [X] style
                - [X] phone
