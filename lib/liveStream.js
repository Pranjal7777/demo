import { PROJECTS_CREDS } from "./config/creds";

// Message Type 0 =>text, 1 => like, 2 => gift
export const LiveStreamMessagePayload = {
  // message: "",
  // senderImage: "fanzly/users/profiles/lngygtsru6vgivm6mxzs",
  // senderIdentifier: "marika_jack",
  streamId: "",
  // senderName: "",
  messageType: 0,
  // senderId: '',
  // keysetId: PROJECTS_CREDS.keysetId,
  // projectId: PROJECTS_CREDS.projectId,
  // accountId: PROJECTS_CREDS.accountId,
  // timestamp: null,
  deviceId: ""
};

export const fancyTimeFormat = (duration) => {
  // Hours, minutes and seconds
  let hrs = ~~(duration / 3600);
  let mins = ~~((duration % 3600) / 60);
  let secs = ~~duration % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  let ret = "";

  if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }

  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;
  return ret;
}
