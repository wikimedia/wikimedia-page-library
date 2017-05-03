# wikimedia-page-library
Library for common JavaScript transforms and CSS used by both the Android and iOS Wikipedia apps. Please report issues on [Phabricator].

[Phabricator]: https://phabricator.wikimedia.org/tag/wikimedia-page-library/

## Background
Presently we are consolidating duplicate Android and iOS Wikipedia app implementations of certain JavaScript transformations, such as image widening. **wikimedia-page-library** is where we are placing these consolidated JavaScript transform implementations. 

### What wikimedia-page-library is for
- JavaScript transforms common to **both** the Android and iOS Wikipedia apps.

### What wikimedia-page-library is not for

### What wikimedia-page-library delivers
- **wikimedia-page-library-transform.js** bundle of all transform JS
- **wikimedia-page-library-transform.css** bundle of all CSS required by the bundled transform JS
- **wikimedia-page-library-override.css** optional CSS overrides for improved appearance that are independent of transforms

## Conventions

### File locations and naming

Example file names and locations for an image widening transform:
- **src/transform/WidenImage.js** - the transform. *required*
- **src/transform/WidenImage.css** - CSS used by the transform. *optional*
- **src/override/Empty.css** - CSS overrides that are independent of transforms and that couldn't be upstreamed
- **test/WidenImage.js** - tests of the transform. *required*
- **test/fixtures/WidenImage.html** - fixtures used by transform tests. *optional*

*todo: rename Empty.css to a real override.*

Directory names should be lowercase.

### Functional
- Prefer to read and modify the CSS class list rather than style attributes or
  computed styles and prefer to avoid usage of `!important` unless it's
  necessary for the class styles to be effective. This allows clients to
  customize appearance with CSS overrides and no JavaScript changes or effects.
  For example, **WidenImage.js** mentioned above could add/remove a class name
  from **WidenImage.css** to an element's class list to help achieve image
  widening.
- Prefer Minerva and Parsoid style defaults. Any deviations should be deliberate
  and tightly scoped
- Wide screen selectors should apply to devices in landscape orientation or
  portrait orientation and >= 768px wide

### Naming
- JS function names use camelCase
- JS module names use PascalCase
- CSS class names use camelCase

*todo: evaluate common prefix like `pagelib` and BEM naming.*

## Development setup and workflow
*Coming soon.*

### Lint
ESLint is executed prior to commits and publishing to identify cataloged style
and functionality concerns. Linting may also be performed by running
`npm run -s lint:all`. When a violation is detected, it may be fixed manually or
suppressed by [selectively disabling the rule] (e.g,
`// eslint-disable-line no-magic-number`). Some rules support automated fixes
via `npm run -s lint -- --fix .`.

[selectively disabling the rule]: http://eslint.org/docs/user-guide/configuring#disabling-rules-with-inline-comments

## [Changelog](changelog.md)

## License
Copyright 2017 Wikimedia Foundation

Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed
under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR
CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.