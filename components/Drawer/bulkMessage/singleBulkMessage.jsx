import { useTheme } from "react-jss";
import { Avatar } from "@material-ui/core";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Route from "next/router";
import find from "lodash/find";
import { useSelector } from "react-redux";

import isMobile from "../../../hooks/isMobile";
import useLang from "../../../hooks/language";
import { EMPTY_PROFILE, EYE, NO_USER_DATA, DOLLAR_BULK_MESSAGE, downArrowIcons, Creator_Icon, FOLLOW_FOLLOWING, videoPlay_icon, SIDEBAR_SEARCH, defaultCurrency, NO_BULK_ICON } from "../../../lib/config";
import FigureCloudinayImage from "../../cloudinayImage/cloudinaryImage";
import Img from "../../../components/ui/Img/Img";
import { open_drawer, open_post_dialog, startLoader, stopLoader, Toast } from "../../../lib/global";
import { getBulkMessageReadList, getDetailedBulkMessage, unsendBulkMsg } from "../../../services/bulkMessage";
import TextPost from "../../TextPost/textPost";
import { getCookie } from "../../../lib/session";
import Icon from "../../image/icon";
import CustomDataLoader from "../../loader/custom-data-loading";
import PaginationIndicator from "../../pagination/paginationIndicator";
import { s3ImageLinkGen } from "../../../lib/UploadAWS/uploadAWS";
import Image from "../../image/image";
import { CHAT_EYE, PURCHASED_ICON, UNLOCK_ICON, USER_LIST_AVATAR } from "../../../lib/config/logo";
import Header from "../../header/header";
import { backArrow } from "../../../lib/config/homepage";
import ShowMore from "../../show-more-text/ShowMoreText";
import Button from "../../button/button";
import { formatDate } from "../../../lib/date-operation/date-operation";
import { CoinPrice } from "../../ui/CoinPrice";
import SearchBar from '../../../containers/timeline/search-bar'
import { debounce } from "lodash";
import { getElementMaxHeight, handleContextMenu } from "../../../lib/helper";
import { isAgency } from "../../../lib/config/creds";
import { BULK_UNSEND, bulkMessageStatus } from "../../../lib/config/chat";
import { open_dialog } from "../../../lib/global/loader";
import { deleteBlkMsgSubject } from "../../../lib/rxSubject";

const demoarray = [
  { id: 1 },
  { id: 1 },
  { id: 1 },
  { id: 1 },
  { id: 1 },
  { id: 1 },
  { id: 1 },
  { id: 1 },
  { id: 1 },
  { id: 1 },
  { id: 1 },
  { id: 1 },
  { id: 1 },
  { id: 1 },
  { id: 1 },
  { id: 1 },
  { id: 1 },
  { id: 1 },
  { id: 1 },
  { id: 1 },
  { id: 1 },
]

