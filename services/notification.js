import { get } from "../lib/request";

export const getUserNotifications = (payload) => {
  let url = `/notifications/?skip=${payload.skip}&limit=${payload.limit}`;
  if (payload.notifyType) {
    url = url + "&notifyType=" + payload.notifyType;
  }
  if (payload?.userId) {
    url = url + "&userId=" + payload.userId;
  }
  return get(url, {
    appname: "Bombshell Influencers",
  });
};
export const notificationUnreadCount = async (skip = 0, limit = 5) => {
  return get(`/notificationCount/`, {
    appname: "Bombshell Influencers",
  })
};

export const chatNotificationUnreadCnt = async () => {
  return get(`/chat/unreadCount`)
};