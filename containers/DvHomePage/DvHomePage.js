import dynamic from "next/dynamic";
import React from "react";
import Wrapper from "../../hoc/Wrapper";
import FeaturedOptions from "../timeline/options";
import PopularModels from "../timeline/popular-feature";
import { open_dialog } from "../../lib/global/loader";
import useLang from "../../hooks/language"
import { useTheme } from "react-jss";
import { TIMELINE_PLACEHOLDER } from "../../lib/config/homepage";
const Placeholder = dynamic(() => import("../profile/placeholder"));
const Button = dynamic(() => import("../../components/button/button"));
const LatestModels = dynamic(() => import("../timeline/latest-feature"));
const TimelineSkeleton = dynamic(() => import("../../components/timeline-control/timeline-card-skeleton"))

const DvHomePage = (props) => {
  const { activeTab = "POPULAR" } = props;
  const [lang] = useLang();
  const theme = useTheme();

  return (
    <Wrapper>
      <div className="row">
        <div className="col-auto mx-auto w-100">
          {/* <FeaturedOptions handleTabChange={props.handleTabChange} /> */}
          <div className="tab-content" id="myTabContent">
            {activeTab === "POPULAR" ? (
            <PopularModels
              setActiveState={props.setActiveState}
              posts={props.posts}
              showSkeleton={props.showSkeleton}
              followUnfollowEvent={props.followUnfollowEvent}
              deletePostEvent={props.deletePostEvent}
              subscribedEvent={props.subscribedEvent}
                setHomePageData={props.setHomePageData}
              />
            ) : <></>}
            {activeTab === "LATEST" ? (
              <LatestModels
                setActiveState={props.setActiveState}
                posts={props.posts}
                showSkeleton={props.showSkeleton}
                deletePostEvent={props.deletePostEvent}
                subscribedEvent={props.subscribedEvent}
                setHomePageData={props.setHomePageData}
              /> )
              : <></>}
          </div>
          {props.showSkeleton && <TimelineSkeleton />}
          {props.showSkeleton && <TimelineSkeleton />}
          {props.showSkeleton && <TimelineSkeleton />}
          {props.showSkeleton && <TimelineSkeleton />}
          {props.showSkeleton && <TimelineSkeleton />}
          {(!props.posts && !props.showSkeleton) ||
            (props.posts && !props.posts.length && !props.showSkeleton && (
              <Placeholder
                label="You're not following anybody."
              placeholderImage={TIMELINE_PLACEHOLDER}
              >
                <div className="mt-3">
                  <Button
                    type="submit"
                    fixedBtnClass={"active"}
                    onClick={() => {
                      open_dialog(
                        "search",
                        {
                          handleClose: () => {
                            props.handleRefresh();
                          },
                        }
                      );
                    }}
                  >
                    {lang.followPopularCreator}
                  </Button>
                </div>
              </Placeholder>
            ))}
        </div>
      </div>
    </Wrapper>
  );
};

export default DvHomePage;
