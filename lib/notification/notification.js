import { newNotification } from "../rxSubject";

export const handlerNotification = (type, data) => {
  // console.log("notification type", type);
  switch (type) {
    case "1":
      newNotification.next(data);
      break;
    case "2":
      newNotification.next(data);
      break;
    default:
      return "";
  }
};
