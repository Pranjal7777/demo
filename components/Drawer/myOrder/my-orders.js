import { useState, useEffect, useRef, useCallback } from "react"
import Header from "../../header/header"
import useLang from "../../../hooks/language"
import isMobile from "../../../hooks/isMobile"
import * as config from '../../../lib/config'
import SearchBar from "../../../containers/timeline/search-bar.jsx";
import { backNavMenu, close_drawer, startLoader, stopLoader, Toast } from "../../../lib/global";
import dynamic from "next/dynamic";
import { useTheme } from "react-jss";
import { useSelector, useDispatch } from "react-redux"
import { open_drawer } from "../../../lib/global";

import Wrapper from "../../../hoc/Wrapper";
import CustomDataLoader from "../../loader/custom-data-loading";
import useProfileData from "../../../hooks/useProfileData";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { getUserShoutoutReq } from '../../../services/shoutout';
import Img from '../../ui/Img/Img';
import PaginationIndicator from "../../pagination/paginationIndicator";
import OrderFilterMenu from '../../../components/Drawer/myOrder/menu_items'
import debounce from "lodash/debounce";
import { formatDate } from '../../../lib/date-operation/date-operation'
import Placeholder from "../../../containers/profile/placeholder";
import Router from "next/router"
import Icon from "../../image/icon"
import { isAgency } from "../../../lib/config/creds"
import { getCookie } from "../../../lib/session"
import { handleContextMenu } from "../../../lib/helper"

const FigureCloudinayImage = dynamic(() => import("../../cloudinayImage/cloudinaryImage"), { ssr: false });
const Avatar = dynamic(() => import("@material-ui/core/Avatar"), { ssr: false });

