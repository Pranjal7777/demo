import React from "react";
import Head from 'next/head';
import {
  WHITE,
  color7,
  color1,
  MAP_KEY,
} from "../../../lib/config";
import Wrapper from "../chatWrapper/chatWrapper";
import { textdecode } from "../../../lib/chat";
import Map from "../../map/map";
const Location = (props) => {
  let locationData =
    props.message &&
    props.message.payload &&
    textdecode(props.message.payload).split("@@");
  locationData[0] = locationData[0].replace(/[\(\)']+/g, "");
  let latLong = locationData && locationData[0].split(",");
  // console.log("Locationda ddwadhqw djqwd", locationData);
  return (
    <>
    <Head>
      <script src={`https://maps.googleapis.com/maps/api/js?key=${MAP_KEY}&libraries=places`} />
    </Head>
    <Wrapper
      index={props.index}
      message={props.message}
      profilePic={props.profilePic}
      user={props.user}
    >
      <div className="chat-block">
        <div className="d-flex align-items-start">
          <div
            className="chat-location"
            onClick={() => {
              window.open(`http://maps.google.com?q=${locationData[0]}`);
            }}
          >
            {locationData && (
              <Map
                center={{
                  lat: parseFloat(latLong[0]),
                  lng: parseFloat(latLong[1]),
                }}
                propOption={{
                  gestureHandling: "none",
                  keyboardShortcuts: false,
                  scrollwheel: false,
                }}
                height="170px"
                zoom={19}
                zoomEnable={false}
                draggable={false}
                disableDefaultUI
              ></Map>
              )}
            {/* <div className="pt-1 location-text">{locationData[1]}</div> */}
          </div>
        </div>
      </div>

      <style jsx>
        {`
          :global(.chat-location-img) {
            height: inherit;
            width: inherit;
          }
          .location-text {
            font-size: 0.7rem;
            margin-top: 5px !important;
          }
          :global(.chat-location > div) {
            margin: 0px !important;
            padding: 0px !important;
          }
          :global(.chat-location > div > div > div) {
            margin: 0px !important;
            padding: 0px !important;
          }
          .chat-time {
            white-space: nowrap;
            font-size: 0.6rem;
            width: fit-content;
            margin-left: auto;
            font-weight: 500;
            margin-top: 5px;
            // color: #dedee1;
          }
          .chat-block {
            width: fit-content;
            max-width: 230px;
            width: 230px;
            height: auto;
          }
          .chat-location {
            cursor: pointer;
            background-color: ${props.user ? WHITE : WHITE};
            border: 1px solid ${props.user ? color7 : color7};
            color: ${!props.user ? WHITE : color1};
            border-radius: 8px;
            font-weight: 500;
            border-top-left-radius: ${props.user ? "8px" : "0px"};
            border-top-right-radius: ${props.user ? "0px" : "8px"};
            padding: 7px 7px;
            font-size: 0.75rem;
            height: 100%;
            width: 100%;
          }
        `}
      </style>
    </Wrapper>
    </>
  );
};

export default Location;
