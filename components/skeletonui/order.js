import React from "react";
import Skeleton from "react-loading-skeleton";
import { useTheme } from "react-jss";
import { WHITE } from "../../lib/config";
import * as color from "../../lib/color";

const OrderShimmer = () => {
  const theme = useTheme();
  return (
    <div className={"order-tile shimmer d-flex card-shadow"}>
      <div className="col-3 ">
        <Skeleton
          style={{
            borderRadius: "50%",
            backgroundColor: `${theme.appColor}`,
            backgroundImage: "linear-gradient( 90deg,#2a344c,#303d54,#2a364c )",
          }}
          // animation="wave"
          height={"60px"}
          width={"60px"}
          // variant="rect"
        />
      </div>
      <div className="order-tile-discription w-100  align-items-center m-0 col my-auto pl-0">
        <Skeleton
          style={{
            backgroundColor: `${theme.appColor}`,
            backgroundImage: "linear-gradient( 90deg,#2a344c,#303d54,#2a364c )",
          }}
          className="w-100 mb-2"
          // animation="wave"
          height={13}
          width={"100%"}
          // variant="text"
        />
        <Skeleton
          style={{
            backgroundColor: `${theme.appColor}`,
            backgroundImage: "linear-gradient( 90deg,#2a344c,#303d54,#2a364c )",
          }}
          height={13}
          className="mb-2"
          width={"60%"}
        />
        <Skeleton
          style={{
            backgroundColor: `${theme.appColor}`,
            backgroundImage: "linear-gradient( 90deg,#2a344c,#303d54,#2a364c )",
          }}
          height={13}
          width={"60%"}
        />
        {/* <Skeleton
            className="mb-1"
            animation="wave"
            height={22}
            width={"5%"}
            variant="text"
          /> */}
      </div>
      <style jsx>{`
        .shimmer {
          height: 88px;
        }
        :global(.order-tile > div > span) {
          width: 100% !important;
          display: flex;
        }
        .order-tile {
          background-color: ${theme.type == "light"
            ? theme.palette.l_app_bg
            : color.skalatonDark};

          border-radius: 6px;
          padding: 13px 0px;

          margin-bottom: 10px;
          cursor: pointer;
          transition: scale 1s;
          flex: 1;
        }
        :global(.border-radius7) {
          border-radius: 7px;
        }
      `}</style>
    </div>
  );
};

export default OrderShimmer;
