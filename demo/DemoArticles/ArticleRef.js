/*
#!/usr/bin/env node
*/
/* eslint-disable require-jsdoc */

class ArticleRef {
  constructor(lang, title, revision) {
    this.lang = lang
    this.title = title
    this.revision = revision
  }
  fileName() {
    return `${this.lang}.${this.title}.${this.revision}.json`
  }
  displayName() {
    return `"${this.lang} > ${this.title}" ${this.revision}`
  }
  url() {
    return `https://${this.lang}.wikipedia.org/w/api.php?action=mobileview&page=${encodeURI(this.title)}&revision=${this.revision}&format=json&noheadings=true&prop=sections%7Ctext%7Clastmodified%7Clastmodifiedby%7Clanguagecount%7Cid%7Cprotection%7Ceditable%7Cdisplaytitle%7Cthumb%7Cdescription%7Cimage%7Crevision%7Cnamespace&sectionprop=toclevel%7Cline%7Canchor%7Clevel%7Cnumber%7Cfromtitle%7Cindex&sections=all&thumbwidth=640`
  }
}

module.exports = {
  ArticleRef
}
