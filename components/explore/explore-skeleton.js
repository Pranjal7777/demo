import { Skeleton } from "@material-ui/lab";
import React from "react";

const ExploreSkeleton = () => {
  return (
    <div style={{ height: "100%" }}>
      <Skeleton variant="rect" width={"100%"} height={130} />
    </div>
  );
};
export default ExploreSkeleton;
