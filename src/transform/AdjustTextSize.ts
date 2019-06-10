/**
 * Set text size adjustment percentage of the body element
 * @param  {!HTMLBodyElement} body that needs the margins adjusted.
 * @return {void}
 */
const setPercentage = (body: HTMLBodyElement, textSize: string): void => {
    if (textSize){
        // casting body style to avoid errors with the subscript operator and typescript
        // see https://stackoverflow.com/questions/37655393
        (<any>body.style)['-webkit-text-size-adjust'] = textSize;
        (<any>body.style)['text-size-adjust'] = textSize;
    }
}


export default {
    setPercentage
}