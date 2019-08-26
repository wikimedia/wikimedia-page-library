# Release process

1. Make sure you have `origin` remote set to `https://github.com/wikimedia/wikimedia-page-library.git` (the `postversion` script assumes origin!)
1. Verify that `npm -v` and `node -v` returns the same values as in the `.npm-version` and `.node-version` files.
1. Create update changelog.md PR
1. Merge update changelog.md PR
1. `git checkout master`
1. `git pull origin master`
1. `rm -rf node_modules`
1. `npm install`
1. `npm login`
1. Change the version number in package.json AND publish the package by running only ONE of:
* `npm version patch`
* `npm version minor`
* `npm version major`

Note: No need for `npm publish`. Our `postversion` script pushes the tag to the GitHub remote and publishes to npm so it's hard to create a scenario where you have an unpublished version or an untagged publication, so you don't call the publish command directly.

See also: https://docs.npmjs.com/getting-started/publishing-npm-packages