# skeemas-validate
Lightweight JSON Schema valiation


## Installation
```bash
npm install skeemas-validate
```


## Usage
@TODO


## Development
Our tests are running JSON Schema test suite at [https://github.com/json-schema/JSON-Schema-Test-Suite](https://github.com/json-schema/JSON-Schema-Test-Suite). Those tests are referenced as a submodule and therefore dev setup is a little non-standard.
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
- [ ] Missing reference resolution
- [ ] Custom format validation
- [ ] Custom attribute validation
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
            - dependencies
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
