import moment from 'moment';
import React, { useEffect, useState } from 'react';
import isMobile from '../../../hooks/isMobile';
import { GO_LIVE_SCREEN } from '../../../lib/config';
import { startLoader, stopLoader, Toast } from '../../../lib/global';
import { getCookie } from '../../../lib/session';
import { getProfileStream } from '../../../services/liveStream';
import LiveStreamCards from '../../live-stream-tabs/live-stream-cards';
import Button from '../../../components/button/button';
import FilterOption from '../../../components/filterOption/filterOption';
import { useRouter } from "next/router";
import useProfileData from '../../../hooks/useProfileData';
import PaginationIndicator from '../../../components/pagination/paginationIndicator';
import { isOwnProfile } from '../../../lib/global/routeAuth';
import { handleContextMenu } from '../../../lib/helper';
import AllStreamCards from './AllStreamCards';


const streamPostTab = (props) => {
  const [currentTime, setCurrentTime] = useState(moment().unix());
  const [mobileView] = isMobile();
  const selfUserId = getCookie('uid');
  const [profileData] = useProfileData();
  const router = useRouter();
  const [recordLoaded, setRecordLoaded] = useState(false);
  const [activeStreamTab, setActiveStreamTab] = useState("allStream");
  const [streamDetailsArr, setStreamsDetailsArr] = useState([])
  const [postCount, setPostCount] = useState({})
  const [pageCount, setPageCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (recordLoaded) stopLoader();
    else startLoader();
  }, [recordLoaded]);

  useEffect(async () => {
    setPageCount(0)
    setStreamsDetailsArr([]);
    getStreamDetails()
    const intervalID = setInterval(() => {
      setCurrentTime(moment().unix());
    }, 30000);

    return () => {
      clearInterval(intervalID);
    }
  }, [activeStreamTab]);

  const getStreamDetails = async (limit = 10, skip = 0) => {
    setIsLoading(true)
    let payload = {
      path: activeStreamTab || "allStream",
      limit: limit,
      skip: skip * limit,
      sort: "NEWEST",
    }

    if (activeStreamTab === "recordedStreams") {
      payload.streamUserId = props.userId === profileData?._id ? profileData.isometrikUserId : props?.streamUserId;
    } else {
      payload.userId = props.userId;
    }

    try {
      const res = await getProfileStream({ ...payload });
      let streamDetailsArray = activeStreamTab === "recordedStreams" ? "records" : "streams"
      if (res?.data?.[streamDetailsArray]?.length && res?.status === 200) {
        setPageCount(prev => prev + 1)
        setHasMore(true)
        if (pageCount === 0) {
          setStreamsDetailsArr(res?.data?.[streamDetailsArray]);
        } else {
          setStreamsDetailsArr(prev => [...prev, ...res?.data?.[streamDetailsArray]]);
        }
        if (activeStreamTab === "allStream") {
          setPostCount({
            totalCount: res?.data?.totalCount || 0,
            scheduledCount: res.data?.scheduledCount || 0,
            recordedCount: res.data?.recordedCount || 0,
          })
        }
      } else {
        setHasMore(false)
      }
      setIsLoading(false)
    } catch (err) {
      console.error(err, 'is the error while recorded streams got ==>');
      setHasMore(false)
      setIsLoading(false)
      setStreamsDetailsArr([]);
    } finally {
      setRecordLoaded(true);
    }
  }

  const filterList = [
    {
      title: "NEWEST",
      tab: "newest"
    },
    {
      title: "OLDEST",
      tab: "oldest"
    }
  ]

  const handleRemoveThisStream = (eventId, isRecorded = false) => {
    const filteredStreams = streamDetailsArr.filter((stream) => stream.streamId !== eventId);
    setStreamsDetailsArr(filteredStreams);
    Toast('Stream Deleted Successfully!');
  };

  const handleUnlockThisStream = (eventId) => {
    const filteredStreams = streamDetailsArr.map((stream) => {
      if (stream.eventId === eventId) {
        const modStream = { ...stream };
        modStream.alreadyPaid = true;
        return modStream;
      } else return stream;
    });
    setStreamsDetailsArr(filteredStreams);
    Toast('Stream Deleted Successfully!');
  }

  const pageContent = () => {
    return <AllStreamCards userId={props.userId} currentTime={currentTime} activeStreamTab={activeStreamTab} streamDetailsArr={streamDetailsArr} handleRemoveThisStream={handleRemoveThisStream} handleUnlockThisStream={handleUnlockThisStream} />;
  }

  return (
    <>
      <div className={`col-12 d-flex py-2 justify-content-between align-items-center ${router?.pathname === "/profile" && "px-3"} pl-md-0`}>
        <div className='d-flex gap_8 overflow-auto text-nowrap'>
          <div>
            <Button
              type="button"
              fclassname={`rounded-pill py-2 px-4 borderStroke ${activeStreamTab === "allStream" ? "btnGradient_bg" : "background_none"}`}
              onClick={() => setActiveStreamTab("allStream")}
              children={`All (${postCount?.totalCount || 0})`}
            />
          </div>
          <div>
            <Button
              type="button"
              fclassname={`rounded-pill py-2 px-4 borderStroke ${activeStreamTab === "upcomingStreams" ? "btnGradient_bg" : "background_none"}`}
              onClick={() => setActiveStreamTab("upcomingStreams")}
              children={`Upcoming (${postCount?.scheduledCount || 0})`}
            />
          </div>
          <div>
            <Button
              type="button"
              fclassname={`rounded-pill py-2 px-4 borderStroke ${activeStreamTab === "recordedStreams" ? "btnGradient_bg" : "background_none"}`}
              onClick={() => setActiveStreamTab("recordedStreams")}
              children={`Past (${postCount?.recordedCount || 0})`}
            />
          </div>
        </div>
        <div>
          <FilterOption leftFilterShow={mobileView ? false : true} filterList={filterList} />
        </div>
      </div>

      {pageContent()}

      <PaginationIndicator
        id={mobileView ? "home-page" : "profile_page_cont"}
        elementRef={props.homePageref}
        totalData={streamDetailsArr}
        pageEventHandler={() => {
          if (!isLoading && hasMore) {
            getStreamDetails(10, pageCount);
          }
        }}
      />

      <style jsx>
        {`
      :global(.Mui-selected){
        color:var(--l_base);
      }
      :global(.SimpleTabs-tabsRoot-10){
        border-bottom:1px solid black !important;
      }
      :global(.userStreamCardClass) {
        width: 100% !important;
      }
      `}
      </style>
    </>
  )
}

export default streamPostTab;
