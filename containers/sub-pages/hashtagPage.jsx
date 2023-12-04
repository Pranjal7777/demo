import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Hashtag from "../../components/Drawer/hashtag/hashtagDrawer";
import isMobile from "../../hooks/isMobile";

const HashtagPage = (props) => {
  const [mobileView] = isMobile();
  const dispatch = useDispatch();


  return (
    <>
      {mobileView
        ? <div className="mv_wrap_home" style={{ background: "none !important" }}>
          <Hashtag props={props} />
        </div>
        : <>
          {/* <MarkatePlaceHeader
            setActiveState={props.setActiveState}
            {...props}
          /> */}
          <Hashtag props={props} />
        </>
      }
    </>
  );
};

export default HashtagPage;
