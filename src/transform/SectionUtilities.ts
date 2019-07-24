/**
 * get Section Offsets object to handle quick scrolling in the table of contents
 * @param  {!HTMLBodyElement} body HTML body element DOM object.
 * @return {!object} section offsets object
 */
const getSectionOffsets = (body: HTMLBodyElement): object => {
    const sections = Array.from(body.querySelectorAll('section'))
    return {
        sections: sections.reduce((results: Array<object>, section: HTMLElement) => {
            const id = section.getAttribute('data-mw-section-id');
            const heading = section &&
                section.firstElementChild &&
                section.firstElementChild.querySelector('.pagelib_edit_section_title');
            if (id && parseInt(id) >= 1) {
                results.push({
                    heading: heading && heading.innerHTML,
                    id: parseInt(id),
                    yOffset: section.offsetTop,
                });
            }
            return results;
        }, [])
    }
}

/**
 * get current section
 * @param  {!Window} window object.
 * @return {!string} section id
 */
const getCurrentSection = (window: Window): string => {
    const document = window.document;
    const sectionHeaders = document.querySelectorAll( ".section_heading, .pagelib_edit_section_header" );
    if (!sectionHeaders) {
        return '-1';
    }
    const bottomDiv = document.getElementById( "bottom_stopper" );
    if (!bottomDiv) {
        return '-1';
    }
    const topCutoff = window.scrollY + ( document.documentElement.clientHeight / 2 );
    if (topCutoff > bottomDiv.offsetTop) {
        return '-1';
    }
    let curClosest = null;
    for ( let i = 0; i < sectionHeaders.length; i++ ) {
        const el = <HTMLElement>sectionHeaders[i];
        if ( curClosest === null ) {
            curClosest = el;
            continue;
        }
        if ( el.offsetTop >= topCutoff ) {
            break;
        }
        if ( Math.abs(el.offsetTop - topCutoff) < Math.abs(curClosest.offsetTop - topCutoff) ) {
            curClosest = el;
        }
    }
    const closestDataId = curClosest && curClosest.getAttribute( "data-id" )
    return closestDataId || '0';
}


export default {
    getCurrentSection,
    getSectionOffsets
}