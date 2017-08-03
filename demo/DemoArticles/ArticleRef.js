/**
 * Model for article data in ./article.json
 * @type {object}
 */
class ArticleRef {
  /**
   * Constructor
   * @param {!string} lang
   * @param {!string} title
   * @param {number} revision
   * @return {!object}
   */
  constructor(lang, title, revision) {
    this.lang = lang
    this.title = title
    this.revision = revision
  }
  /**
   * String which can be used to for serialization.
   * @return {!string}
   */
  fileName() {
    return `${this.lang}.${this.title}.${this.revision}.json`
  }
  /**
   * String which can be used for display name.
   * @return {!string}
   */
  displayName() {
    return `"${this.lang} > ${this.title}"`
  }
  /**
   * URL string used to fetch JSON for this article revision.
   * @return {!string}
   */
  url() {
    return `https://${this.lang}.wikipedia.org/w/api.php?action=mobileview&page=${encodeURI(this.title)}&revision=${this.revision}&format=json&noheadings=true&prop=sections%7Ctext%7Clastmodified%7Clastmodifiedby%7Clanguagecount%7Cid%7Cprotection%7Ceditable%7Cdisplaytitle%7Cthumb%7Cdescription%7Cimage%7Crevision%7Cnamespace&sectionprop=toclevel%7Cline%7Canchor%7Clevel%7Cnumber%7Cfromtitle%7Cindex&sections=all&thumbwidth=640`
  }
}

module.exports = {
  ArticleRef
}
