# skeemas

Simple validation against JSON schemas and body-parsing middleware with built in JSON schema validation.

This is a simple api built upon: https://www.npmjs.com/package/jsonschema

## Installation
```bash
npm install skeemas --save
```


## Basic Validation
```js
var skeemas = require('skeemas');

skeemas.validate('foo', { type:'string' }).valid; // true
skeemas.validate(10000, { type:'string' }).valid; // false
skeemas.validate(10000, { type:'number' }).valid; // true
```

For more information about constructing schemas see http://json-schema.org/ or the wonderful guide at http://spacetelescope.github.io/understanding-json-schema/index.html

## Adding Schemas
Skeemas supports validation by schema id and refrences between schemas via the `$ref` property:

```js
var skeemas = require('skeemas');

skeemas.add({ type:'string', pattern:'^[a-z0-9]+$' }, '/identifier');

// Validate by id
skeemas.validate('foo123', '/identifier').valid; // true

// Use a $ref reference
skeemas.validate(user, { 
    type: 'object',
    properties: {
        id: { '$ref':'/identifier' },
        name: { type:'string' }
    } 
}).valid; // true
```


## Body-Parsing Middleware
Skeemas provides a simple JSON body parser with built in schema validation. 

```js
var skeemas = require('skeemas');

skeemas.add({
    id: '/user',
    type: 'object',
    properties: {
        id: { '$ref':'/identifier' },
        name: { type:'string' }
    } 
});

app.post('/foo/bars', skeemas.bodyParser('/user'), function(req, res, next) {
    // If you get here then you have a valid req.body
});
```

If the schema does not validate then a 422 response is sent with validation errors in the JSON response.
