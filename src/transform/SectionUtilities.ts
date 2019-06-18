/**
 * get Section Offsets object to handle quick scrolling in the table of contents
 * @param  {!HTMLBodyElement} body that needs the margins adjusted.
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


export default {
    getSectionOffsets
}