import domino from 'domino'
import fs from 'fs'
import path from 'path'

/**
 * Gets string from file in 'test/fixtures/'
 * @param  {!string} fileName   Name of file in 'test/fixtures/'
 * @return {?string}            String from `test/fixtures/${fileName}`
 */
const stringFromFixtureFile = (fileName) => {
  return fs.readFileSync(path.resolve(__dirname, `../fixtures/${fileName}`), 'utf8')
}

/**
 * Gets Domino document from file in 'test/fixtures/'
 * @param  {!string} fileName   Name of file in 'test/fixtures/'
 * @return {?document}          Domino document from `test/fixtures/${fileName}`
 */
const documentFromFixtureFile = (fileName) => {
  return domino.createDocument(stringFromFixtureFile(fileName))
}

export default {
  stringFromFixtureFile,
  documentFromFixtureFile
}