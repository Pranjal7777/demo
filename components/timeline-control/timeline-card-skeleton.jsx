import React from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import { useTheme } from "react-jss";
import { skalatonDark } from "../../lib/color";

const TimelineSkeleton = (props) => {
  const theme = useTheme();
  const itemCount = props.itemCount || [1, 2, 3, 4, 5];
  return (
    <React.Fragment>
      {itemCount.map((e, i) => (
        <div key={i} className="rounded p-3 mb-5 skeleton_cont">
          <div className="col-12 d-flex p-0">
            <Skeleton
              className="bg-color"
              variant="circle"
              width={60}
              height={60}
            />
            <div className="ml-3 w-50 row">
              <Skeleton
                className="rounded bg-color"
                variant="rect"
                width="100%"
                height={20}
              />
              <Skeleton
                className="rounded bg-color"
                variant="rect"
                width="80%"
                height={10}
              />
            </div>
            <Skeleton
              className="rounded ml-auto bg-color"
              variant="rect"
              width={30}
              height={8}
            />
          </div>
          <Skeleton
            className="rounded my-3 bg-color"
            variant="rect"
            width="100%"
            height={250}
          />
          <div className="col-12 d-flex p-0 justify-content-between">
            <Skeleton
              className="bg-color"
              variant="rect"
              width={40}
              height={20}
            />
            <Skeleton
              className="bg-color"
              variant="rect"
              width={40}
              height={20}
            />
            <Skeleton
              className="bg-color"
              variant="rect"
              width={70}
              height={20}
            />
            <div className="d-flex">
              <Skeleton
                className="bg-color mr-1"
                variant="circle"
                width={20}
                height={20}
              />
              <Skeleton
                className="bg-color ml-1"
                variant="circle"
                width={20}
                height={20}
              />
            </div>
          </div>
          <Skeleton
            className="rounded my-2 bg-color"
            variant="rect"
            width="100%"
            height={30}
          />
          <Skeleton
            className="rounded my-2 bg-color"
            variant="rect"
            width="60%"
            height={20}
          />
          <Skeleton
            className="rounded my-2 bg-color"
            variant="rect"
            width="50%"
            height={20}
          />
        </div>
      ))}
      <style jsx>{`
        :global(.MuiSkeleton-root, .bg-color) {
          // background-color: ${theme.palette.white} !important;
        }
        .skeleton_cont {
          background-color: ${theme.type == "light"
            ? theme.palette.white
        : skalatonDark};
          box-shadow: 0px 1px 15px 10px ${theme.palette.l_boxshadow};
        }
      `}</style>
    </React.Fragment>
  );
};
export default TimelineSkeleton;
