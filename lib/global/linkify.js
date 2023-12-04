
export const linkify = (text) => {
    var urlRegex =
        /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
    return text?.replace(urlRegex, function (url) {
        let urlInstance = url;
        if (!urlInstance.startsWith("http")) {
            urlInstance = "https://" + url;
        }
        return '<a target="_blank" href="' + urlInstance + '">' + url + "</a>";
    });
};
