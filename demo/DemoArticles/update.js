#!/usr/bin/env node
/* eslint-disable require-jsdoc */

const fs = require('fs')
const request = require('request')
const INDEX_FILE = './articles.json'
const ArticleRef = require('./ArticleRef.js').ArticleRef

const articleRefs = JSON
  .parse(fs.readFileSync(INDEX_FILE, 'utf8'))
  .map(articleData => new ArticleRef(articleData.lang, articleData.title, articleData.revision))

// eslint-disable-next-line no-console
console.log(`Fetching JSON for ${articleRefs.length} titles...`)

// Linting complained of some improperly formatted characters which turned out to be these.
const escapeLangDirectionMarks = string => string
  .replace(/\u00ad/g, '\\u00ad')
  .replace(/\u200c/g, '\\u200c')
  .replace(/\u200e/g, '\\u200e')
  .replace(/\u200f/g, '\\u200f')
  .replace(/\u202d/g, '\\u202d')
  .replace(/\u202e/g, '\\u202e')
  .replace(/\u202f/g, '\\u202f')

const fetchAndSaveJSONForArticleRef = articleRef => {
  request({
    method: 'POST',
    uri: articleRef.url(),
    encoding: 'utf-8',
    gzip: true
  }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      // eslint-disable-next-line no-console
      console.log(`\tJSON saved to '${articleRef.fileName()}'`)
      const articleJSON = JSON.parse(body)
      const formattedArticleJSON = JSON.stringify(articleJSON, null, 2)
      const fullyEscapedArticleJSON =
        escapeLangDirectionMarks(formattedArticleJSON)
      fs.writeFile(
        `./data/${articleRef.fileName()}`,
        fullyEscapedArticleJSON, err => { if (err) { throw err } }
      )
    }
  }
  )
}

articleRefs.forEach(fetchAndSaveJSONForArticleRef)
