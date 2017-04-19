# wikimedia-page-library
Library for common JavaScript transforms and CSS used by both the Android and iOS Wikipedia apps

## Background
Presently we are consolidating duplicate Android and iOS Wikipedia app implementations of certain JavaScript transformations, such as image widening. **wikimedia-page-library** is where we are placing these consolidated JavaScript transform implementations. 

## What wikimedia-page-library is for
* JavaScript transforms common to **both** the Android and iOS Wikipedia apps.

## What wikimedia-page-library is not for
* Android or iOS **specific** JS or CSS.
* CSS unrelated to a particular JavaScript transform. *In the future we may re-evaluate this for CSS common between the Android and iOS apps, but for right now the only CSS in wikimedia-page-library should be CSS directly needed by a particular JavaScript transform.*

## What wikimedia-page-library delivers
* **wikimedia-page-library-transform.js** bundle of all transform JS
* **wikimedia-page-library-transform.css** bundle of all CSS required by the bundled transform JS
* **wikimedia-page-library-override.css** optional CSS overrides for improved appearance that are independent of transforms

## Conventions

### File locations and naming

Example file names and locations for an image widening transform:
* **src/transform/WidenImage.js** - the transform. *required*
* **src/transform/WidenImage.css** - CSS used by the transform. *optional*
* **src/override/Empty.css** - CSS overrides that are independent of transforms and that couldn't be upstreamed
* **test/WidenImage.js** - tests of the transform. *required*
* **test/fixtures/WidenImage.html** - fixtures used by transform tests. *optional*

*todo: rename Empty.css to a real override.*

### Changing styles
- Prefer to modify classlist rather than style attributes. For example, **WidenImage.js** mentioned above could add/remove a class name from **WidenImage.css** to an element's classlist to help achieve image widening.

### Function naming
*Coming soon.*

### Style naming
*Coming soon.*

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