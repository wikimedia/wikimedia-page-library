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

Directory names should be lowercase. Filenames should be singular.

### Functional
- Prefer to read and modify the CSS class list rather than style attributes or
  computed styles and prefer to avoid usage of `!important` unless it's
  necessary for the class styles to be effective. This allows clients to
  customize appearance with CSS overrides and no JavaScript changes or effects.
  For example, **WidenImage.js** mentioned above could add/remove a class name
  from **WidenImage.css** to an element's class list to help achieve image
  widening.
- Prefer Minerva and Parsoid style defaults. Any deviations should be deliberate
  and tightly scoped.
- Wide screen selectors should apply to devices in landscape orientation or
  portrait orientation and >= 768px wide.
- Prefer `undefined` to `null`.

### Naming
- JS function names use camelCase
- JS module names use PascalCase
- CSS class names use camelCase

*todo: evaluate common prefix like `pagelib` and BEM naming.*

## Development setup and workflow
The Android and iOS Wikipedia apps make use of the `wikimedia-page-library`. At some point their respective build phases invoke `npm install` which causes a *published* version of this library to be retrieved and used in their respective builds. 

But sometimes we want to test *unpublished* `wikimedia-page-library` branches. This could be to review bug fixes or new feature branches or to develop fixes and features ourselves. We'd like to be able to checkout a local branch of `wikimedia-page-library` and run the app's build process and have the app use whatever we had checked out of our local copy of `wikimedia-page-library`.

To do this:

**Step 1** (only need to do this once)

Create a local clone of `wikimedia-page-library`:
```
git clone https://github.com/wikimedia/wikimedia-page-library.git
```

**Step 2** (do this as needed)

Checkout the branch to be tested:
```
cd wikimedia-page-library
git checkout somebranch
```

**Step 3** (only need to do this once)

Now we need to temporarily tell NPM to use our local copy of `wikimedia-page-library` so when we run the app's build process and it runs `npm install`, our local copy of  `wikimedia-page-library` will be used instead of the published one.

We can use the `npm link` command to do this.

Create a `wikimedia-page-library` symlink:
```
cd wikimedia-page-library
npm link
```

The `npm link` command above configures NPM with a global `wikimedia-page-library` symlink. Note that it infers the name of the package from the package folder we `cd`'ed into. We will use this symlink in the next step. You only have to create this symlink once as long as you don't change the file system location of your local clone of `wikimedia-page-library`.

**Step 4** (do this when you begin testing against a local copy)

Now we have to configure the app's `www` folder to point to the symlink we just created.
```
cd $NATIVE_APP_REPO/www # Replace NATIVE_APP_REPO with the path to the Android or iOS repo.
npm link wikimedia-page-library

```

After running the `link` command above, your file system browser should show a symlink folder for `www/node_modules/wikimedia-page-library` instead of a normal folder. 

Now NPM is "pointing" to our local copy of `wikimedia-page-library` and when the app's build process invokes `npm install` NPM will try to get `wikimedia-page-library` build products from our local copy. 

**Step 5** (do this each time you make a change to the local copy)

*Important!* 

Don't forget to rebuild the local copy of `wikimedia-page-library` any time you make a change to it (before you run the app's build process), otherwise the app's build process won't "see" the change!
```
cd wikimedia-page-library
npm run -s
```

You may find it helpful to combine this step's command with a command kicking of the respective app's build process into a shortcut of some kind. Most of the development workflow involves make a change to your local copy of `wikimedia-page-library`, telling that local copy to re-build, then telling the app to rebuild.

**Step 6** (do this when you are done testing against the local copy)

When you have finished testing against your local copy of `wikimedia-page-library`, you can simply `unlink` so the app's build process will again pull from the *published* version of `wikimedia-page-library`.
```
cd $NATIVE_APP_REPO/www # Replace NATIVE_APP_REPO with the path to the Android or iOS repo.
npm unlink wikimedia-page-library
```

Note the `un` in the command above.

After running the `unlink` command above, your file system browser should again show a normal folder for `www/node_modules/wikimedia-page-library` instead of a symlink folder.

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