const MySubscribers = (props) => {
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
  ])

  const [selectedFilter, setSelectedFilter] = useState("");

  const [searchValue, setSearchValue] = useState("")
  const [selectionRange, setSelectRange] = useState({
    value: 0,
    label: "All Status",
  })
  const [showLoader, setShowLoader] = useState(false)
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

  useEffect(() => {
    startLoader()
    getShoutoutData()
  }, [])


  const handleOrderUpdated = () => {
    getShoutoutData()
  }


  useEffect(() => {
    if (selectedFilter.length >= 1) {
      selectedFilter == "ALL" ? getShoutoutData(0, isFilteredAPI, searchValue) : getShoutoutData(0, isFilteredAPI, searchValue);
    }
  }, [selectedFilter])

  useEffect(() => {
    searchValue.length == 0 && setSelectedFilter("");
    searchValue && getUserSugge(searchValue)
  }, [searchValue])

  const getUserSugge = useCallback(
    debounce((value) => {
      getShoutoutData(0, isFilteredAPI, value)
    }, 600),
    [] // will be created only once initially
  );

  const getShoutoutData = async (page = 0, isFiltered = false, searchString = "") => {
    startLoader();
    try {
      let slug = {
        limit,
        offset: page * limit,
        trigger: "MY_ORDERS",
        status: selectedFilter == "ALL" ? "" : selectedFilter,
        searchText: searchString,
      }
      if (isAgency()) {
        slug["userId"] = selectedCreatorId;
      }
      const res = await getUserShoutoutReq(slug) || [];

      if (res.status === 200) {
        if (searchValue) {
          setAllShoutouts([...res?.data?.data])
        } else {
          setAllShoutouts([...allShoutouts, ...res?.data?.data]);
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


  return (
    <Wrapper>
      {mobileView ? (
        <>
          <div style={{ height: "100vh", overflowY: "auto" }} ref={homePageref} id="home-page">

            <Header
              title={lang.myOrder}
              back={() => {
                close_drawer();
                Router.back()
              }}
              icon={config.backArrow}
            />
            <div style={{ paddingTop: "80px", background: `${theme?.background}` }}>
              <div className='d-flex' style={{ background: `${theme?.background}` }}>
                <div className="col px-0">
                  {<SearchBar
                    value={searchValue}
                    onlySearch
                    paddingStyle={true}
                    handleSearch={(e) => handleSearchResult(e.target.value)}
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
                    className="d-flex flex-column justify-content-center"
                  >
                    <div
                      className="py-1 row m-0 text-dark"
                      style={{
                        backgroundColor: theme.sectionBackground,
                        width: '100%'
                      }}
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
                      <div className="col-10 px-3 py-1 m-0">
                        <p className="m-0 bold fntSz14 shoutoutCommonTextCss" style={{ color: `${theme?.text}` }}>#{request.orderId}</p>
                        <p className="m-0 fntSz12 shoutoutCommonTextCss">{formatDate(request.createdDate, "D MMM YYYY h:mm a")}</p>
                      </div>
                      <div className="col-2 text-center m-auto m-0 p-0">
                        <Icon
                          icon={`${config.DOWN_ARROW_PRIMARY}#rightChevronArrow`}
                          color={theme?.appColor}
                          size={14}
                          viewBox="0 0 7.423 13.007"
                          alt="Arrow Primary"
                        />
                      </div>
                    </div>
                    <div className='d-flex align-items-center justify-content-between py-2 px-3 flex-nowrap row mx-0' style={{ background: `${theme?.background}` }}>
                      <div className='d-flex align-items-center col-10 px-0 overflow-hidden'>
                        <div className='callout-none' onContextMenu={handleContextMenu} >
                          {request?.opponentUser?.profilePic ? (
                            <FigureCloudinayImage
                              publicId={request.opponentUser.profilePic}
                              width={30}
                              ratio={1}
                              className="shoutoutImg mb-1"
                            />
                          ) : (
                            <Avatar className="mv_profile_logo_requestShoutout_order mb-1  solid_circle_border">
                              {request.opponentUser && request.opponentUser.firstName && request.opponentUser.lastName && (
                                <span className="initials_order">
                                  {request.opponentUser.firstName[0] + request.opponentUser.lastName[0]}
                                </span>
                              )}
                            </Avatar>
                          )}
                        </div>
                        <div className='d-flex flex-column justify-content-center' style={{ padding: `${request?.opponentUser?.profilePic ? "5px 32px" : "5px 10px"} ` }}>
                          <p className='pb-1 m-0 shoutoutCommonTextCss' style={{ fontSize: '4.2vw', fontWeight: '700', textTransform: 'capitalize' }}>{request?.opponentUser?.firstName} {request?.opponentUser?.lastName}</p>
                          <span style={{ fontSize: '3vw', fontWeight: '600', marginTop: '-3px', textTransform: 'capitalize', color: `${request?.status === 'COMPLETED' ? '#09CC4D' : ["CANCELLED", "REJECTED", "FAILED"].includes(request?.status) ? '#EC1818' : '#4918ec'}` }}>{request.status}</span>
                        </div>
                      </div>
                      <div className="mr-0 col-auto px-0" style={{ marginRight: '2vw' }}>
                        <Img src={config.SPEAKER_ICONS} alt='speaker icons' style={{ width: '43px' }} />
                      </div>
                    </div>
                  </div>
                )) :

                  <div className="col-12 d-flex justify-content-center fntSz25 noPostCss shoutoutCommonTextCss" style={{ fontWeight: "600" }}>
                    <Placeholder
                      style={{ height: "20%" }}
                      pageName="orderList"
                      placeholderImage={config.NO_ORDER_PLACEHOLDER}
                      label={lang.noOrderFound}
                    />
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

      <style jsx>{`
      .shoutoutImg{
          width: 53px !important;
          height: 53px !important;
          border-radius: 50% !important;
          object-fit: cover;
          background-color: #fff !important;
        }
        .initials_order {
          font-size: 20px;
          color: ${theme?.appColor};
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
          background: ${theme.type == "light" ? "#f1f2f6" : "#32344a"};
          border-radius: 50%;
          padding: 9px;
        }
      .noPostCss{
        font-weight: 600;
        height: calc(100vh - 150px);
        align-items: center;
      }
      .shoutoutCommonTextCss{
        color : ${theme?.text}
      }
      :global(.MuiAvatar-root){
        width: 50px;
        height: 50px;
      }
      `}</style>
    </Wrapper>
  )
}

export default MySubscribers;