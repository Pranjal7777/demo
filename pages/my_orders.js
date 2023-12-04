import { useState, useEffect, useRef, useCallback } from "react";
import moment from "moment";
import momentzone from "moment-timezone";
import Header from "../components/header/header"
import useLang from "../hooks/language"
import isMobile from "../hooks/isMobile"
import * as config from '../lib/config'
import SearchBar from "../containers/timeline/search-bar.jsx";
import { backNavMenu, close_drawer, startLoader, stopLoader, Toast } from "../lib/global";
import dynamic from "next/dynamic";
import { useTheme } from "react-jss";
import { useSelector, useDispatch } from "react-redux"
import { open_drawer } from "../lib/global";

import Wrapper from "../hoc/Wrapper";
import useProfileData from "../hooks/useProfileData";
import { getUserShoutoutReq } from '../services/shoutout';
import Img from '../components/ui/Img/Img';
import PaginationIndicator from "../components/pagination/paginationIndicator";
import OrderFilterMenu from '../components/Drawer/myOrder/menu_items'
import debounce from "lodash/debounce";
import { formatDate } from '../lib/date-operation/date-operation'
import Router from "next/router"
import Icon from "../components/image/icon"
import { shoutoutIncoming } from "../lib/rxSubject";
import { GREY_COLOR_2 } from "../lib/color";
import { isAgency } from "../lib/config/creds";
import { getCookie } from "../lib/session";
import { handleContextMenu } from "../lib/helper";

const FigureCloudinayImage = dynamic(() => import("../components/cloudinayImage/cloudinaryImage"), { ssr: false });
const Avatar = dynamic(() => import("@material-ui/core/Avatar"), { ssr: false });

