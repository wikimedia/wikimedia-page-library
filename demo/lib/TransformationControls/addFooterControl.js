/* eslint-disable require-jsdoc */

import util from '../util.js'
const { expandIframeHeight } = util

const addFooterContainer = (iframeWindow, iframeDocument) => {
  const containerFragment = iframeWindow.pagelib.FooterContainer.containerFragment(iframeDocument)
  iframeDocument.body.appendChild(containerFragment)
}

const addFooterMenu = (iframeWindow, iframeDocument) => {
  iframeWindow.pagelib.FooterMenu.setHeading(
    'About this article', 'pagelib_footer_container_menu_heading', iframeDocument
  )
  iframeWindow.pagelib.FooterMenu.maybeAddItem(
    'Available in 10 other languages',
    '',
    iframeWindow.pagelib.FooterMenu.MenuItemType.languages,
    'pagelib_footer_container_menu_items',
    () => {},
    iframeDocument
  )
  iframeWindow.pagelib.FooterMenu.maybeAddItem(
    'Edited 10 days ago',
    '',
    iframeWindow.pagelib.FooterMenu.MenuItemType.lastEdited,
    'pagelib_footer_container_menu_items',
    () => {},
    iframeDocument
  )
  iframeWindow.pagelib.FooterMenu.maybeAddItem(
    'Page issues',
    '',
    iframeWindow.pagelib.FooterMenu.MenuItemType.pageIssues,
    'pagelib_footer_container_menu_items',
    () => {},
    iframeDocument
  )
  iframeWindow.pagelib.FooterMenu.maybeAddItem(
    'Similar pages',
    '',
    iframeWindow.pagelib.FooterMenu.MenuItemType.disambiguation,
    'pagelib_footer_container_menu_items',
    () => {},
    iframeDocument
  )
  iframeWindow.pagelib.FooterMenu.maybeAddItem(
    'View on a map',
    '',
    iframeWindow.pagelib.FooterMenu.MenuItemType.coordinate,
    'pagelib_footer_container_menu_items',
    () => {},
    iframeDocument
  )
}

const addFooterReadMore = (iframeWindow, iframeDocument, iframe) => {
  iframeWindow.pagelib.FooterReadMore.setHeading(
    'Read more', 'pagelib_footer_container_readmore_heading', iframeDocument
  )
  const readMoreItemsFetchedHandler = titles => {
    let shouldSave = true
    titles.forEach(title => {
      iframeWindow.pagelib.FooterReadMore.updateSaveButtonForTitle(
        title, 'Saved for later', shouldSave, iframeDocument
      )
      shouldSave = !shouldSave
    })
    expandIframeHeight(iframe)
  }
  const baseURL = `https://cors.io/?https://${iframeDocument.articleRef.lang}.wikipedia.org`
  // Add read more for article 'a' since most langs seem to have article about this letter.
  iframeWindow.pagelib.FooterReadMore.add(
    'a',
    3,
    'pagelib_footer_container_readmore_pages',
    baseURL,
    () => {},
    readMoreItemsFetchedHandler,
    iframeDocument
  )
}

const addFooterLegal = (iframeWindow, iframeDocument) => {
  iframeWindow.pagelib.FooterLegal.add(
    iframeDocument,
    'Content is available under $1 unless otherwise noted.',
    'CC BY-SA 3.0',
    'pagelib_footer_container_legal',
    () => {},
    'View in browser',
    () => {}
  )
}

export default [
  'footer_checkbox',
  'Add footer *',
  'checkbox',
  null,
  (iframeWindow, iframeDocument, selectedValue, iframe) => {
    event.target.disabled = true
    if (iframeWindow.pagelib.c1) {
      iframeWindow.pagelib.c1.Footer.add({
        title: 'Knight Lore',
        menuItems: [
          iframeWindow.pagelib.c1.Footer.MenuItemType.languages,
          iframeWindow.pagelib.c1.Footer.MenuItemType.lastEdited,
          iframeWindow.pagelib.c1.Footer.MenuItemType.pageIssues,
          iframeWindow.pagelib.c1.Footer.MenuItemType.disambiguation,
          iframeWindow.pagelib.c1.Footer.MenuItemType.talkPage,
          iframeWindow.pagelib.c1.Footer.MenuItemType.referenceList
        ],
        l10n: {
          'readMoreHeading': 'Read more',
          'menuDisambiguationTitle': 'Similar pages',
          'menuLanguagesTitle': 'Available in 9 other languages',
          'menuHeading': 'About this article',
          'menuLastEditedSubtitle': 'Full edit history',
          'menuLastEditedTitle': 'Edited today',
          'licenseString': 'Content is available under $1 unless otherwise noted.',
          'menuTalkPageTitle': 'View talk page',
          'menuPageIssuesTitle': 'Page issues',
          'viewInBrowserString': 'View article in browser',
          'licenseSubstitutionString': 'CC BY-SA 3.0',
          'menuCoordinateTitle': 'View on a map',
          'menuReferenceListTitle': 'References'
        },
        readMore: {
          itemCount: 3,
          baseURL: 'https://en.wikipedia.org/api/rest_v1'
        }
      })
    } else {
      addFooterContainer(iframeWindow, iframeDocument)
      addFooterMenu(iframeWindow, iframeDocument)
      addFooterReadMore(iframeWindow, iframeDocument, iframe)
      addFooterLegal(iframeWindow, iframeDocument)
    }
  }
]