const DetailBulkMessage = (props) => {
  const theme = useTheme();
  const [mobileView] = isMobile();
  const [lang] = useLang();
  const uid = getCookie("uid");
  let postId;
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const appConfig = useSelector(state => state?.appConfig)
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  // Local State
  const [postData, setPostData] = useState(null);
  const [usersData, setUsersData] = useState([]);
  const [message, setMessage] = useState(props.message);
  const [bulkMsgDtl, setBulkMsgDtl] = useState(null)
  const [status, setStatus] = useState();
  const [selectedFilter, setFilterSelected] = useState();
  const [loader, setLoader] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [searchText, setSearchText] = useState(null)
  const [showSearch, setShowSearch] = useState(false)
  const [noSearch, setNoSearch] = useState(true)
  const [userListHeight, setUserListheight] = useState('auto')
  const [lastDataFromAPI, setLastDataFromAPI] = useState(false);
  const scrolledPositionRef = useRef()
  let postMediaList = postData?.postData || []
  if (postData?.previewData && postData?.postData) {
    postMediaList = postData?.previewData.concat(postData?.postData)
  }

  const filters = [
    { value: 0, label: "All Members", name: "bulkMsg" },
    { value: 1, label: "Viewed", name: "bulkMsg", responseKey: "VIEWED" },
    { value: 2, label: "Not Viewed", name: "bulkMsg", responseKey: "NOT_VIEWED" },
    { value: 3, label: "Purchased", name: "bulkMsg", responseKey: "PURCHASED" },
    { value: 4, label: "Not Purchased", name: "bulkMsg", responseKey: "NOT_PURCHASED" },
  ];


  const handleFilter = (index) => {
    setFilterSelected(filters[index])
    setPageCount(0)
    setSearchText('')
  }

  useEffect(() => {
    if (bulkMsgDtl) {
      setUserListheight(getElementMaxHeight([document.getElementById('blkTop'), document.querySelector('.blkMembers')], '100vh'))
    }
  }, [bulkMsgDtl, showSearch, usersData])

  const getViewList = async (searchText) => {
    let search;
    let page = pageCount;
    if (searchText && searchText?.length > 0) {
      search = searchText;
      page = 0;
    }
    startLoader()
    getBulkMessageReadList(bulkMsgDtl.broadcastListId, search, 10, page * 10).then(res => {
      stopLoader()
      setLoader(false)
      if (res.data?.users && res.data.users.length > 0) {
        const users = res.data.users.map(user => {
          return {
            // "_id": "64f86471af3d08001336e421",
            // "postId": "64f86471af3d08001336e41c",
            // "isPurchased": false,
            "user": {
              "userId": user?.metaData?.userId,
              "username": user?.userName,
              "firstName": user?.metaData?.firstName,
              "lastName": user?.metaData?.lastName,
              "profilePic": user?.metaData?.profilePic,
              "userTypeCode": 1
            }
          }
        })
        setUsersData([...users])
        setPageCount(prev => prev + 1)
      } else {
        setLastDataFromAPI(true)
      }
    }).catch(e => {
      if (searchText) {
        setUsersData()
      }
      stopLoader()
      setLoader(false)
      setLastDataFromAPI(true)
    })
  }

  useEffect(() => {
    setUsersData([])
    if (selectedFilter?.value || selectedFilter?.value === 0) {
      getDetailedBulkMessageAPI(message, false, pageCount);
    }
  }, [selectedFilter])

  useEffect(() => {
    if (mobileView) {
      getDetailedBulkMessageAPI(message);
    } else {
      if (props.bulkMsgDetailRef) {
        props.bulkMsgDetailRef.current = {
          initializeMsg: (args) => { getDetailedBulkMessageAPI(args); setFilterSelected(); setNoSearch(true); setShowSearch(false); setSearchText('') }
        }
      }
    }
  }, []);

  const debounceSearchUsers = useCallback(debounce((text) => {
    getDetailedBulkMessageAPI(message, false, 0, text)
  }, 700), [message, selectedFilter])

  useEffect(() => {
    if ((searchText && searchText.length > 1 || searchText !== null) && !noSearch) {
      debounceSearchUsers(searchText)
    }
  }, [searchText, noSearch])

  // useEffect(() => {
  //   if (props.bulkMsgDetailRef?.current?.msgId) {
  //     setFilterSelected({
  //       value: 0,
  //       label: "All",
  //       name: "bulkMsg"
  //     })
  //   }
  // }, [props.bulkMsgDetailRef?.current?.msgId])

  useEffect(() => {
    setLastDataFromAPI(false)
    if (usersData && usersData.length) {
      postId = usersData[0].postId;
    }

    // Title Shown on Header
    if (postData && postData.postType == 4) {
      setStatus("Locked Post");
    } else if (postData && postData.postType == 5 && postData.postData[0].type === 4) {
      setStatus("Free Text Post");
    } else {
      setStatus("Free Media Post");
    }

  }, [usersData]);

  const back = () => {
    props.close()
  }

  const getUsersCount = (selectedFilter, bulkMsgDtl) => {
    if (selectedFilter) {
      if (selectedFilter?.value === 0) {
        return bulkMsgDtl?.noOfUsers
      }
      if (selectedFilter?.value === 1) {
        return bulkMsgDtl?.readCount
      }
      if (selectedFilter?.value === 3) {
        return bulkMsgDtl?.noOfPurchases
      }
      return 0
    } else {
      return bulkMsgDtl?.noOfUsers
    }
  }
  const getDetailedBulkMessageAPI = async (msg, loader = false, page = 0, searchText) => {
    // if (!page) {
    //   setPageCount(0);
    // }
    if (selectedFilter?.responseKey === 'VIEWED') {
      getViewList(searchText)
      return
    }

    if (!mobileView) {
      setMessage(msg);
    }

    try {
      // setLoader(true);
      !loader && startLoader();

      if (msg && Object.entries(msg).length !== 0) {
        let payload = {
          bulkMessageId: msg._id,
          filter: selectedFilter && selectedFilter.value ? selectedFilter.responseKey : "",
          limit: 10,
          offset: page * 10,
        }
        if (searchText && searchText.length > 0) {
          payload.searchText = searchText
        }
        if (isAgency()) {
          payload["userId"] = selectedCreatorId;
        }
        const res = await getDetailedBulkMessage(payload);
        if (res.status === 200 && !selectedFilter?.value && page == 0) {
          setBulkMsgDtl(res?.data?.data?.bulkMessage);
          setPostData(res?.data?.data?.postData);
          setUsersData(res?.data?.data?.userData);

        } else if (selectedFilter?.value && page == 0) {
          setUsersData(res?.data?.data?.userData);
        } else if (page != 0 && res.status === 200) {
          setUsersData(prev => [...prev, ...res?.data?.data?.userData]);
        } else if (searchText && searchText.length > 0 && res.status !== 200) {
          setUsersData([]);
        } else if (res.status === 204 && !selectedFilter?.value) {
          setLastDataFromAPI(true);
        } else if (res.status === 204) {
          setLastDataFromAPI(true);
          // setUsersData([]);
        } else {
          setUsersData([]);
          setPostData(null);
        }
      }

      setPageCount(page + 1)
      stopLoader();
      setLoader(false);

    } catch (err) {
      stopLoader();
      setLoader(false);
      setUsersData([]);
      setPostData(null);
      setBulkMsgDtl(null);
      setMessage(props.message);
      Toast("Something went wrong");
      console.error("ERROR IN getDetailedBulkMessageAPI", err);
    }
  }

  const redirectToProfile = (data) => {
    if (data.user.userTypeCode == 2) {
      Route.push(`${data.user.username}`)
    }
  }

  const handleMediaGalleryClick = (index) => {
    const assets = [];
    if (postData?.previewData && postData?.previewData.length > 0) {
      const previewList = postData?.previewData.map((file, idx) => {
        return ({
          id: idx + 1,
          seqId: idx + 1,
          mediaType: file.type == 1 ? "IMAGE" : "VIDEO",
          mediaThumbnailUrl: file.thumbnail || file.url,
          mediaUrl: file.url || file.thumbnail,
          isPreview: true
        })
      })
      assets = [...previewList]
    }

    const postImages = postData?.postData.map((file, idx) => {
      return ({
        id: idx + postData?.previewData ? postData?.previewData.length : 1,
        seqId: idx + postData?.previewData ? postData?.previewData.length : 1,
        mediaType: file.type == 1 ? "IMAGE" : "VIDEO",
        mediaThumbnailUrl: file.thumbnail || file.url,
        mediaUrl: file.url || file.thumbnail,
      })
    })

    assets = [...assets, ...postImages]

    open_drawer("openMediaCarousel", {
      assets: assets,
      selectedMediaIndex: index || 0,
      scrolledPositionRef: scrolledPositionRef,
    }, "right")
  }

  const BulkMsgPost = (postData, index) => {

    return (
      <>
        {
          postData?.type == 2 ? <div className='blkImage position-relative w-100 h-100 video_section' onClick={() => handleMediaGalleryClick(index)}>
            <div className='video_icon_msg position-absolute d-flex align-items-center justify-content-center w-100 h-100'>
              <Icon
                icon={videoPlay_icon + "#videoPlayIcon"}
                width={!mobileView ? 50 : 32}
                height={!mobileView ? 50 : 32}
                viewBox="0 0 32 32"
              />
            </div>
            <Image
              src={s3ImageLinkGen(S3_IMG_LINK, postData?.thumbnail || postData?.url, 70, 120, 120)}
              width={mobileView ? "100%" : "100%"}
              height={mobileView ? "100%" : "100%"}
              style={{ objectFit: "cover", filter: "brightness(0.8)", borderRadius: "8px" }}
            />
          </div> :
            <div className="image_section blkImage" onClick={() => handleMediaGalleryClick(index)}>
              <Image
                src={s3ImageLinkGen(S3_IMG_LINK,  postData?.thumbnail || postData?.url, 80, 120, 120)}
                width={mobileView ? "100%" : "100%"}
                height={mobileView ? "100%" : "100%"}
                style={{ objectFit: "cover", borderRadius: "8px" }}
              />
            </div>
        }
        <style jsx>
          {`
          :global(.blkImage img) {
            width: ${mobileView ? '8vh' : '12vh'};
            height: ${mobileView ? '8vh' : '12vh'};
          }
          `}
        </style>
      </>
    )
    // } else {
    //   return (
    //     <TextPost
    //       className={mobileView ? "radius10 dv_base_bg_dark_color object-fit-contain container-border w-100" : "dv__profilepostImg"}
    //       postType={postData.postType}
    //       price={postData.price || 0}
    //       currency={postData.currency || "$"}
    //       isVisible={postData.isVisible || 0}
    //       userId={uid}
    //       postId={postId}
    //       textPost={postData.postData}
    //       alt="Text Bulk Post"
    //     />
    //   );
    // }
  }

  const noBulkMsgPlaceholder = () => {
    return (<div className="vh-100 py-3 d-flex align-items-center justify-content-center">
      <div className="d-flex align-items-center justify-content-center h-100">
        <div className="text-center">
          <Img
            key="empty-placeholder"
            className="text"
            src={NO_BULK_ICON}
            alt="No Data found"
            width="200px"
          />
          <p className="my-3 fntWeight600 fntSz20">{lang.noBulkMsg}</p>
          <Button
            type="button"
            fclassname='gradient_bg rounded-pill'
            btnSpanClass='text-white'
            btnSpanStyle={{ lineHeight: '0px', padding: '8px' }}
            onClick={props?.addBulkMessageHandler || function () { }}
            children={lang.createNewMsg}
            style={{ margin: 'auto', width: 'auto' }}
          />
        </div>
      </div>
    </div>)
  }

  const plusItemsPlaceHolder = (count) => {
    return (<div onClick={handleMediaGalleryClick} className="media-item cursorPtr mr-2 plus-overlay text-white" key='blank'>+<br />{`${count}`}
      <style jsx>
        {`
              .plus-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                font-size: 20px;
                line-height: 20px;
                text-align: center;
                display: flex;
                flex-direction: column;
                justify-content: center;
                background: rgba(0, 0, 0, 0.4);
                border-radius: 12px;
            }
      `}
      </style>
    </div>)
  }

  const bulkUnsendReq = async (id) => {
    startLoader()
    try {
      let payload = {
        id: id,
      }
      if (isAgency()) {
        payload["userId"] = selectedCreatorId;
      }
      await unsendBulkMsg(payload)
      setMessage((prev) => {
        return {
          ...prev,
          status: bulkMessageStatus.UNSEND
        }
      })
      deleteBlkMsgSubject.next(id)
      stopLoader()
      Toast(lang.bulkUnsendQueue)
    } catch (e) {
      stopLoader()
      Toast(lang.reportErrMsg, 'error')
    }
  }

  const handleBulkMagDelete = (e, id) => {
    e.stopPropagation()
    if (mobileView) {
      open_drawer("confirmDrawer", {
        title: lang.unsendBulk,
        subtitle: <div><p>{lang.unsendBulkDesc}</p><b>{lang.unsendBulkConfirm}</b></div>,
        showCancel: false,
        submitT: lang?.confirm,
        yes: async () => {
          bulkUnsendReq(id)
        }
      }, 'bottom')
    } else {
      open_dialog("confirmDialog", {
        title: lang.unsendBulk,
        subtitle: <div><p>{lang.unsendBulkDesc}</p><b>{lang.unsendBulkConfirm}</b></div>,
        showCancel: false,
        submitT: lang?.confirm,
        yes: async () => {
          bulkUnsendReq(id)
        }
      })
    }
  }

  return (
    <div className="bulkDetailWrap">
      {mobileView
        ? <div>
          {/* <BulkMessageHeader className={theme.type === "light" ? "bg-white" : "card_bg"} back={back} title={props?.message?.currency ? lang.lockedPost : lang.freeBulkMsg} subTitle={""} mobileView={true} /> */}
          <Header
            title="My Followers"
            icon={backArrow}
            back={() => props.close()}
            showMenu={false}
            right={() => message?.status !== bulkMessageStatus.UNSEND ? <Button
              type="button"
              fclassname='unsendBtn gradient_bg rounded-pill py-1 w-auto d-flex align-items-center justify-content-center text-white'
              btnSpanClass='text-white fntSz12'
              leftIcon={{ src: BULK_UNSEND, id: "bulkUnsend" }}
              iconHeight={16}
              iconWidth={16}
              iconClass='mr-1'
              btnSpanStyle={{ lineHeight: '0px', paddingTop: '2.5px' }}
              onClick={(e) => handleBulkMagDelete(e, message._id)}
              children={lang?.unsend}
            /> :
              message?.status === bulkMessageStatus.UNSEND ? <div className="unsentChip mr-2 mt-0"><div className="h-100 w-100 gradient_text text-center"> {lang?.unsent} </div></div> : ""}
          />
          {postData
            ? <>
              <div className="px-3 bulkChatMainSection"
                style={{
                  paddingTop: "80px",
                  background: theme.type === "light" ? "url(/Bombshell/images/chat/bulk-bg-light-mobile.svg)" : "url(/Bombshell/images/chat/bulk-bg-dark-mobile.svg)",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  height: "calc(var(--vhCustom, 1vh) * 100)"
                }}
                id="single-bulk-msg-pagination">
                <div className="borderStrokeClr radius_8 py-3 px-2 mx-auto"
                  style={{ background: " linear-gradient(96.81deg, rgba(211, 58, 255, 0.04) 0%, rgba(255, 113, 164, 0.04) 100%)" }}>
                  {postData?.description && postData?.description.length > 0 ? <div className="text-left borderBtm pb-1" style={{ maxHeight: '4rem', overflowY: 'auto' }}>
                    <ShowMore
                      text={postData?.description}
                    />
                  </div> : ""}
                  <div>
                    <div className="mt-1 pt-1">
                      <div className="pr-2 text-center d-flex align-items-center">
                        <p className="light_app_text my-2">{`${lang.sentOn} :`}</p>
                        <p className="font-weight-bold text-app my-2 ml-1">{formatDate(bulkMsgDtl?.createdTs, "MMM DD YYYY hh:mm A")}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3 mt-2 d-flex flex-row" style={{ maxWidth: mobileView ? "100%" : 'calc(66.666% - 2rem)', overflow: 'auto' }}>
                    {postMediaList?.map((data, index) => {
                      return (index < 5 && <div className="media-item cursorPtr position-relative mr-2" key={"bpost_" + index}>
                        {BulkMsgPost(data, index)}
                        {
                          index === 4 && postMediaList?.length > 5 ? plusItemsPlaceHolder(postMediaList.length - 5) : ""
                        }
                      </div>
                      )
                    })}

                  </div>
                  <div>
                    {bulkMsgDtl &&
                      <div className="d-flex flex-row w-100" style={{ whiteSpace: "nowrap" }}>
                        <div className="px-2 py-2 mr-1 gradient_bg dataItem">
                          <p className="line1 font-weight-bold mb-1 text-app">{`${bulkMsgDtl?.readPercentage.toString().includes(".") ? bulkMsgDtl?.readPercentage.toFixed(2) : bulkMsgDtl?.readPercentage}%`}</p>
                          <p className="line2 text-app mb-0">{`${lang.openRate}`}</p>
                        </div>
                        <div className="px-2 py-2 mr-1 gradient_bg dataItem">
                          <p className="line1 font-weight-bold mb-1 text-app">{`${bulkMsgDtl?.purchasedPercentage.toString().includes(".") ? bulkMsgDtl?.purchasedPercentage.toFixed(2) : bulkMsgDtl?.purchasedPercentage}%`}</p>
                          <p className="line2 text-app mb-0">{`${lang.conversionRate}`}</p>

                        </div>
                        <div className="px-2 py-2 mr-1 gradient_bg dataItem">
                          <p className="line1 font-weight-bold mb-1 text-app">
                            {/* <CoinPrice align='center' showCoinText={false} price={bulkMsgDtl?.price || "-"} iconSize={16} size={14} /> */}
                            {`${defaultCurrency}${bulkMsgDtl?.price && Number((bulkMsgDtl?.price).toFixed(2)) || 0}`}
                          </p>
                          <p className="line2 text-app mb-0">{`${lang.Price}`}</p>
                        </div>


                        <div className="px-2 py-2 gradient_bg dataItem">
                          <p className="line1 font-weight-bold mb-1 text-app">
                            {/* <CoinPrice align='center' showCoinText={false} price={bulkMsgDtl?.totalEarnings && Number((bulkMsgDtl?.totalEarnings).toFixed(2)) || 0} iconSize={16} size={14} /> */}
                            {`${defaultCurrency}${bulkMsgDtl?.totalEarnings && Number((bulkMsgDtl?.totalEarnings).toFixed(2)) || 0}`}
                          </p>
                          <p className="line2 text-app mb-0">{lang.totalEarnings}</p>
                        </div>
                      </div>
                    }
                  </div>
                </div>


                <div className="py-3">
                  <div className="d-flex flex-row gap_8 btnList">
                    <div>
                      <Button
                        type="button"
                        fclassname={`borderStroke rounded-pill py-2 px-4 ${!selectedFilter || selectedFilter?.value === 0 ? 'gradient_bg' : 'background_none'}`}
                        children="All"
                        onClick={() => handleFilter(0)}
                      />
                    </div>
                    <div>
                      <Button
                        type="button"
                        fclassname={`borderStroke rounded-pill py-2 px-4 ${selectedFilter?.value === 3 ? 'gradient_bg' : 'background_none'}`}
                        children="Purchased"
                        onClick={() => handleFilter(3)}
                      />
                    </div>
                    <div>
                      <Button
                        type="button"
                        fclassname={`borderStroke rounded-pill py-2 px-4 ${selectedFilter?.value === 1 ? 'gradient_bg' : 'background_none'}`}
                        children="Viewed"
                        onClick={() => handleFilter(1)}
                      />
                    </div>
                  </div >

                  <div className="mt-3 overflowY-auto" style={{ maxHeight: "calc(calc(var(--vhCustom, 1vh) * 100) - 380px)" }}>
                    <div className="userSearch searchMb pb-2">
                      <SearchBar
                        value={searchText}
                        handleSearch={(e) => {
                          if (noSearch) {
                            setNoSearch(false)
                          }
                          setSearchText(e.target.value);
                        }}
                        placeholder={lang.seachByNameUsername}
                        fclassname={"background_none borderStroke"}
                        crossIcon={searchText && true}
                        onlySearch={true}
                        onClick={() => { setSearchText(''); }}
                      />
                    </div>
                    {usersData && usersData.length
                      ? usersData.map((userData, index) => (
                        <div className={` ${index === (usersData.length - 1) ? "pb-4 mb-3" : ""}`} key={userData._id}>
                          <div className='py-2 d-flex flex-row align-items-center'>
                            <div className='d-flex align-items-center cursorPtr callout-none' onContextMenu={handleContextMenu}
                              onClick={() => redirectToProfile(userData)}>
                              {userData?.user?.profilePic ? (
                                <div className="position-relative">
                                  <FigureCloudinayImage
                                    publicId={userData?.user?.profilePic}
                                    className="live"
                                    errorImage={EMPTY_PROFILE}
                                    style={mobileView
                                      ? { borderRadius: "50%" }
                                      : {
                                        maxWidth: "2.781vw",
                                        maxHeight: "2.781vw",
                                        borderRadius: "50%",
                                      }
                                    }
                                    width={50}
                                    height={50}
                                  />
                                  {userData.user.userTypeCode === 2
                                    ? <div className="position-absolute" style={{ right: "-5px", top: "-10px" }}>
                                      <Image
                                        src={Creator_Icon}
                                        width={20}
                                        height={20}
                                      />
                                    </div>
                                    : ""}
                                </div>
                              )
                                : <Avatar
                                  className="mySubscription"
                                  style={mobileView
                                    ? { height: "50px", width: "50px" }
                                    : { height: "2.781vw", width: "2.781vw" }
                                  }
                                >
                                  {userData?.user?.username && (
                                    <span className="text-uppercase font-weight-500 viewText fntSz25">
                                      {userData?.user?.username[0]}
                                    </span>
                                  )}
                                </Avatar>
                              }
                            </div>

                            <div className="d-flex flex-row justify-content-between align-items-center w-100 borderBtm ml-3">
                              <div className=''>
                                <p className='p-0 m-0 theme_text'>{userData?.user?.username}</p>
                                <p className='p-0 m-0 text-muted'>{userData?.user?.firstName} {userData?.user?.lastName}</p>
                              </div>
                              {userData.status == "READ"
                                && <div className='d-flex align-items-center'>
                                  <Img
                                    className="cursorPtr m-0 p-0"
                                    src={EYE}
                                  />
                                  <p className='p-0 m-0 ml-1 viewText fntSz12'>
                                    {lang.viewed}
                                  </p>
                                </div>
                              }
                              {userData?.isPurchased
                                && <div className='d-flex align-items-center'>
                                  <Icon
                                    icon={`${DOLLAR_BULK_MESSAGE}#dollar-icon`}
                                    size={12}
                                    color={theme.palette.l_base}
                                    viewBox="0 0 13.441 13.441"
                                    class="mb-1"
                                  />
                                  <p className='p-0 m-0 ml-1 viewText fntSz12'>
                                    {lang.purchased}
                                  </p>
                                </div>
                              }
                            </div>

                          </div>
                        </div>
                      ))
                      : !loader || usersData?.length
                        ? <div className="no-users pt-5 d-flex justify-content-center align-items-center w-700">
                          <div className="text-center">
                            <Img
                              key="empty-placeholder"
                              className="text"
                              src={NO_USER_DATA}
                              alt="this will never show"
                            />
                            <div className="dv_appTxtClr my-3">{lang.noDataFound}</div>
                          </div>
                        </div>
                        : ""
                    }
                  </div>

                  {
                    loader
                      ? <div className="text-center">
                        <CustomDataLoader type="normal" isLoading={loader} />
                      </div>
                      : ""
                  }

                  {/* {usersData?.length && <Pagination
                    key={selectedFilter.value}
                    id={"usersData"}
                    items={usersData}
                    getItem={getDetailedBulkMessageAPI}
                  />} */}
                  {
                    !!usersData?.length && <PaginationIndicator
                      id="single-bulk-msg-pagination"
                      // key={selectedFilter.value}
                      totalData={usersData}
                      totalCount={usersData || 500}
                      // items={users}
                      pageEventHandler={() => {
                        if (!loader && !lastDataFromAPI) {
                          setLoader(true);
                          getDetailedBulkMessageAPI(message, true, pageCount, searchText);
                        }
                      }}
                    />
                  }
                </div >
              </div >

            </>
            : ""
          }
          <style jsx>{`
        .lineHeight {
          line-height: 18px;
        }
        :global(.searchMb .col-12) {
          padding: 0 !important;
        }
        :global(.searchMb) {
          position: sticky;
          top: 0;
          z-index: 3;
        }
        :global(.btnList .gradient_bg *) {
          color: #fff !important
        }
        .dataItem {
          border-radius: 8px;
          min-width: 24%;
          max-width: 24%;
        }
        .dataItem .line1{
          font-size: 12px;
        }
        .dataItem .line2{
          font-size: 10px;
        }
        :global(.unsendBtn) {
          line-height: initial;
        }
      `}</style>
        </div >
        : postData
          ? <>
            <div className="p-2 mb-0" id="blkTop">
              {postData.postData[0].type == 4 && !message.price
                ? <div className="col-2 px-0 text-center">
                  {BulkMsgPost(postData)}
                </div>
                : <>
                  <div className="d-flex flex-column justify-content-between align-items-start flex-grow-1 w-100">
                    <div className="d-flex w-100 justify-content-between align-items-center mb-2">
                      <h6 className="mb-0 py-2">
                        {bulkMsgDtl?.listTitle}
                      </h6>
                      {message?.status !== bulkMessageStatus.UNSEND ? <Button
                        type="button"
                        fclassname='unsendBtn gradient_bg rounded-pill py-1 w-auto d-flex align-items-center justify-content-center text-white'
                        btnSpanClass='text-white fntSz14'
                        leftIcon={{ src: BULK_UNSEND, id: "bulkUnsend" }}
                        iconHeight={20}
                        iconWidth={20}
                        iconClass='mr-1'
                        btnSpanStyle={{ lineHeight: '0px', paddingTop: '2.5px' }}
                        onClick={(e) => handleBulkMagDelete(e, message._id)}
                        children={lang?.unsend}
                      /> : ""}
                    </div>

                    <p className='fntSz14 m-0 theme_text h-100'
                      style={{ height: "80px", wordBreak: "break-word", overflowY: "auto", maxHeight: postData.postType == 4 && bulkMsgDtl ? "3em" : "8em" }}>
                      <ShowMore
                        text={postData?.description}
                        onChange={() => {
                          setUserListheight(getElementMaxHeight([document.getElementById('blkTop'), document.querySelector('.blkMembers')], '100vh'))
                        }}
                      />
                    </p>
                    <div className="pr-2 text-center d-flex align-items-center">
                      <p className="light_app_text my-2">{`${lang.sentOn} :`}</p>
                      <p className="font-weight-bold text-app my-2 ml-1">{formatDate(bulkMsgDtl?.createdTs, "MMM DD YYYY hh:mm A")}</p>
                    </div>
                    <div className="mb-3 mt-2 w-100 d-flex flex-row align-items-center flex-nowrap" style={{ maxWidth: "100%", overflowX: 'auto' }}>
                      {postMediaList?.map((data, index) => {
                        return (index < 5 && <div className="media-item cursorPtr position-relative mr-2" key={"bpostm_" + index}>
                          {BulkMsgPost(data, index)}
                          {
                            index === 4 && postMediaList?.length > 5 ? plusItemsPlaceHolder(postMediaList.length - 5) : ""
                          }
                        </div>
                        )
                      })}
                    </div>

                    {bulkMsgDtl &&
                      <div className="d-flex flex-row gap_10 w-100" style={{ whiteSpace: "nowrap" }}>
                        <div className="px-2 py-2 gradient_bg dataItem">
                          <p className="font-weight-bold mb-1 text-app fntSz16">{`${bulkMsgDtl?.readPercentage.toString().includes(".") ? bulkMsgDtl?.readPercentage.toFixed(2) : bulkMsgDtl?.readPercentage}%`}</p>
                          <p className="text-app mb-0">{`${lang.openRate}`}</p>
                        </div>
                        <div className="px-2 py-2 gradient_bg dataItem">
                          <p className="font-weight-bold mb-1 text-app fntSz16">{`${bulkMsgDtl?.purchasedPercentage.toString().includes(".") ? bulkMsgDtl?.purchasedPercentage.toFixed(2) : bulkMsgDtl?.purchasedPercentage}%`}</p>
                          <p className="text-app mb-0">{`${lang.conversionRate}`}</p>
                        </div>
                        <div className="px-2 py-2 gradient_bg dataItem">
                          <p className="font-weight-bold mb-1 text-app fntSz16">
                            {/* <CoinPrice align='center' showCoinText={false} price={bulkMsgDtl?.price || "-"} iconSize={16} size={14} /> */}
                            {`${defaultCurrency}${bulkMsgDtl?.price && Number((bulkMsgDtl?.price).toFixed(2)) || 0}`}
                          </p>
                          <p className="text-app mb-0">{`${lang.Price}`}</p>
                        </div>

                        <div className="px-2 py-2 gradient_bg dataItem">
                          <p className="font-weight-bold mb-1 text-app fntSz16">
                            {/* <CoinPrice align='center' showCoinText={false} price={bulkMsgDtl?.totalEarnings && Number((bulkMsgDtl?.totalEarnings).toFixed(2)) || 0} iconSize={16} size={14} /> */}
                            {`${defaultCurrency}${bulkMsgDtl?.totalEarnings && Number((bulkMsgDtl?.totalEarnings).toFixed(2)) || 0}`}
                          </p>
                          <p className="text-app mb-0">{lang.totalEarnings}</p>
                        </div>
                      </div>
                    }
                  </div>
                </>
              }
            </div>
            <div className="row mx-0 borderTop">
              <div className="col-4 px-0">
                <div className={`d-flex flex-column px-3 borderBtm py-2 cursorPtr w-500 ${!selectedFilter || selectedFilter?.value === 0 ? 'opacity_less_bg' : ''}`} onClick={() => handleFilter(0)}>
                  <div className={`${!selectedFilter || selectedFilter?.value === 0 ? 'gradient_text' : ''}`}>All Members</div>
                  <div className={`d-flex flex-row align-items-center ${!selectedFilter || selectedFilter?.value === 0 ? 'gradient_text' : ''}`}>
                    <Icon
                      icon={`${USER_LIST_AVATAR}#userListAvtar`}
                      width={18}
                      height={18}
                      // color={"var(--l_light_app_text)"}
                      color={`${!selectedFilter || selectedFilter?.value === 0 ? 'var(--l_base)' : 'var(--l_light_app_text)'}`}
                      class='cursorPtr mr-1 lineHeight'
                      viewBox="0 0 24 24"
                    />
                    <div className="lineHeight" style={{ marginTop: '2px' }}>{bulkMsgDtl?.noOfUsers}</div>
                  </div>
                </div>
                {
                  bulkMsgDtl && bulkMsgDtl.hasOwnProperty('noOfPurchases') ?
                    <div className={`d-flex flex-column px-3 borderBtm py-2 cursorPtr w-500 ${selectedFilter?.value === 3 ? 'opacity_less_bg' : ''}`} onClick={() => handleFilter(3)}>
                      <div className={`${selectedFilter?.value === 3 ? 'gradient_text' : ''}`}>Purchased</div>
                      <div className={`d-flex flex-row align-items-center ${selectedFilter?.value === 3 ? 'gradient_text' : ''}`}>
                        <Icon
                          icon={`${UNLOCK_ICON}#unlockIcon`}
                          width={18}
                          height={18}
                          color={`${selectedFilter?.value === 3 ? 'var(--l_base)' : 'var(--l_light_app_text)'}`}
                          // color={"var(--l_base)"}
                          class='cursorPtr mr-1 lineHeight'
                          viewBox="0 0 24 24"
                        />
                        <div className="lineHeight" style={{ marginTop: '2px' }}>{bulkMsgDtl?.noOfPurchases}</div>
                      </div>
                    </div> : ""
                }

                <div className={`d-flex flex-column px-3 borderBtm py-2 cursorPtr w-500 ${selectedFilter?.value === 1 ? 'opacity_less_bg' : ''}`} onClick={() => handleFilter(1)}>
                  <div className={`${selectedFilter?.value === 1 ? 'gradient_text' : ''}`}>{lang.viewed}</div>
                  <div className={`d-flex flex-row align-items-center ${selectedFilter?.value === 1 ? 'gradient_text' : ''}`}>
                    <Icon
                      icon={`${CHAT_EYE}#chatEye`}
                      width={18}
                      height={18}
                      color={`${selectedFilter?.value === 1 ? 'var(--l_base)' : 'var(--l_light_app_text)'}`}
                      // color={"var(--l_base)"}
                      class='cursorPtr mr-1 lineHeight'
                      viewBox="0 0 24 24"
                    />
                    <div className="lineHeight" style={{ marginTop: '2px' }}>{selectedFilter?.responseKey === 'VIEWED' && usersData?.length !== undefined ? usersData?.length || bulkMsgDtl?.readCount : "" || bulkMsgDtl?.readCount || 0}</div>
                  </div>
                </div>
              </div>
              <div className="px-3 col-8 borderLeft">
                <div className="members blkMembers">
                  <div className="d-flex align-items-center justify-content-between">
                    <p className='py-3 m-0 txt-heavy theme_text'>
                      {`${selectedFilter?.label || 'All Members'} (${getUsersCount(selectedFilter, bulkMsgDtl) || 0})`}
                    </p>
                    <Icon
                      icon={`${SIDEBAR_SEARCH}#searchicon`}
                      color="var(--l_app_text)"
                      width={18}
                      height={18}
                      class="cursorPtr p-3"
                      viewBox="0 0 34 34"
                      onClick={() => setShowSearch(!showSearch)}
                    />
                  </div>
                  {
                    showSearch ?
                      <div className="userSearch pb-2">
                        <SearchBar
                          value={searchText}
                          handleSearch={(e) => {
                            if (noSearch) {
                              setNoSearch(false)
                            }
                            setSearchText(e.target.value);
                          }}
                          placeholder={lang.seachByNameUsername}
                          fclassname={"background_none borderStroke"}
                          crossIcon={searchText && true}
                          onlySearch={true}
                          onClick={() => { setSearchText(''); }}
                        />
                      </div> : ''
                  }
                </div>

                <div style={{ overflow: "auto" }} id="single-bulk-msg-pagination">
                  {usersData && usersData.length
                    ? usersData.map(userData => (
                      <div key={userData._id}>
                        <div className=''>
                          <div className='py-2 d-flex justify-content-between align-items-center borderBtm callout-none' onContextMenu={handleContextMenu}>
                            <div className={`d-flex align-items-center${userData.user.userTypeCode === 2 ? " cursorPtr" : ""}`}
                              onClick={() => redirectToProfile(userData)}>
                              {userData?.user?.profilePic ? (
                                <div className="position-relative">
                                  <FigureCloudinayImage
                                    publicId={userData?.user?.profilePic}
                                    className="live d-flex"
                                    errorImage={EMPTY_PROFILE}
                                    style={
                                      mobileView
                                        ? { borderRadius: "50%" }
                                        : {
                                          maxWidth: "100%",
                                          maxHeight: "100%",
                                          borderRadius: "50%",
                                        }
                                    }
                                    width={50}
                                    height={50}
                                  />
                                  {userData.user.userTypeCode === 2
                                    ? <div style={{
                                      position: "absolute",
                                      top: "1.5rem",
                                      right: "-6px",
                                    }} className="">
                                      <Image
                                        src={Creator_Icon}
                                        width={16}
                                        height={16}
                                      />
                                    </div>
                                    : ""}
                                </div>
                              ) : (
                                <Avatar
                                  className="mySubscription"
                                  style={{ height: "50px", width: "50px" }}
                                >
                                  {userData?.user?.username && (
                                    <span className="text-uppercase font-weight-500 viewText fntSz25">
                                      {userData?.user?.username[0]}
                                    </span>
                                  )}
                                </Avatar>
                              )}
                              <div className='ml-3'>
                                <p className='p-0 m-0 theme_text'>{userData?.user?.username}</p>
                                <p className='p-0 m-0 light_app_text'>@{userData?.user?.username}</p>
                              </div>
                            </div>

                            {userData.status === "READ"
                              ? <div className='d-flex align-items-center'>
                                <Img
                                  className="cursor-pointer m-0 p-0"
                                  src={EYE}
                                />
                                <p className='p-0 m-0 ml-1 viewText fntSz14'>
                                  {lang.viewed}
                                </p>
                              </div>
                              : ""
                            }
                            {userData?.isPurchased
                              ? <div className='d-flex align-items-center'>
                                <Icon
                                  icon={`${DOLLAR_BULK_MESSAGE}#dollar-icon`}
                                  size={14}
                                  color={theme.palette.l_base}
                                  viewBox="0 0 13.441 13.441"
                                  class="mb-1"
                                  alt="dollar icon"
                                />
                                <p className='p-0 m-0 ml-1 viewText fntSz14'>
                                  {lang.purchased}
                                </p>
                              </div>
                              : ""
                            }
                          </div>
                          {/* <div className='' style={{ width: '100%', height: '0.1px', background: "#e5e5e5" }}></div> */}
                        </div>
                      </div>
                    ))
                    : <div className="d-flex align-items-center justify-content-center h-100">
                      <div className="text-center">
                        <Img
                          key="empty-placeholder"
                          className="text"
                          src={NO_BULK_ICON}
                          alt="No Data found"
                        />
                        <p className="my-3 fntWeight600">{lang.noBulkMsg}</p>
                      </div>
                    </div>
                  }

                  {loader
                    ? <div className="text-center">
                      <CustomDataLoader type="normal" isLoading={loader} />
                    </div>
                    : ""
                  }

                  {usersData && usersData.length
                    ? <PaginationIndicator
                      id="single-bulk-msg-pagination"
                      // key={selectedFilter.value}
                      // elementRef={bulkMsgRef}
                      totalData={usersData}
                      totalCount={500}
                      // items={users}
                      pageEventHandler={() => {
                        if (!lastDataFromAPI) {
                          if (!loader) {
                            setLoader(true);
                            getDetailedBulkMessageAPI(message, true, pageCount, searchText);
                          }
                        }
                      }}
                    />
                    : ""
                  }
                </div>
              </div>
            </div>
            <style jsx>{`
        .lineHeight {
          line-height: 18px;
        }
        :global(.searchMb .col-12) {
          padding: 0 !important;
        }
        #single-bulk-msg-pagination {
          height: ${userListHeight}
        }
        .dataItem {
          border-radius: 8px;
          min-width: 20%;
        }
        :global(.unsendBtn) {
          line-height: initial;
        }
      `}</style>
          </>
          : <>{noBulkMsgPlaceholder()}</>}
    </div>
  )
};

export default DetailBulkMessage;
