import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

export const parseStringToHtml = (html) => {
    return ReactHtmlParser(html);
}