import React from "react";
import { useDispatch, useSelector } from "react-redux";
import PullToRefresh from "react-simple-pull-to-refresh";
import { getStreamsHook } from "../../hooks/liveStreamHooks";
import { getLiveStreams } from "../../redux/actions/liveStream/liveStream";
import PaginationIndicator from "../../components/pagination/paginationIndicator";
import LiveStreamCards from "./live-stream-cards";
import { GO_LIVE_SCREEN } from "../../lib/config";
import isMobile from "../../hooks/isMobile";
import CustomDataLoader from "../../components/loader/custom-data-loading";
import { isAgency } from "../../lib/config/creds";

const StreamCardsFollowing = (props) => {
  const [mobileView] = isMobile();
  const streamType = 5;
  const streamStatus = 1;
  const [followingStreams] = getStreamsHook("FOLLOWING_STREAMS");
  const [isLoading, setIsLoading] = React.useState(true);
  const dispatch = useDispatch();
  const [apiResponse, setResponse] = React.useState(false);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
  let creatorId = isAgency() ? selectedCreatorId : "";
  const { callStreamFunction, setWarnStateIssue } = props
  React.useEffect(() => {
    if (!followingStreams.data.length) {
      // startLoader();
      dispatch(
        getLiveStreams(
          streamType,
          streamStatus,
          null,
          null,
          10,
          followingStreams.page * 10,
          () => {
            // stopLoader();
            setTimeout(() => {
              setResponse(true);
            }, 1000);
            setIsLoading(false);
          },
          true,
          creatorId
        )
      );
    } else {
      console.log("DATA ==>>", followingStreams.data);
      setIsLoading(false);
    }
  }, []);

  const handlePagination = (callAPI = true) => {
    if (!callAPI || isLoading) return;
    setIsLoading(true);
    dispatch(
      getLiveStreams(
        streamType,
        streamStatus,
        null,
        null,
        10,
        followingStreams.page * 10,
        () => setIsLoading(false),
        true,
        creatorId
      )
    );
  };

  const handleRefresh = () => {
    return new Promise(async (resolve) => {
      const isPagination = false;
      dispatch(
        getLiveStreams(
          streamType,
          streamStatus,
          null,
          null,
          10,
          0,
          () => setTimeout(resolve, 1),
          isPagination,
          creatorId
        )
      );
    });
  };

  return (
    <>
      <PullToRefresh onRefresh={handleRefresh} fetchMoreThreshold={500}>
        <div className={mobileView ? 'col-12' : 'col-12 px-0 pt-4'}>
          <PaginationIndicator
            id="following__stream__cards"
            totalData={followingStreams.data || []}
            totalCount={followingStreams.totalCount}
            pageEventHandler={handlePagination}
          />
          <div
            className="form-row pb-3 align-content-start"
            id="following__stream__cards"
            style={{ height: mobileView ? "calc(100vh - 183px)" : "calc(89vh - 80px)", overflow: "auto" }}
          >
            {(!isLoading) ? followingStreams.data.length ? (
              followingStreams.data.map((stream) => (
                <div className={mobileView ? "col-6 mb-2" : "col-auto p-0 mb-3 ml-3"} key={stream.streamId}>
                  <LiveStreamCards mobileView={mobileView} streamData={stream} setWarnStateIssue={setWarnStateIssue} callStreamFunction={callStreamFunction} />
                </div>
              ))
            ) : (
              <div
                style={{ height: "calc(100vh - 208px)" }}
                className="w-100 d-flex align-items-center justify-content-center flex-column"
              >
                <img
                  src={GO_LIVE_SCREEN.NoStreamPlaceholder}
                  alt="No Streams Available"
                />
                <span className="pt-3 txt-heavy fntSz22">
                  No Streams Available
                </span>
              </div>
            ) : <div className="d-flex align-items-center justify-content-center position-static profileSectionLoader">
              <CustomDataLoader type="ClipLoader" loading={!apiResponse} size={60} />
            </div>}
          </div>
        </div>
      </PullToRefresh>
      <style jsx>
        {`
          .insideCard {
            width: 26vw;
            border-radius: 3px;
          }
          .userStreamCardClass {
            min-height: 230px;
            box-shadow: inset 0px 0px 20px 10px #00000038;
            background-size: cover;
            background-repeat: no-repeat;
            border-radius: 12px;
            background-position: center top;
          }

          .userProfileImgClass {
            width: 34px;
            height: 34px;
            border-radius: 50%;
            border: 1px solid #ffffff;
          }

          .productCartImgCss {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: 1px solid #ffffff;
          }

          .userNameCss {
            color: #ffffff;
            font-size: 12px;
            font-family: "Roboto", sans-serif !important;
          }

          .cardInfoCss {
            color: var(--l_base);
            font-size: 11px;
            font-weight: 600;
          }

          .cardInfoPrice {
            color: #707070;
            font-size: 11px;
            font-weight: 600;
            text-decoration: line-through;
          }

          .cardSlider {
            overflow-x: auto;
          }
          .cardSlider::-webkit-scrollbar {
            display: none !important;
          }

          .userNameCss__sec {
            margin-top: -5px !important;
          }

          .userNameCss__count {
            color: #ffffff;
            font-size: 10px;
            font-family: "Roboto", sans-serif !important;
          }

          .txt__desc {
            font-family: "Roboto", sans-serif !important;
          }

          .text-ellip-two {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: initial;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }

          .setMid__lyt {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 9;
          }

          .locked__img {
            background: rgb(255 255 255 / 60%);
            border-radius: 50%;
            padding: 10px;
            width: 55px;
            height: 55px;
          }

          .curreny__lyt {
            background: #ffffff;
            width: 75px;
            text-align: center;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 24px;
          }

          .curr__amt {
            font-family: "Roboto", sans-serif !important;
            color: #000000;
            font-size: 14px;
          }

          .time__count {
            font-family: Roboto;
            font-size: 16px;
          }

          .btm__blur {
            background-image: linear-gradient(
              rgb(0 0 0 / 0%) 0%,
              rgb(0 0 0 / 30%) 40%,
              rgb(0 0 0 / 60%) 100%
            );
          }
        `}
      </style>
    </>
  );
};

export default StreamCardsFollowing;
