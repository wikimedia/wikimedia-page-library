import domino from 'domino'
import fs from 'fs'
import path from 'path'

const stringFromFixtureFile = (fileName) => {
  return fs.readFileSync(path.resolve(__dirname, `../fixtures/${fileName}`), 'utf8')
}

const documentFromFixtureFile = (fileName) => {
  return domino.createDocument(stringFromFixtureFile(fileName))
}

export default {
  stringFromFixtureFile,
  documentFromFixtureFile
}