# AppBuilder3

![appbuilder3 JSON Schema views screenshot](https://s3-ap-southeast-2.amazonaws.com/eviratec.software/json-schema-views.png)

- [AppBuilder3 Wiki](https://github.com/eviratec/appbuilder3/wiki)
- [Try the demo on Codepen.io](https://codepen.io/eviratec-software/pen/NgpZbL)

## Usage

### JSON Schema Tables

AppBuilder3 wiki: [Usage: JSON Schema Tables](https://github.com/eviratec/appbuilder3/wiki/Usage:-JSON-Schema-Tables)

### JSON Schema Forms

AppBuilder3 wiki: [Usage: JSON Schema Forms](https://github.com/eviratec/appbuilder3/wiki/Usage:-JSON-Schema-Forms)

*Inspired by [schemaform](http://schemaform.io/)*

#### Include the JS

```html
<script type="application/javascript"
        src="bower_components/appbuilder3/appbuilder3.js"></script>
```

#### Let Angular.js know your app depends on it

```javascript
const MyApp = angular.module("MyApp", [
  "AppBuilder3"
]);
```

#### Use an inline JSON Schema

```javascript
MyApp.controller("FormContainerCtrl", FormContainerCtrl);

FormContainerCtrl.$inject = ["JsonSchema"];
function FormContainerCtrl (  JsonSchema) {

  const $f = this;

  $f.schema = new JsonSchema({
    "$schema": "http://json-schema.org/draft-04/schema#",
    "description": "schema for a person",
    "type": "object",
    "additionalProperties": false,
    "required": [ "id", "full_name", "date_added", "is_online" ],
    "properties": {
      "id": {
        "type": "string",
        "description": "The Person's v4 UUID",
        "format": "uuid"
      },
      "full_name": {
        "type": "string",
        "description": "E.g. 'Max Power'",
        "maxLength": 255
      },
      "date_added": {
        "type": "string",
        "format": "date-time"
      },
      "is_online": {
        "type": "boolean",
        "value": false
      }
    }
  });

  $f.form = [
    "*",
    {
      type: "submit",
      title: "Save"
    }
  ];

  $f.model = {};

}
```

*-or-* [Fetch a remote JSON Schema](https://github.com/eviratec/appbuilder3/wiki/Usage:-JSON-Schema-Forms#fetch-a-remote-json-schema)

#### Render the form

```html
<section ng-controller="FormContainerCtrl as $f">
  <form id="UserSubmission"
    ab-schema="$f.schema"
    ab-form="$f.form"
    ab-model="$f.model"
    layout="column">
  </form>
</section>
```

## License

Copyright (c) 2017 Callan Peter Milne

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
