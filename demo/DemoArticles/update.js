#!/usr/bin/env node
/* eslint-disable require-jsdoc */

const fs = require('fs')
const request = require('request')

const articlesData = JSON.parse(fs.readFileSync('./articles.json', 'utf8'))

const fileNameFromArticleData =
  articleData => `${articleData.lang}.${articleData.title}.${articleData.revision}.json`

const urlFromArticleData =
  articleData => `https://${articleData.lang}.wikipedia.org/w/api.php?action=mobileview&page=${encodeURI(articleData.title)}&revision=${articleData.revision}&format=json&noheadings=true&prop=sections%7Ctext%7Clastmodified%7Clastmodifiedby%7Clanguagecount%7Cid%7Cprotection%7Ceditable%7Cdisplaytitle%7Cthumb%7Cdescription%7Cimage%7Crevision%7Cnamespace&sectionprop=toclevel%7Cline%7Canchor%7Clevel%7Cnumber%7Cfromtitle%7Cindex&sections=all&thumbwidth=640`

// eslint-disable-next-line no-console
console.log(`Fetching JSON for ${articlesData.length} titles...`)

articlesData.forEach(articleData => {
  const fileName = fileNameFromArticleData(articleData)
  const url = urlFromArticleData(articleData)
  request({
    method: 'GET',
    uri: url,
    encoding: 'utf-8',
    gzip: true
  }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      // eslint-disable-next-line no-console
      console.log(`\tJSON saved to '${fileName}'`)
      const articleJSON = JSON.parse(body)
      const formattedArticleJSON = JSON.stringify(articleJSON, null, 2)
      fs.writeFile(`./data/${fileName}`, formattedArticleJSON, err => { if (err) { throw err } })
    }
  }
  )
})
