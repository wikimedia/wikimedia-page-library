import assert from 'assert'
import domino from 'domino'
import fixtureIO from '../utilities/FixtureIO'
import pagelib from '../../build/wpl_transform'

let document

const CollectionUtilities = pagelib.CollectionUtilities

describe('CollectionUtilities', () => {
  beforeEach(() => {
    document = fixtureIO.documentFromFixtureFile('CollectionUtilities.html')
  })

  describe('.collectPageIssuesText()', () => {
    it('find text issues', () => {
      const element = document.querySelector('div#content_block_0')
      assert.deepEqual(CollectionUtilities.collectPageIssuesText(document, element), [
        'This article includes a list of references, but its sources remain unclear because it has insufficient inline citations.  (January 2016)', // eslint-disable-line max-len
        'This article may be confusing or unclear to readers.  (October 2016)',
        'This article may be too long to read and navigate comfortably.  (October 2016)'
      ])
    })
    it('empty array returned when no titles exists', () => {
      document = domino.createDocument(
        '<div id=content_block_0>No disambiguation titles here!</div>'
      )
      const element = document.querySelector('div#content_block_0')
      assert.deepEqual(CollectionUtilities.collectPageIssuesText(document, element), [])
    })
    it('empty array returned when no titles found because element does not exist', () => {
      const element = document.querySelector('div#content_block_1')
      assert.deepEqual(CollectionUtilities.collectPageIssuesText(document, element), [])
    })
  })
  describe('.collectPageIssuesHTML()', () => {
    it('find html issues', () => {
      const element = document.querySelector('div#content_block_0')
      assert.deepEqual(CollectionUtilities.collectPageIssuesHTML(document, element), [
        'This article includes a <a href="/wiki/Wikipedia:Citing_sources" title="Wikipedia:Citing sources">list of references</a>, but <b>its sources remain unclear</b> because it has <b>insufficient <a href="/wiki/Wikipedia:Citing_sources#Inline_citations" title="Wikipedia:Citing sources">inline citations</a></b>.  <small><i>(January 2016)</i></small> ', // eslint-disable-line max-len
        'This article <b>may be <a href="/wiki/Wikipedia:Vagueness" title="Wikipedia:Vagueness">confusing or unclear</a> to readers</b>.  <small><i>(October 2016)</i></small> ', // eslint-disable-line max-len
        'This article <b>may be <a href="/wiki/Wikipedia:Article_size" title="Wikipedia:Article size">too long</a> to read and navigate comfortably</b>.  <small><i>(October 2016)</i></small>' // eslint-disable-line max-len
      ])
    })
    it('empty array returned when no titles exists', () => {
      document = domino.createDocument(
        '<div id=content_block_0>No disambiguation titles here!</div>'
      )
      const element = document.querySelector('div#content_block_0')
      assert.deepEqual(CollectionUtilities.collectPageIssuesHTML(document, element), [])
    })
    it('empty array returned when no titles found because element does not exist', () => {
      const element = document.querySelector('div#content_block_1')
      assert.deepEqual(CollectionUtilities.collectPageIssuesHTML(document, element), [])
    })
  })
  describe('.collectDisambiguationTitles()', () => {
    it('find disambiguation titles', () => {
      const element = document.querySelector('div#content_block_0')
      assert.deepEqual(CollectionUtilities.collectDisambiguationTitles(element), [
        '/wiki/Westerners_(Korean_political_faction)',
        '/wiki/Occident_(disambiguation)',
        '/wiki/Western_Hemisphere',
        '/wiki/Western_bloc',
        '/wiki/Western_culture',
        '/wiki/Westernization'
      ])
    })
    it('empty array returned when no titles exists', () => {
      document = domino.createDocument(
        '<div id=content_block_0>No disambiguation titles here!</div>'
      )
      const element = document.querySelector('div#content_block_0')
      assert.deepEqual(CollectionUtilities.collectDisambiguationTitles(element), [])
    })
    it('empty array returned when no titles found because element does not exist', () => {
      const element = document.querySelector('div#content_block_1')
      assert.deepEqual(CollectionUtilities.collectDisambiguationTitles(element), [])
    })
    it('redlink titles ignored', () => {
      document = domino.createDocument(`
        <div id=content_block_0>
          <div role="note" class="hatnote navigation-not-searchable">
            This article includes a <a href="/wiki/SampleRedlink" redlink=1>sample redlink</a> and
            one <a href="/wiki/NonRedlink">non-redlink</a>.
          </div>
        </div>
      `)
      const element = document.querySelector('div#content_block_0')
      assert.deepEqual(CollectionUtilities.collectDisambiguationTitles(element), [
        '/wiki/NonRedlink'
      ])
    })
    it('empty href titles ignored', () => {
      document = domino.createDocument(`
        <div id=content_block_0>
          <div role="note" class="hatnote navigation-not-searchable">
            This article includes a <a href="">sample empty href</a> and
            one <a href="/wiki/NonEmptyHref">non-empty href</a>.
          </div>
        </div>
      `)
      const element = document.querySelector('div#content_block_0')
      assert.deepEqual(CollectionUtilities.collectDisambiguationTitles(element), [
        '/wiki/NonEmptyHref'
      ])
    })
    it('missing href titles ignored', () => {
      document = domino.createDocument(`
        <div id=content_block_0>
          <div role="note" class="hatnote navigation-not-searchable">
            This article includes a <a>sample missing href</a> and
            one <a href="/wiki/NonMissingHref">non-missing href</a>.
          </div>
        </div>
      `)
      const element = document.querySelector('div#content_block_0')
      assert.deepEqual(CollectionUtilities.collectDisambiguationTitles(element), [
        '/wiki/NonMissingHref'
      ])
    })
  })
  describe('.collectDisambiguationHTML()', () => {
    it('find disambiguation titles', () => {
      const element = document.querySelector('div#content_block_0')
      assert.deepEqual(CollectionUtilities.collectDisambiguationHTML(element), [
        '"Westerners" and "Occident" redirect here. For historical politics in Korea, see <a href="/wiki/Westerners_(Korean_political_faction)" title="Westerners (Korean political faction)">Westerners (Korean political faction)</a>. For other uses, see <a href="/wiki/Occident_(disambiguation)" class="mw-disambig" title="Occident (disambiguation)">Occident (disambiguation)</a>.', // eslint-disable-line max-len
        'Not to be confused with <a href="/wiki/Western_Hemisphere" title="Western Hemisphere">Western Hemisphere</a> or <a href="/wiki/Western_bloc" class="mw-redirect" title="Western bloc">Western bloc</a>.', // eslint-disable-line max-len
        'See also: <a href="/wiki/Western_culture" title="Western culture">Western culture</a> and <a href="/wiki/Westernization" title="Westernization">Westernization</a>' // eslint-disable-line max-len
      ])
    })
    it('empty array returned when no titles exists', () => {
      document = domino.createDocument(
        '<div id=content_block_0>No disambiguation titles here!</div>'
      )
      const element = document.querySelector('div#content_block_0')
      assert.deepEqual(CollectionUtilities.collectDisambiguationHTML(element), [])
    })
    it('empty array returned when no titles found because element does not exist', () => {
      const element = document.querySelector('div#content_block_1')
      assert.deepEqual(CollectionUtilities.collectDisambiguationHTML(element), [])
    })
  })
})