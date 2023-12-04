import { useState, useEffect, useRef, useCallback } from "react"
import moment from "moment";
import momentzone from "moment-timezone";
import Header from "../components/header/header"
import useLang from "../hooks/language"
import isMobile from "../hooks/isMobile"
import debounce from "lodash/debounce";
import { defaultTimeZone, NO_ORDER_PLACEHOLDER, ratingIcon, rightOrderArrow, SPEAKER_ICONS, videoOrderIcon } from '../lib/config'
import SearchBar from "../containers/timeline/search-bar";
import dynamic from "next/dynamic";
import { useTheme } from "react-jss";
import { useSelector } from "react-redux"
import { open_drawer } from "../lib/global";

import Wrapper from "../hoc/Wrapper";
import useProfileData from "../hooks/useProfileData";
import { getUserShoutoutReq } from '../services/shoutout';
import Img from '../components/ui/Img/Img';
import Router from "next/router";
import PaginationIndicator from "../components/pagination/paginationIndicator";
import PurchaseFilterMenu from '../components/Drawer/myOrder/menu_items'
import { formatDate } from "../lib/date-operation/date-operation";
import Placeholder from "../containers/profile/placeholder";
import Icon from "../components/image/icon";
import { isAgency } from "../lib/config/creds";
import { getCookie } from "../lib/session";
import { handleContextMenu } from "../lib/helper";
import CustomDataLoader from "../components/loader/custom-data-loading";
import RouterContext from "../context/RouterContext";
const FigureCloudinayImage = dynamic(() => import("../components/cloudinayImage/cloudinaryImage"), { ssr: false });
const Avatar = dynamic(() => import("@material-ui/core/Avatar"), { ssr: false });

