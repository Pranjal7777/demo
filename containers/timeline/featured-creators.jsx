import dynamic from "next/dynamic";
import Router from "next/router";
import React from "react";
import { getFeaturedCreatorsHook, getNewestCreatorsHook, getOnlineCreatorsHook } from "../../hooks/dashboardDataHooks";
import useLang from "../../hooks/language";
import FeatureList from "../../components/timeline-control/feature-list";
import HorizonatalPagination from "../../components/pagination/horizonatalPagination"
const Skeleton = dynamic(() => import("@material-ui/lab/Skeleton"));
import CustomDataLoader from "../../components/loader/custom-data-loading"

const FeatureCreators = (props) => {
  const { currentIndex, pageEventHandler, isLoading, skeleton } = props;
  const [lang] = useLang();
  const [featuredCreatorState] = getFeaturedCreatorsHook();
  const [newestCreatorState] = getNewestCreatorsHook();
  const [onlineCreatorState] = getOnlineCreatorsHook();

  const handleFeaturedList = () => {
    let listData = {
      listName: "",
      listTitle: "",
      listLink: ""
    }
    if ((currentIndex / 5) % 3 === 1) {
      listData.listName = newestCreatorState?.data;
      listData.listTitle = lang.newestCreator;
      listData.listLink = "/feature-creator?herocreator=true"
    } else if ((currentIndex / 5) % 3 === 2) {
      listData.listName = onlineCreatorState?.data;
      listData.listTitle = lang.onlineCreator;
      listData.listLink = "/feature-creator?onlinecreator=ture"
    } else {
      listData.listName = featuredCreatorState?.data;
      listData.listTitle = lang.featureCreators;
      listData.listLink = "/feature-creator?featuredcreator=true"
    }
    return listData;
  }

  if (!featuredCreatorState?.data?.length) return null;
  if (!onlineCreatorState?.data?.length) return null;
  if (!newestCreatorState?.data?.length) return null;
  return (
    <React.Fragment>
      <div className="col-12 px-0 pb-3">
        <div className="d-flex justify-content-between px-3">
          <h6 className="mv_subHeader mb-2 mt-1">{handleFeaturedList()?.listTitle}</h6>
          <p
            className="mb-2 mt-1 strong_app_text cursorPtr"
            onClick={() => Router.push(`${handleFeaturedList()?.listLink}`)}
          >
            View all
          </p>
        </div>
        <div
          className="nav sliUL"
          id="feat_creator_list"
          style={{
            flexWrap: "nowrap",
            overflow: "hidden",
            overflowX: "auto",
            width: '100%',
          }}
        >
          {skeleton ? (
            <>
              <Skeleton
                variant="rect"
                width={133}
                height={133}
                className="mx-2 feat_skelt bg-color"
              />
              <Skeleton
                variant="rect"
                width={133}
                height={133}
                className="mx-2 feat_skelt bg-color"
              />
              <Skeleton
                variant="rect"
                width={133}
                height={133}
                className="mx-2 feat_skelt bg-color"
              />
              <Skeleton
                variant="rect"
                width={133}
                height={133}
                className="mx-2 feat_skelt bg-color"
              />
              <Skeleton
                variant="rect"
                width={133}
                height={133}
                className="mx-2 feat_skelt bg-color"
              />
            </>
          ) : (
            <>
              {handleFeaturedList()?.listName?.map((data, index) => {
                return (
                  <FeatureList
                    key={index}
                    id={index}
                    setActiveState={props.setActiveState}
                    userId={data.userId}
                    bannerImage={data.bannerImage}
                    profilePic={data.profilePic}
                    fullName={data.fullName}
                    username={data.username}
                    timeLineCards={true}
                  />
                );
              })}
              <HorizonatalPagination
                pageEventHandler={() => {
                  if (!isLoading && (featuredCreatorState.hasMore || onlineCreatorState.hasMore || newestCreatorState.hasMore)) {
                    pageEventHandler;
                  }
                }}
                id="feat_creator_list"
              ></HorizonatalPagination>
            </>
          )}
          <div className="feat_loader mx-2">
            {isLoading && <CustomDataLoader loading={true}></CustomDataLoader>}
          </div>
        </div>
      </div>
      <style>{`
      .feat_skelt{
        min-width: 133px;
        border-radius: 8px;
      }
      .feat_loader{
        display: flex;
        justify-content: center;
        align-items: center;
        transform: rotate(90deg);          
      }
      :global(.MuiSkeleton-root, .bg-color){
        background-color: #00000094 !important
      }
      // #feat_creator_list{
      //   height: 133px;
      // }
    `}</style>
    </React.Fragment>
  );
};
export default FeatureCreators;
