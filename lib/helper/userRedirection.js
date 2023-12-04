import Router from "next/router";
import { getCookie, setCookie } from "../session";
import parse from "html-react-parser";
import { linkify } from "../global/linkify";
import { close_dialog, close_drawer, open_progress } from "../global/loader";
import { isAgency } from "../config/creds";

const taggedUserClickHandler = (userName, taggedUsersList) => {
    let hashtag = userName.replace('#', '')
    let updatehashtag = hashtag.replace("<br>", " ")?.split(" ")?.[0];
    if (userName?.startsWith("#")) {
        close_dialog();
        close_drawer();
        Router.push(`/explore/${updatehashtag}`)
    }

    if (userName?.startsWith("@")) {
        const usersList = [...taggedUsersList] || [];
        const uname = userName.slice(1);
        usersList.map((item) => {
            if (item.userType === "USER" || item.userTypeCode === 1) return;
            if (item.username == uname) {
                if ((isAgency() ? getCookie("selectedCreatorId") : getCookie("uid")) == item.userId) {
                    open_progress();
                    Router.push(`/profile`);
                } else if (item?.userTypeCode !== 1) {
                    open_progress();
                    setCookie("otherProfile", `${item?.username.trim() || item?.userName.trim()}$$${item?.userId || item?.userid || item?._id}`)
                    Router.push(`/${item.username}`);
                }
                close_dialog();
                close_drawer();
                return;
            }
        });
    }
};


export const commentParser = (data, taggedUsersList) => {
    const taggedUsers = taggedUsersList?.map((item) => item.username);
    const userTypeCodes = taggedUsersList?.map((item) => (item.userType === "MODEL" || item.userTypeCode === 2) ? 2 : 1);
    let improvedData = data?.replace(/(\.)/gm, " ").replace(/(\r\n|\n|\r)/gm, "<br> ");
    let txt = improvedData.split(" ");

    txt = txt.map((item) => {
        if (item.startsWith("@")) {
            const uname = item.slice(1);
            if (taggedUsers?.includes(uname)) {
                const userTypeCodeIndex = taggedUsers.indexOf(uname);
                const userTypeCode = userTypeCodes?.[userTypeCodeIndex];
                if (userTypeCode === 2) {
                    item = `<b id="${item}" class="comment_tag" style="cursor: pointer">${item}</b>`;
                } else {
                    item = `<b id="${item}" class="comment_tag">${item}</b>`;
                }
            }
        }
        if (item.startsWith("#")) {
            item = `<b id="${item}" class="hashTags">${item}</b>`;
        }
        return item;
    })
        .join(" ");

    return parse(linkify(txt), {
        replace: (domNode) => {
            if (domNode.attribs && domNode.attribs.id) {
                domNode.attribs.onClick = () =>
                    taggedUserClickHandler(domNode.attribs.id, taggedUsersList);
            }
        },
    });
};
