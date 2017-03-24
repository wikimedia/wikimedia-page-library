import domino from 'domino'
const fs = require('fs')
const path = require('path')

const stringFromFixtureFile = (fileName) => {
  return fs.readFileSync(path.resolve(__dirname, `fixtures/${fileName}`), 'utf8')
}

const documentFromFixtureFile = (fileName) => {
  return domino.createDocument(stringFromFixtureFile(fileName))
}

export default {
  stringFromFixtureFile,
  documentFromFixtureFile
}