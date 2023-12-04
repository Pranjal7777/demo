// Moment Js Components
import moment from "moment";

export const formatDate = (date, format) => {
  return moment(date).format(format);
};

export const momentizedDate = (date) => {
  return moment(date);
};

export const formatOrderDate = (date) => {
  return moment(date).format("Do MMM hh:mm a");
};

export const timerConversion = (milliseconds) => {
  return moment.utc(milliseconds).format("mm:ss");
};

export const millisecondsToMinutesAndSeconds = (ms) => {
  // Convert milliseconds to minutes and seconds
  const minutes = Math.floor(ms / 60000); // 1 minute = 60,000 milliseconds
  const seconds = ((ms % 60000) / 1000).toFixed(0); // 1 second = 1,000 milliseconds

  return `${minutes ? minutes + " min" : ""} ${seconds} sec`;
}

// get 18  year before date
export const getCurrentAge = () => {
  return moment().startOf("day").subtract(18, "years");
};

export const formatDateOrder = (date) => {
  return moment(date).format("DD/MM/YYYY");
};

export const findDayAgo = (format, notification) => {
  if (notification) {
    return moment(format * 1000).fromNow();
  } else {
    return moment.utc(format).fromNow();
  }
};

export const getDayDifference = (date1) => {
  let dayDifference = Math.abs(date1 - new Date().getTime())
  let days = Math.floor(dayDifference / 86400000);
  return days;
}

export const formatDateInUTC = (timestamp, format) => {
  return moment.utc(timestamp).format(format);
}

export const dateformatter = (date, formate = "DD MMM YYYY") => {
  const today = moment().endOf("day").valueOf();
  const yesterDay = moment().subtract(1, "day").endOf("day").valueOf();
  if (date < yesterDay) {
    return formatDate(date, formate);
  } else if (date > yesterDay && date < today) {
    return `Today`;
  } else {
    return `Yesterday`;
  }
}