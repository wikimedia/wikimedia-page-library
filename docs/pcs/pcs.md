# PCS

The wikimedia-page-library-pcs output is an abstraction layer of the page library transforms. It includes the transforms implementation JS and CSS. It's meant to be used together with the HTML from [Page Content Service] mobile-html responses.

### What wikimedia-page-library-pcs is for
- is an adapter of client side to server side mobile-html functionality
- providing an interface for manipulating the presentation of page content (theme, dim images, margins, ...)
- providing an interface for setting up expected event handling on the client side to complement server side DOM transformations (lazy loading, table collapsing, ...)
- providing an interface for retrieving metadata directly from the PCS page (lead image URL, page revision, description, ...)
- to be hosted server-side for clients of PCS mobile-html
- to be run on a client inside a WebView or web browser
- a high level abstraction layer of wikimedia-page-library
- A specific major version knows which DOM transformations have been applied server side on a given page (by including the version in the URL for this adapter) and executes the corresponding client side functionality if and when needed (registering events). 
  Examples: 
  - Lazy Loading: server side we replace <img> tags with <span> placeholder elements. Then on the client side (here) we need to replace the placeholders back to the original <img> tags when appropriate.
  - Collapse / expand tables

### What wikimedia-page-library-pcs is not for
- not to be bundled with native app versions

### What wikimedia-page-library-pcs delivers
- **wikimedia-page-library-pcs.js** bundle of JavaScript functionality hosted server side but run on clients
- **wikimedia-page-library-pcs.css** bundle of CSS required by the DOM transformations and potential overrides of the base CSS

### Versions
There are two kinds of versions we are concerned about, client side and server side. Either side could be released and updated at different times than the other.
- Client PCS version: version coupled to clients. Some clients, like native app versions that cannot be or simply have not been updated. It's important to not break older or future clients of this library. These will be prefixed with a `c`, e.g. `c1`.  The client-side version will be reflected in the folder/package structure of the exported JS modules.
- Server PCS version: version coupled to server-side mobile-html output. We may have different DOM transformations or different metadata encoded inside HTML in the future. These will be prefixed with a `s`, e.g. `s1`. The server-side version will be reflected in the URL to it when this library is referenced by mobile-html.

### Guidelines
- We plan to host multiple major versions server-side.
- Be liberal with what your API accepts! 
  - Consider adding object parameters to functions and set sensible defaults to allow for future arguments to be passed without breaking older clients.
  - Apply some defaults where it’s reasonable to do so. Be prepared for nulls, undefined, or empty string values. Don’t bail when the backend returns additional unexpected properties - just ignore it. Enums: expect unexpected and ignore it.
  - Do not return primitive values. Return JS objects with only one field instead. If you want to return something in addition to the primitive value you won’t need a new API version.
- Identify clients using the `platform` and `clientVersion` preferences. This information is useful to be able to patch things server side if the need arises. This list may not be complete yet. Potentially other device- or user preference specific info might be useful in the future (locale?).
- Only create a new API version when you really have to. You can add new stuff to the current version if it doesn’t affect existing clients.
- Prepare for phasing out an API version. Some old versions you can’t afford to maintain. So define a process for informing clients that you may later not support their version.

## Interface

### PageMods

#### onPageLoad()
No need to call this one from the client side. This will be invoked automatically when the DOM is 
ready. All other functions are meant to be called by the client.

#### setMulti()
Combination of the following calls, changing multiple settings in one single call. The settings are kept in an object.

Setting parameter object fields:
- platform: possible values in pagelib.c1.Platforms: [IOS, ANDROID] 
- clientVersion: string of client version (platform specific)
- theme: possible values in pagelib.c1.Themes: [DEFAULT, SEPIA, DARK, BLACK]
- dimImages: boolean
- margins: object with { top, right, bottom, left }
- areTablesCollapsed: boolean
- scrollTop: number of pixel for highest position to scroll to. Use this to adjust for any decor overlaying the viewport.

(The first three field don't have any equivalent separate call since those don't make sense to change after the fact.)

Example:
```
pagelib.c1.PageMods.setMulti(window, document, {
  platform: pagelib.c1.Platforms.IOS,
  clientVersion: '6.2.1',
  theme: pagelib.c1.Themes.SEPIA,
  dimImages: true,
  margins: { top: '32px', right: '32px', bottom: '32px', left: '32px' },
  areTablesCollapsed: true,
  scrollTop: 64
  }, () => { alert('success') }
)
```

### setTheme()
Turns on or off dimming of images.

Example:
```
pagelib.c1.PageMod.setTheme(document, Themes.SEPIA)
```

### setDimImages()
Turns on or off dimming of images.

Example:
```
pagelib.c1.PageMods.setDimImages(document, true)
```

### setMargins()
Turns on or off dimming of images.

Example:
```
pagelib.c1.PageMods.setMargins(document, { top: '128px', right: '32px', bottom: '16px', left: '32px' })
```

### setScrollTop()
Sets the top-most vertical position to scroll to in pixel. Use this to adjust for any decor overlaying the top of the viewport. Default: 0

Example:
```
pagelib.c1.PageMods.setScrollTop(document, 64)
```


[Page Content Service]: https://www.mediawiki.org/wiki/Page_Content_Service