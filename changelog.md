### v2.0.0
- Breaking: rename applib to wikimedia-page-library including build products
- Breaking: divide build products into transform and override files
- New: add CollapseElement.toggleCollapseClickCallback();
  iOS integration note: this method now also toggles the caption visibility
- New: shouldTableBeCollapsed(); Android integration note: no longer affects
  elements with `mbox-small` class
- Breaking: hide getTableHeader()
- Doc: overhaul readme

### v1.2.2
- Fix: center widened image captions from Parsoid
- Chore: update CollapseTable tests to be more consistent

### v1.2.1
- Broken package. Do not use.

### v1.2.0
- New: JS and CSS for image widening transform
  ([example integration](https://github.com/wikimedia/wikipedia-ios/pull/1313/))

### v1.1.0
- New: CSS delivered via "applib.css" by way of "rollup-plugin-css-porter"

### v1.0.1
- Fix: don't version build products
- Chore: respect arguments passed to `npm run lint`

### v1.0.0
- Breaking: rename CollapseElement to CollapseTable

### v0.1.2
- Fix: postversion script

### v0.1.1
- Fix: generate CommonJS output
- Chore: add source map
- Chore: change bundler from Browserify to Rollup
- Chore: test bundle directly not intermediates

### v0.1.0
- New: add CollapseElement.getTableHeader() function

### v0.0.1
- New: library
