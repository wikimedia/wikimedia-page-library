# Library for common Javascript transforms used by both the Android and iOS Wikipedia apps

## Background
Presently we are consolidating duplicate Android and iOS Wikipedia app implementations of certain Javascript transformations, such as image widening. **Applib** is where we are placing these consolidated Javascript transform implementations. 

## What Applib is for
* Javascript transforms common to **both** the Android and iOS Wikipedia apps.

## What Applib is not for
* Android or iOS **specific** JS or CSS.
* CSS unrelated to a particular Javascript transform. *In the future we may re-evaluate this for CSS common between the Android and iOS apps, but for right now the only CSS in Applib should be CSS directly needed by a particular Javascript transform.*

## What Applib delivers
* **applib.js** bundle of all transform JS
* **applib.css** bundle of all CSS required by the bundled transform JS

## Conventions

### File locations and naming

Example file names and locations for an image widening transform:
* **src/WidenImage.js** - the transform. *required*
* **src/WidenImage.css** - CSS used by the transform. *optional*
* **test/WidenImage.js** - tests of the transform. *required*

Directory names should be lowercase.

### Functional
- Prefer to read and modify the CSS class list rather than style attributes or
  computed styles. This allows clients to customize appearance with CSS
  overrides and no JavaScript changes or effects. For example, **WidenImage.js**
  mentioned above could add/remove a class name from **WidenImage.css** to an
  element's class list to help achieve image widening.
- Prefer Minerva and Parsoid style defaults. Any deviations should be deliberate
  and tightly scoped
- Avoid usage of `!important` in stylesheets
- Wide screen selectors should apply to devices in landscape orientation or
  portrait orientation and >= 768px wide

### Naming
- JS function names use camelCase
- JS module names use PascalCase
- CSS class names use camelCase

*todo: evaluate common prefix like `applib` and BEM naming.*

## Development setup and workflow
*Coming soon.*

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