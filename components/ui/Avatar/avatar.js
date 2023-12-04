//library import
import React from "react";
import { width } from "@material-ui/system";
import * as env from "../../../lib/config";
import Img from "../Img/Img";
const Avatar = (props) => {
  return (
    <div
      style={{
        backgroundColor: props.bgColor,
        position: "relative",
        overflow: "hidden",
      }}
      className={` ${props.classes}`}
    >
      <Img
        className="rounded-circle"
        src={props.src}
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",

          padding: props.padding || "2px",
          objectFit: "cover",
        }}
      />
      {props.online && <Img src={env.LIVE} className="live-icon"></Img>}

      {props.type ? (
        <button
          onClick={props.clickHandler ? props.clickHandler : () => {}}
          className="w-100"
          style={{
            background: "#000",
            opacity: "0.7",
            color: "#fff",
            position: "absolute",
            bottom: "0",
          }}
        >
          Edit
        </button>
      ) : null}
      <style jsx>
        {`
          .live-icon {
            position: absolute;
            bottom: 2px;
            left: 3px;
          }

          .rounded-circle {
            border: 2px soldi ${env.BACKGROUND_COLOR};
          }
        `}
      </style>
    </div>
  );
};

export default Avatar;
