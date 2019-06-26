/* eslint-disable require-jsdoc */

/* ArticleRefSourceType is global */

export default [
  'first_paragraph_checkbox',
  'Move 1st Paragraph Up *',
  'checkbox',
  null,
  (iframeWindow, iframeDocument) => {
    event.target.disabled = true
    // eslint-disable-next-line no-undef
    if (iframeDocument.articleRef.sourceType === ArticleRefSourceType.mobileView) {
      iframeWindow.pagelib.LeadIntroductionTransform.moveLeadIntroductionUp(
        iframeDocument, 'content_block_0', iframeDocument.querySelector('.section_header')
      )
    }
  }
]
