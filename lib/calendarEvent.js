import { GOOGLE_ID } from "./config";

let CLIENT_ID = GOOGLE_ID;
let API_KEY = "AIzaSyAEg8F0ylDtm4KySq5WTtqwVdk-2fR8Xbw";
let DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
let SCOPES = "https://www.googleapis.com/auth/calendar.events";

//export a function that gets start time(date picker), location, name 
export const addCalendarEvent = (startTime, durationParam, address, clientName) => {

  let gapi = window.gapi;
  let google = window.google;
  if (!gapi || !google) return;

  let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const durationInMins = ~~(durationParam / 60);
  let duration = `${~~(durationInMins / 60) < 10 ? '0' + ~~(durationInMins / 60) : ~~(durationInMins / 60)}:${~~(durationInMins % 60) < 10 ? '0' + ~~(durationInMins % 60) : ~~(durationInMins % 60)}:00`; //duration of each event, here 30 minuts



  //event start time - im passing datepicker time, and making it match      //with the duration time, you can just put iso strings:
  //2020-06-28T09:00:00-07:00' 

  let startDate = new Date(startTime);
  let msDuration = (Number(duration.split(':')[0]) * 60 * 60 + Number(duration.split(':')[1]) * 60 + Number(duration.split(':')[2])) * 1000;
  let endDate = new Date(startDate.getTime() + msDuration);
  let isoStartDate = new Date(startDate.getTime() - new Date().getTimezoneOffset() * 60 * 1000).toISOString().split(".")[0];
  let isoEndDate = new Date(endDate.getTime() - (new Date().getTimezoneOffset()) * 60 * 1000).toISOString().split(".")[0];
  let event = {
    'summary': clientName, // or event name
    'location': address, //where it would happen
    'start': {
      'dateTime': isoStartDate,
      'timeZone': timeZone
    },
    'end': {
      'dateTime': isoEndDate,
      'timeZone': timeZone
    },
    'recurrence': [
      'RRULE:FREQ=DAILY;COUNT=1'
    ],
    'reminders': {
      'useDefault': false,
      'overrides': [
        { 'method': 'popup', 'minutes': 20 }
      ]
    }
  }
  const addEventCallBack = async (successObj) => {
    if (gapi.client.getToken()) {
      const resp = await gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: event,
        sendUpdates: "all",
        conferenceDataVersion: 1
      });
      console.log("resp", resp);
    }
  };
  gapi.load("client", async () => {
    try {
      await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS
      })
      const googleClient = await google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        prompt: "",
        callback: addEventCallBack
      });
      if (!googleClient) return;

      if (gapi.client.getToken() === null) {
        googleClient.requestAccessToken({ prompt: "consent" });
      } else {
        googleClient.requestAccessToken({ prompt: "" });
      }
    } catch (err) {
      console.log(err, "is the error got while adding event to calendar");
    }
  });
}