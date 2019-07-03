const DEMO_ARTICLES_DATA_PATH = `./DemoArticles/data/`

/**
 * Type representing article source endpoints.
 * @enum {ArticleRefSourceType}
 */
const ArticleRefSourceType = {
  mobileView: 1,
  mobileContentService: 2,
  pageContentService: 3
}

const ArticleRefContentType = {
  sections: 1,
  page: 2
}

/**
 * Display name for a given ArticleRefSourceType.
 * @param {!ArticleRefSourceType} type
 * @return {!string}
 */
const displayNameForArticleRefSourceType = type => {
  switch (type) {
  case ArticleRefSourceType.mobileView:
    return 'MV'
  case ArticleRefSourceType.mobileContentService:
    return 'MCS'
  case ArticleRefSourceType.pageContentService:
    return 'PCS'
  default:
    return ''
  }
}

const rtlLangCodes = ['arc', 'arz', 'ar', 'bcc', 'bqi', 'ckb', 'dv', 'fa', 'glk', 'ha', 'he', 'khw', 'ks', 'mzn', 'pnb', 'ps', 'sd', 'ug', 'ur', 'yi']

/**
 * Model for article data in ./articles.json
 */
class ArticleRef {
  /**
   * Constructor
   * @param {!string} lang
   * @param {!string} title
   * @param {!number} revision
   * @param {!ArticleRefSourceType} sourceType
   * @return {!ArticleRef}
   */
  constructor(lang, title, revision, sourceType) {
    this.lang = lang
    this.title = title
    this.revision = revision
    this.sourceType = sourceType
  }

  /**
   * Determines whether lang is RTL.
   * @return {boolean}
   */
  isRTL() {
    return rtlLangCodes.indexOf(this.lang) > -1
  }

  /**
   * String which can be used to for serialization.
   * @return {!string}
   */
  fileName() {
    return `${this.lang}.${this.title}.${this.revision}.${
      displayNameForArticleRefSourceType(this.sourceType)
    }.${this.fileExtension()}`
  }

  fileExtension() {
    switch (this.contentType()) {
    case ArticleRefContentType.page:
      return 'html'
    default:
      return 'json'
    }
  }
  /**
   * String which can be used for display name.
   * @return {!string}
   */
  displayName() {
    return `${this.lang} > ${this.title} > ${displayNameForArticleRefSourceType(this.sourceType)}`
  }

  /**
   * URL string used to fetch JSON for this article revision.
   * @return {!string}
   */
  url() {
    switch (this.sourceType) {
    case ArticleRefSourceType.mobileView:
      return `https://${this.lang}.wikipedia.org/w/api.php?action=mobileview&page=${encodeURI(this.title)}&revision=${this.revision}&format=json&noheadings=true&prop=sections%7Ctext%7Clastmodified%7Clastmodifiedby%7Clanguagecount%7Cid%7Cprotection%7Ceditable%7Cdisplaytitle%7Cthumb%7Cdescription%7Cimage%7Crevision%7Cnamespace&sectionprop=toclevel%7Cline%7Canchor%7Clevel%7Cnumber%7Cfromtitle%7Cindex&sections=all&thumbwidth=640`
    case ArticleRefSourceType.mobileContentService:
      return `https://${this.lang}.m.wikipedia.org/api/rest_v1/page/mobile-sections/${encodeURI(this.title)}/${this.revision}`
    case ArticleRefSourceType.pageContentService:
      return `https://${this.lang}.wikipedia.org/api/rest_v1/page/mobile-html/${encodeURI(this.title)}/${this.revision}`
    default:
      return ''
    }
  }

  contentType() {
    switch (this.sourceType) {
    case ArticleRefSourceType.pageContentService:
      return ArticleRefContentType.page
    default:
      return ArticleRefContentType.sections
    }
  }

  /**
   * Extracts array of article sections from article JSON.
   * @param {!Object.<string, Array>} json
   * @return {!Array}
   */
  sectionsArrayFromJSON(json) {
    switch (this.sourceType) {
    case ArticleRefSourceType.mobileView:
      return json.mobileview.sections
    case ArticleRefSourceType.mobileContentService:
      return [json.lead.sections[0]].concat(json.remaining.sections)
    default:
      return []
    }
  }

  /**
   * Fetch promise resolving to array of section JSON from local data file.
   * @param {!string} dataFilePath
   * @return {!Promise}
   */
  fetchSectionsJSON() {
    return fetch(`${DEMO_ARTICLES_DATA_PATH}${this.fileName()}`)
      .then(resp => resp.json())
      .then(json => this.sectionsArrayFromJSON(json))
  }

  fetchPageText() {
    return fetch(`${DEMO_ARTICLES_DATA_PATH}${this.fileName()}`)
      .then(resp => resp.text())
  }

  buildPageFromSectionsJSON(sectionsJSON) {
    const articleEnclosedSectionHTML = this.enclosedSectionHTMLsFromSections(sectionsJSON)
    const articleHTML = this.htmlFromAllSectionHTMLs(articleEnclosedSectionHTML)
    const articleCompleteHTML = this.articleEnclosedInOuterHTML(articleHTML)
    return articleCompleteHTML
  }

  fetchCompleteHTML() {
    switch(this.contentType()) {
      case ArticleRefContentType.page:
        return this.fetchPageText(DEMO_ARTICLES_DATA_PATH)
        break
      case ArticleRefContentType.sections:
        return this.fetchSectionsJSON(DEMO_ARTICLES_DATA_PATH)
          .then(sectionsJSON => this.buildPageFromSectionsJSON(sectionsJSON))
        break
      default:       
    }
  }

  articleEnclosedInOuterHTML(articleHTML) {
    const script = 'script'
    return `
    <!doctype html>
    <html>
      <head>
        <meta charset=utf-8>
        <link href='https://en.wikipedia.org/w/load.php?debug=true&lang=en&modules=skins.minerva.base.styles|skins.minerva.content.styles|ext.cite.style|ext.math.styles|ext.timeline.styles|mediawiki.page.gallery.styles|mediawiki.skinning.content.parsoid&only=styles&version=&*' rel='stylesheet' type='text/css'></link>
        <link href=http://localhost:8080/wikimedia-page-library-transform.css rel=stylesheet>
        <style>
          html, body {
            height: unset !important;
          }
          body {
            padding: 20px !important;
          }
          .content_block {
            padding-bottom: 50px;
          }
        </style>
        <${script} src=http://localhost:8080/wikimedia-page-library-transform.js></${script}>
      </head>
      <body>
        <div class='content' id='content'>
        ${articleHTML}
        </div>
      </body>
      <${script}>
        pagelib.ThemeTransform.classifyElements(document)
      </${script}>
    </html>`
  }

  /**
   * Converts section HTML strings to a single HTML string.
   * @param {!Array<string>} allSectionHTMLs
   * @return {!string}
   */
  htmlFromAllSectionHTMLs(allSectionHTMLs) {
    return allSectionHTMLs.join('')
  }

  /**
   * Converts article JSON sections to HTML strings.
   * @param  {!Array<object>} sections
   * @return {!Array<String>}
   */
  enclosedSectionHTMLsFromSections(sections) {
    return sections.map(section => {
      const line = section.line || ''
      const toclevel = section.toclevel || '1'
      return `<div class='content_block' id='content_block_${section.id}'>
                <div class='section_header' id='${section.id}' line='${line}' toclevel='${toclevel}'>
                  <h${toclevel}>${line}</h${toclevel}>
                </div>
                ${section.text}
              </div>`
    })
  }
}

module.exports = {
  ArticleRef,
  ArticleRefSourceType,
  ArticleRefContentType
}