const MyPurchasePage = (props) => {
  const homePageref = useRef(null);
  const theme = useTheme()
  const [mobileView] = isMobile();
  const [lang] = useLang();
  const [currProfile] = useProfileData();
  const [filterOption, setFilterOption] = useState([
    { label: "ALL", value: 5 },
    { label: "REQUESTED", value: 1 },
    { label: "ACCEPTED", value: 2 },
    { label: "COMPLETED", value: 3 },
    { label: "CANCELLED", value: 4 },
    { label: "FAILED", value: 6 },
    { label: "REJECTED", value: 7 },
  ])

  const [currentTimeStamp, setCurrentTimeStamp] = useState(moment(momentzone.tz(defaultTimeZone()).format('LLLL'), 'LLLL').unix());

  const [selectedFilter, setSelectedFilter] = useState("");

  const [searchValue, setSearchValue] = useState("")
  const [allShoutouts, setAllShoutouts] = useState([])
  const [pageCount, setPageCount] = useState(0);
  const [limit, setLimit] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPostCount, setTotalPostCount] = useState(0);
  const [isUpdate, setUpdate] = useState(false)
  const [isFilteredAPI, setIsFilteredAPI] = useState(false);
  const profile = props.profile;
  const [isOrderUpdated, setIsOrderUpdated] = useState(false)
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

    getShoutoutData();
  }, [isUpdate])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTimeStamp(moment(momentzone.tz(defaultTimeZone()).format('LLLL'), 'LLLL').unix());
    }, 30000);

    return () => {
      clearInterval(intervalId);
    }
  }, []);


  useEffect(() => {
    if (isOrderUpdated) {
      getShoutoutData();
    }
  }, [isOrderUpdated])

  const handleOrderUpdated = (boolValue = true) => {
    setAllShoutouts([]);
    setIsOrderUpdated(boolValue)
  }

  useEffect(() => {
    if (selectedFilter.length >= 1) {
      getShoutoutData(0, isFilteredAPI, searchValue);
    }
  }, [selectedFilter])

  useEffect(() => {
    searchValue.length == 0 && setSelectedFilter("");
    if (searchValue?.length) {
      getUserSugge(searchValue)
    }
  }, [searchValue])

  const getUserSugge = useCallback(
    debounce((value) => {
      getShoutoutData(0, isFilteredAPI, value)
    }, 600),
    [] // will be created only once initially
  );

  const handleSelectedFilter = (value) => {
    setPageCount(0)
    setIsFilteredAPI(true)
    selectedFilter !== value.label && setAllShoutouts([]);
    setSelectedFilter(value.label)
  }

  const getShoutoutData = async (page = 0, isFiltered = false, searchString = "", isRated = false) => {
    setIsLoading(true)
    try {
      let slug = {
        limit,
        offset: page * limit,
        trigger: "MY_PURCHASES",
        status: selectedFilter == "ALL" ? "" : selectedFilter,
        searchText: searchString,
        userId: isAgency() ? selectedCreatorId : getCookie("uid"),
      }
      const res = await getUserShoutoutReq(slug) || [];
      if (res.status === 200) {
        if (searchValue) {
          setAllShoutouts([...allShoutouts, ...res?.data?.data]);
        } else {
          isRated ? setAllShoutouts([...res?.data?.data]) : setAllShoutouts([...allShoutouts, ...res?.data?.data]);
        }
        setTotalPostCount(res?.data?.data?.length);
        setPageCount(page);
      }
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      console.error("ERROR IN getShoutoutData", err);
    }
  }

  const handleSearchResult = (e) => {
    setAllShoutouts([])
    setSearchValue(e.target.value)
  }

  const profileClickHandler = (users) => {
    Router.push(
      `${users}`
    );
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
    const endTimeStamp = moment(momentzone.unix(request.scheduleData.endTs).tz(defaultTimeZone()).format('LLLL'), 'LLLL').unix();
    if (endTimeStamp < currentTimeStamp) {
      return lang.done;
    } else {
      const startTmeStamp = moment(momentzone.unix(request.scheduleData.startTs).tz(defaultTimeZone()).format('LLLL'), 'LLLL').unix();
      return timeDifferenceCalc(startTmeStamp, currentTimeStamp);
    }
  }


  return (
    <RouterContext forLogin={true} forUser={true} forCreator={false} forAgency={false} {...props}>
      <Wrapper>
        {mobileView ? (
          <>
            <div style={{ height: "calc(var(--vhCustom, 1vh) * 100)", overflowY: "auto" }} ref={homePageref} id="home-page2">
              <Header
                title={lang.myPurchases}
                back={() => {
                  Router.push('/')
                }}
              />
              <div style={{ marginTop: "59px", background: `${theme?.background}` }}>
                <div className='d-flex pt-3'>
                  <div className="col px-0">
                    {<SearchBar
                      value={searchValue}
                      webSearchFollowObj={webSearchFollowObj}
                      onlySearch={true}
                      handleSearch={(e) => handleSearchResult(e)}
                    />}
                  </div>
                  <div className='position-relative col-auto pl-0' >
                    <div className="filterCss text-app">
                      <PurchaseFilterMenu filterOption={filterOption} handleSelectedFilter={handleSelectedFilter} selectedFilter={selectedFilter} />
                    </div>
                  </div>
                </div>

                {
                  allShoutouts && allShoutouts.length > 0 ? allShoutouts.map((request) => (
                    <div
                      key={request.orderId}
                      className="d-flex flex-column justify-content-center"
                      onClick={() =>
                        open_drawer(
                          "Order",
                          {
                            profile: currProfile,
                            requestData: request,
                            isUpdate: isUpdate,
                            setUpdate: setUpdate,
                            isPurchasePage: true,
                            handleOrderUpdated: handleOrderUpdated,
                            getShoutoutData: getShoutoutData
                          },
                          "right"
                        )
                      }
                    >
                      <div
                        className="py-1 row m-0 text-dark"
                        style={{
                          backgroundColor: theme.shoutout_mobile_sell,
                          width: '100%'
                        }}
                      >
                        <div className="col px-3 py-1 m-0">
                          <p className="m-0 font-weight-700 fntSz16  shoutoutCommonTextCss">#{request.orderId}</p>
                          <p className="m-0 fntSz12 dateLabelCss">{formatDate(request.createdDate, "D MMM YYYY h:mm a")} </p>
                        </div>
                        <div>
                          {request?.rating && request?.status === 'COMPLETED' && <div className="d-flex flex-column justify-content-end pl-3">
                            <div className="col-auto d-flex align-items-center pr-0 statusInfo">
                              <Icon
                                icon={`${ratingIcon}#ratingIcon`}
                                width={15}
                                height={15}
                                style={{ marginBottom: "4px" }}
                                unit="px"
                                viewBox="0 0 21.491 20.439"
                              />
                              <p className="m-0 fntSz14 font-weight-500 appTextColor">{request?.rating}</p>
                            </div>
                            <p className="m-0 fntSz12" style={{ color: "var(--l_breadcrum_deactive)" }}>{lang.youRated}</p>
                          </div>}
                        </div>
                        <div className="col-2 text-right m-auto m-0 p-0">
                          <Icon
                            icon={`${rightOrderArrow}#rightOrderArrow`}
                            color={theme?.text}
                            size={14}
                            viewBox="0 0 5.992 10.332"
                            alt="Arrow Primary"
                            class="col-auto"
                          />
                        </div>
                      </div>
                      <div className='d-flex text-app align-items-center justify-content-between p-2 px-3 order_purchase_border'>
                        <div className='d-flex align-items-center'>
                          <div className="callout-none" onContextMenu={handleContextMenu} >
                            {request?.opponentUser?.profilePic ? (
                              <FigureCloudinayImage
                                publicId={`${request?.opponentUser?.profilePic}`}
                                ratio={1}
                                className="shoutoutImg mb-1"
                              />
                            ) : (
                              <Avatar className="mv_profile_logo_requestShoutout mb-1  solid_circle_border">
                                {request.opponentUser && request?.opponentUser?.firstName && request?.opponentUser?.lastName && (
                                  <span className="initials_order">
                                    {request?.opponentUser?.firstName[0] + request?.opponentUser?.lastName[0]}
                                  </span>
                                )}
                              </Avatar>
                            )}
                          </div>
                          <div className='d-flex flex-column col justify-content-center ' style={{ padding: "5px 15px" }}>
                            <p className='pb-1 m-0' style={{ fontSize: '4vw', fontWeight: '700', textTransform: 'capitalize' }}>{request?.opponentUser?.username}</p>
                            <span className="font-weight-700" style={{ fontSize: '3vw', marginTop: '-3px', textTransform: 'capitalize', color: `${request?.status === 'COMPLETED' ? (request?.isRefunded ? '#EC1818' : ' #09CC4D') : (["REJECTED", "CANCELLED", "FAILED"].includes(request?.status)) ? '#EC1818' : '#4918ec'}` }}>{request.status}</span>
                          </div>
                        </div>
                        {/* <div style={{ marginRight: '3vw' }}> */}
                        {request?.orderType === "VIDEO_CALL" ? (
                          <Img src={videoOrderIcon} alt='speaker icons' style={{ width: '45px' }} />
                        ) : (
                          <Img src={SPEAKER_ICONS} alt='speaker icons' style={{ width: '45px' }} />
                        )}
                        {/* </div> */}
                      </div>
                      <div className="col-12 d-flex py-2 align-items-center">
                        <div className="col-auto px-0">
                          {/* <Img src={userIconSvg} width={20} height={20} className="mb-1" /> */}
                        </div>
                        <div className="col px-1 fntSz14">
                          {/* <span style={{color : `${GREY_COLOR_2}`}}>For</span> <span style={{fontWeight : "500"}}>{request?.orderType === "VIDEO_CALL" ? request?.opponentUser?.username : request?.requestedFor?.fullName}</span> */}
                        </div>
                        {request?.orderType === "VIDEO_CALL" && ["REQUESTED", "ACCEPTED", "COMPLETED", "JOIN"].includes(request.status) ? request?.isRefunded ? "" : <div className="col-auto font-weight-700 pr-0 fntSz12 text-uppercase"
                          style={{ color: theme.shoutout_success }}
                        >
                          {durationRemaining(request)}
                        </div> : ""}
                        {request?.orderType === "VIDEO_CALL" && (["CANCELLED", "FAILED", "REJECTED"].includes(request.status) || request?.isRefunded) && <div className="batchlevalgreen rounded-pill py-1 px-3 fntSz13 txt-heavy   font-weight-700">{request?.price?.currencySymbol || "$"}{request?.price?.price + request?.tax} REFUNDED</div>}
                      </div>

                      {/* video label and time */}
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

                    </div>
                  )) :
                    !isLoading ?
                      <div className="col-12 d-flex justify-content-center noPostCss fntSz25 shoutoutCommonTextCss" style={{ fontWeight: "600" }}>
                        <Placeholder
                          style={{ height: "20%" }}
                          pageName="orderList"
                          placeholderImage={NO_ORDER_PLACEHOLDER}
                          label={lang.noOrderFound}
                        />
                      </div> : ""
                }
                {
                  isLoading ? (<>
                    <div className="d-flex align-items-center justify-content-center">
                      <CustomDataLoader loading={isLoading} />
                    </div>
                  </>) : <></>
                }
              </div>
              <PaginationIndicator
                elementRef={homePageref}
                id="home-page2"
                totalData={allShoutouts}
                totalCount={allShoutouts.length || 500}
                pageEventHandler={() => {
                  if (!isLoading && totalPostCount) {
                    getShoutoutData(pageCount + 1, isFilteredAPI, searchValue);
                  }
                }}
              />
            </div>
          </>
        ) : (<></>)
        }


        <style jsx>{`
        .shoutoutImg{
          width: 53px !important;
          height: 53px !important;
          border-radius: 50% !important;
          object-fit: cover;
          background-color: #fff !important;
        }

        .initials_order {
          font-size: 7px;
          color: var(--l_base);
          letter-spacing: 1px;
          font-weight: bold;
          text-transform: uppercase;
        }

        .mv_profile_logo_requestShoutout {
            width: 17px !important;
            height: 17px !important;
            border-radius: 50% !important;
            object-fit: cover;
            background-color: #fff !important;
          }

        .filterCss{
          background: ${theme.type == "light" ? "#f1f2f6" : "#32344a"};
          border-radius: 50%;
          padding: 9px;
        }

        .noPostCss{
        font-weight: 600;
        height: calc(100vh - 150px);
        align-items: center;
      }
      .order_purchase_border{
        border-bottom: 1px solid var(--l_border_chat);
      }

      .shoutoutCommonTextCss{
        color : ${theme.type == "light" ? "#1b1b1b" : theme?.text}
      }
      .dateLabelCss{
        color: ${theme.type == "light" ? "#37383a" : theme.text}
      }
      :global(.MuiAvatar-root){
        width: 50px;
        height: 50px;
      }
      .batchleval{
        color:#E86969!important;
        background: #FDDADA;
        border: 1px solid #E86969!important;
      }
      .batchlevalgreen{
        color:#1EC85F!important;
        background:  #EBFFF3;
        border: 1px solid #1EC85F!important;
      }
    `}</style>
      </Wrapper>
    </RouterContext>
  )
}


export default MyPurchasePage
