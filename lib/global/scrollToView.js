export const scrollToView = (elementId, scrollHeight) => {
    const elementNode = document.getElementById(elementId) || elementId?.current;
    if (elementNode) {
        if (scrollHeight) {
            return (elementNode.scrollTop = scrollHeight);
        } else {
            return (elementNode.scrollTop = 0);
        }
    }
    return;
};