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

- Ignored properties
    - $schema
    - id
    - title
    - description
    - default
- References
    - definitions
    - $ref
- Criteria
    - any type
        - [ ] allOf
        - [ ] anyOf
        - [ ] oneOf
        - [ ] not
        - [ ] enum
        - [ ] required
        - [ ] disallow
        - [ ] extends
    - [X] array
        - [ ] items
        - [ ] additionalItems
        - [X] minItems
        - [X] maxItems
        - [ ] uniqueItems
    - [X] boolean
    - [X] null
    - number, integer
        - [X] multipleOf
        - [X] divisibleBy
        - [X] minimum
        - [X] maximum
        - [X] exclusiveMinimum
        - [X] exclusiveMaximum
    - [X] object
        - [ ] properties
        - [ ] patternProperties
        - [ ] additionalProperties
        - [ ] required
        - [ ] dependencies
        - [ ] minProperties
        - [ ] maxProperties
        - dependencies
    - [X] string
        - [X] minLength
        - [X] maxLength
        - [X] pattern
        - [X] format
            - v4
                - [X] date-time
                - [X] email
                - [X] hostname
                - [X] ipv4
                - [X] ipv6
                - [X] uri
            - v3
                - [X] date-time
                - [X] date
                - [X] time
                - [X] utc-millisec
                - [X] regex
                - [X] color
                - [ ] style
                - [ ] phone
                - [X] uri
                - [X] email
                - [X] ip-address
                - [X] ipv6
                - [X] host-name
