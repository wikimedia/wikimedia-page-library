#!/usr/bin/env node
/* eslint-disable require-jsdoc */

const fs = require('fs')
const request = require('request')
const indexJSON = require('./articles.json')
const ArticleRef = require('./ArticleRef.js').ArticleRef
const ArticleRefSourceType = require('./ArticleRef.js').ArticleRefSourceType
const flattenArrayOfArrays = require('../DemoUtilities.js').flattenArrayOfArrays

const DATA_PATH = './data/'

const articleRefs = flattenArrayOfArrays(
  indexJSON.map(articleData => [
    new ArticleRef(
      articleData.lang,
      articleData.title,
      articleData.revision,
      ArticleRefSourceType.mobileView
    ),
    new ArticleRef(
      articleData.lang,
      articleData.title,
      articleData.revision,
      ArticleRefSourceType.mobileContentService
    )
  ])
)

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
  .replace(/\u202f/g, '\\u202f')
  .replace(/\u2061/g, '\\u2061')
  .replace(/\ufeff/g, '\\ufeff')

const saveJSONForArticleRef = (articleJSON, articleRef) => {
  const formattedArticleJSON = JSON.stringify(articleJSON, null, 2)
  const fullyEscapedArticleJSON = escapeLangDirectionMarks(formattedArticleJSON)
  fs.writeFile(
    `${DATA_PATH}${articleRef.fileName()}`,
    fullyEscapedArticleJSON, err => { if (err) { throw err } }
  )
  // eslint-disable-next-line no-console
  console.log(`\tJSON saved to '${articleRef.fileName()}'`)
}

const fetchAndSaveJSONForArticleRef = articleRef => {
  const requestOptions = {
    method: 'GET',
    uri: articleRef.url(),
    encoding: 'utf-8',
    gzip: true
  }
  const responseHandler = (error, response, body) => {
    if (error) { throw error }
    const statusCode = response.statusCode
    if (statusCode !== 200) {
      throw new Error(
        `Couldn't get '${articleRef.fileName()}' article data. Response statusCode '${statusCode}'.`
      )
    }
    saveJSONForArticleRef(JSON.parse(body), articleRef)
  }
  request(requestOptions, responseHandler)
}

articleRefs.forEach(fetchAndSaveJSONForArticleRef)