const MySubscribers = (props) => {
  const homePageref = useRef(null);
  const theme = useTheme()
  const [mobileView] = isMobile();
  const [lang] = useLang();
  const [currProfile] = useProfileData();
  const [isFromMqtt, setIsFromMqtt] = useState(false);
  const [filterOption, setFilterOption] = useState([
    { label: "ALL", value: 5 },
    { label: "REQUESTED", value: 1 },
    { label: "ACCEPTED", value: 2 },
    { label: "COMPLETED", value: 3 },
    { label: "CANCELLED", value: 4 },
    { label: "FAILED", value: 6 },
    { label: "REJECTED", value: 7 },
  ])

  const [currentTimeStamp, setCurrentTimeStamp] = useState(moment(momentzone.tz(config.defaultTimeZone()).format('LLLL'), 'LLLL').unix());

  const [selectedFilter, setSelectedFilter] = useState("");

  const [searchValue, setSearchValue] = useState("")
  const [allShoutouts, setAllShoutouts] = useState([])
  const [pageCount, setPageCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPostCount, setTotalPostCount] = useState(0);
  const [isFilteredAPI, setIsFilteredAPI] = useState(false);
  const [isUpdate, setUpdate] = useState(false)
  const [isOrderUpdated, setIsOrderUpdated] = useState(false)
  const profile = props.profile;
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  let webSearchFollowObj = {
    padding: "0 0 0 50px",
    background: theme.type == "light" ? "#f1f2f6" : "#32344a",
    border: "none",
    borderRadius: "20px",
    height: "44px",
    fontSize: "16px",
    fontFamily: `"Roboto", sans-serif !important`,
    color: theme.text,
  }

  useEffect(() => {
    startLoader()
    getShoutoutData()
    !mobileView && Router.push("/my-orders")
  }, [])


  const handleOrderUpdated = (boolValue = true) => {
    getShoutoutData(0, false, "", boolValue)
  }


  useEffect(() => {
    if (selectedFilter.length >= 1) {
      selectedFilter == "ALL" ? getShoutoutData(0, isFilteredAPI, searchValue) : getShoutoutData(0, isFilteredAPI, searchValue);
    }
  }, [selectedFilter])

  useEffect(() => {
    searchValue.length == 0 && setSelectedFilter("");
    getUserSugge(searchValue)
  }, [searchValue])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTimeStamp(moment(momentzone.tz(config.defaultTimeZone()).format('LLLL'), 'LLLL').unix());
    }, 30000);

    return () => {
      clearInterval(intervalId);
    }
  }, []);

  const getUserSugge = useCallback(
    debounce((value) => {
      getShoutoutData(0, isFilteredAPI, value, false)
    }, 400),
    [] // will be created only once initially
  );

  const getShoutoutData = async (page = 0, isFiltered = false, searchString = "", boolValue = false, isForMqtt = false) => {
    startLoader();
    try {
      let slug = {
        limit,
        offset: page * limit,
        trigger: "MY_ORDERS",
        status: selectedFilter == "ALL" ? "" : selectedFilter,
        searchText: searchString
      }
      if (isAgency()) {
        slug["userId"] = selectedCreatorId;
      }
      const res = await getUserShoutoutReq(slug) || [];

      if (res.status === 200) {
        if (isForMqtt) {
          setAllShoutouts([...res?.data?.data])
        }
        if (searchValue) {
          setAllShoutouts([...res?.data?.data])
        } else {
          isForMqtt == false && boolValue ? setAllShoutouts([...res?.data?.data]) : setAllShoutouts([...allShoutouts, ...res?.data?.data]);
        }
        setTotalPostCount(res?.data?.data?.length);
        stopLoader();
        setPageCount(page);
        setIsLoading(false);
      }
      else {
        stopLoader();
      }
    } catch (err) {
      stopLoader();
      setIsLoading(false);
    }
  }

  const handleSelectedFilter = (value) => {
    selectedFilter !== value.label && setAllShoutouts([]);
    setPageCount(0)
    setIsFilteredAPI(true)
    setSelectedFilter(value.label)
  }

  const handleSearchResult = (e) => {
    setAllShoutouts([])
    setSearchValue(e.target.value)
  }

  const timeDifferenceCalc = (bigTimeStamp, smallTimeStamp) => {
    const differenceSeconds = bigTimeStamp - smallTimeStamp;
    const daydiff = ~~((differenceSeconds / 3600) / 24);
    const hrsdiff = ~~((differenceSeconds % 86400) / 3600);
    const minutesDiff = ~~((differenceSeconds % 3600) / 60);
    let str = '';
    if (daydiff > 0) str += `${daydiff} D `;
    if (hrsdiff > 0) str += `${hrsdiff} HR `;
    if (minutesDiff > 0) str += `${minutesDiff} MIN${minutesDiff > 1 ? '' : 's'}`;
    if (!str) str += 'Few Seconds'
    return str;
  }

  const durationRemaining = (request) => {
    const endTimeStamp = moment(momentzone.unix(request.scheduleData.endTs).tz(config.defaultTimeZone()).format('LLLL'), 'LLLL').unix();
    if (endTimeStamp < currentTimeStamp) {
      return lang.done;
    } else {
      const startTmeStamp = moment(momentzone.unix(request.scheduleData.startTs).tz(config.defaultTimeZone()).format('LLLL'), 'LLLL').unix();
      return timeDifferenceCalc(startTmeStamp, currentTimeStamp);
    }
  }


  shoutoutIncoming.subscribe((data) => {
    if (data.status === 'REQUESTED') {
      // getShoutoutData(0,false,"",false,true)
      return;
    }
    const allShoutoutsDatas = [...allShoutouts]
    const index = allShoutoutsDatas.findIndex((list) => list.orderId === data.shoutoutOrderId)
    if (index >= 0) {
      allShoutoutsDatas[index] = {
        ...allShoutoutsDatas[index],
        status: data.status
      }
      setIsFromMqtt(true)
      setAllShoutouts(allShoutoutsDatas);
    }
  });

  return (
    <Wrapper>
      {mobileView ? (
        <>
          <div style={{ height: "100vh", overflowY: "auto" }} ref={homePageref} id="home-page">
            <Header
              title={lang.orders}
              back={() => {
                close_drawer();
                Router.push("/")
              }}
              icon={config.backArrow}
            />
            <div style={{ paddingTop: "59px" }}>
              <div className='d-flex pt-3'>
                <div className="col px-0">
                  {<SearchBar
                    value={searchValue}
                    paddingStyle={true}
                    webSearchFollowObj={webSearchFollowObj}
                    handleSearch={(e) => handleSearchResult(e)}
                    onlySearch={true}
                  />}
                </div>
                <div className='position-relative col-auto pl-0' >
                  <div className="filterCss">
                    <OrderFilterMenu filterOption={filterOption} handleSelectedFilter={handleSelectedFilter} selectedFilter={selectedFilter} />
                  </div>
                </div>
              </div>

              {
                allShoutouts && allShoutouts.length > 0 ? allShoutouts.map((request) => (
                  <div
                    key={request.orderId}
                    className="p-2 d-flex flex-column justify-content-center"
                    onClick={() =>
                      open_drawer(
                        "Order",
                        {
                          profile: currProfile,
                          requestData: request,
                          isUpdate: isUpdate,
                          setUpdate: setUpdate,
                          isPurchasePage: false,
                          getShoutoutData: getShoutoutData,
                          handleOrderUpdated: handleOrderUpdated
                        },
                        "right"
                      )
                    }
                  >
                    <div className="overflow-hidden position-relative w-100 sidebar_bg radius_8">
                      {!request?.isViewed && <div className="notification-dot"></div>}
                      <div
                        className="py-1 row m-0 px-3">
                        <div className="col-10 px-0 py-1 m-0">
                          <h6 className="m-0">#{request.orderId}</h6>
                          <p className="m-0 fntSz12 light_app_text">{formatDate(request.createdDate, "D MMM YYYY h:mm a")}</p>
                        </div>
                        <div className="col-2 text-right m-auto m-0 p-0">
                          <Icon
                            icon={`${config.rightOrderArrow}#rightOrderArrow`}
                            color={theme?.text}
                            size={14}
                            viewBox="0 0 5.992 10.332"
                            alt="Arrow Primary"
                          />
                        </div>
                      </div>
                      <div className='d-flex align-items-center justify-content-between flex-nowrap py-2 px-3 row mx-0'>
                        <div className='d-flex align-items-center col-10 px-0 overflowX-hidden'>
                          <div className='callout-none' onContextMenu={handleContextMenu} >
                            {request?.opponentUser?.profilePic ? (
                              <FigureCloudinayImage
                                publicId={request.opponentUser.profilePic}
                                width={30}
                                ratio={1}
                                crop="thumb"
                                className="shoutoutImg mb-1"
                              />
                            ) : (
                              <Avatar className="profile_shoutout_order mb-1" >
                                {request.opponentUser && request.opponentUser.firstName && request.opponentUser.lastName && (
                                  <span className="initials_order">
                                    {request.opponentUser.firstName[0] + request.opponentUser.lastName[0]}
                                  </span>
                                )}
                              </Avatar>
                            )}
                          </div>
                          <div className='d-flex flex-column justify-content-center' style={{ padding: `${request?.opponentUser?.profilePic ? "5px 32px" : "5px 10px"} ` }}>
                            <p className='pb-1 m-0 userNameLabel' style={{ fontSize: '4.2vw', fontWeight: '700', textTransform: 'capitalize' }}>{request?.opponentUser?.username}</p>
                            <span style={{ fontSize: '3vw', fontWeight: '600', marginTop: '-3px', textTransform: 'capitalize', color: `${request?.status === 'COMPLETED' ? '#09CC4D' : ["CANCELLED", "REJECTED", "FAILED"].includes(request?.status) ? '#EC1818' : '#4918ec'}` }}>{request.status}</span>
                            {request?.orderType === "VIDEO_CALL" && ["REQUESTED", "ACCEPTED"].includes(request.status) && <div className="font-weight-700 pr-0 fntSz12 text-uppercase mt-1"
                              style={{ color: theme.shoutout_success }}
                            >
                              {durationRemaining(request)}
                            </div>}
                          </div>
                        </div>
                        <div className="mr-0 col-auto px-0" style={{ marginRight: '2vw' }}>
                          {request?.orderType === "VIDEO_CALL" ? (
                            <Icon
                              icon={`${config.videoOrderIcon}#shoutvideoSVG`}
                              color={theme.appColor}
                              alt="No Like Post Placeholder SVG Image"
                              size={37}
                              viewBox="0 0 24 24"
                            />
                          ) : (
                            <Img src={config.SPEAKER_ICONS} alt='speaker icons' style={{ width: '43px' }} />
                          )}
                        </div>
                      </div>
                      {/* {request?.orderType === "VIDEO_CALL"  && (
                            <div className="col-12">
                              <div className="fntSz14 pageBlackTextCss d-flex">
                                <span
                                  style={{ color: `${theme?.text}` }}
                                  className="fntWeight600 text-uppercase"
                                >
                                  {lang.videoCall}
                                </span>
                                  <span className="ml-auto fntWeight600 text-capitalize">
                                    {moment(request?.scheduleData?.scheduleDate, 'YYYY-DD-MM').format('on: Do MMMM YYYY')}
                                  </span>
                              </div>
                            </div>
                        )} */}
                      {["VIDEO_CALL", "VIDEO_SHOUTOUT"].includes(request?.orderType) && (["CANCELLED", "FAILED"].includes(request.status) || request?.isRefunded) && <div className="col-12 d-flex py-2 align-items-center justify-content-start borderTop"
                      >
                        {/* <div className="col-auto px-0">
                            <Img src={config.userIconSvg} width={20} height={20} className="mb-1" />
                            </div>
                            <div className="col px-1 fntSz14">
                            <span style={{color : `${GREY_COLOR_2}`}}>For</span> <span className="pl-1 font-weight-500">{request?.opponentUser?.firstName} {request?.opponentUser?.lastName}</span>
                          </div> */}
                        {<p className="batchleval fntSz12 txt-heavy font-weight-700 my-1">MONEY REFUNDED BACK TO USER</p>}
                      </div>}
                      {/* { request?.orderType === "VIDEO_CALL" &&  ["CANCELLED","REJECTED","FAILED"].includes(request.status)? <div className=" moneyrefunded d-flex justify-content-end " >
                                                       </div>:""}  */}
                    </div>
                  </div>
                )) :

                  <div className="col-12 d-flex flex-column justify-content-center noPostCss fntSz16 shoutoutCommonTextCss" style={{ fontWeight: "400" }}>
                    <Icon
                      icon={`${config.NO_ORDER_PLACEHOLDER_MOBILE}#noOrderFound`}
                      color={theme?.text}
                      size={130}
                      viewBox="0 0 74.986 92.695"
                      alt="no order placeholder"
                    />
                    <p className="mt-2">{lang.noOrder}</p>
                  </div>
              }
            </div>
          </div>
          {allShoutouts && allShoutouts.length ? (
            <PaginationIndicator
              id="home-page"
              elementRef={homePageref}
              totalData={allShoutouts}
              totalCount={allShoutouts.length || 500}
              pageEventHandler={() => {
                if (!isLoading && totalPostCount) {
                  getShoutoutData(pageCount + 1, isFilteredAPI, searchValue);
                }
              }}
            />
          ) : (
            ""
          )}
        </>
      ) : (<></>)
      }

      {/* {
        showLoader ? (<>
          <div className="d-flex align-items-center justify-content-center h-100 profileSectionLoader">
            <CustomDataLoader type="ClipLoader" loading={showLoader} size={60} />
          </div>
        </>) : <></>
      } */}


      <style jsx>{`
      .shoutoutImg{
          width: 53px !important;
          height: 53px !important;
          border-radius: 50% !important;
          object-fit: cover;
          background-color: #fff !important;
        }

        .notification-dot {
          width: 10px;
          height: 10px;
          background-color: var(--l_base);
          border-radius: 50%;
          display: inline-block;
          position: absolute;
          right: 0rem;
        }

        .initials_order {
          font-size: 20px;
          color: ${theme.type == "light" ? "var(--l_base)" : theme?.appColor} !important;
          letter-spacing: 1px;
          font-weight: bold;
          text-transform: uppercase;
        }

      .mv_profile_logo_requestShoutout {
          width: 29px !important;
          height: 29px !important;
          border-radius: 50% !important;
          object-fit: cover;
          background-color: #fff !important;
        }

      .filterCss{
          background: var(--l_sidebar_bg);
          border-radius: 50%;
          padding: 9px;
        }

      .noPostCss{
        font-weight: 600;
        height: calc(100vh - 150px);
        align-items: center;
      }
      .shoutoutCommonTextCss{
        color : ${theme.type == "light" ? "#0D0D0D" : theme?.text}
      }
      .dateLabelCss{
        color: ${theme.type == "light" ? "#141414" : theme.text}
      }
      .userNameLabel{
        color : ${theme.type == "light" ? "#141414" : theme?.text}
      }
      :global(.profile_shoutout_order){
            width: 50px !important;
            height: 50px !important;
            border-radius: 50% !important;
            object-fit: cover;
            background-color: ${theme.type == "light" ? "#eef0f8" : "var(--l_app_bg)"} !important;
          }
          .moneyrefunded{
            border-top: 1px solid gray !important;
          }
          .batchleval{
            color:#E86969!important;
            // background: #FDDADA;
            // border: 1px solid #E86969!important;
          }
      `}</style>
    </Wrapper>
  )
}

export default MySubscribers;