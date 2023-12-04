export const movetoNext = (key, nextFieldID) => {
    if (key.keyCode == 13 && nextFieldID) {
        document.getElementById(nextFieldID).focus();
    }
};