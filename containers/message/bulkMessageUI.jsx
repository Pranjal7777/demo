import { useTheme } from "react-jss";
import { useSelector } from "react-redux";
import React, { useEffect, useState, useRef } from 'react';
import Route from "next/router";

import useLang from "../../hooks/language";
import isMobile from "../../hooks/isMobile";
import Icon from "../../components/image/icon";
import { close_drawer, close_progress, open_dialog, open_drawer, startLoader, startPageLoader, stopLoader, Toast } from '../../lib/global';
import {
  CALENDER,
  CHAT_PLAY,
  DELETE_SVG,
  DOLLAR_ICON_BG,
  IMAGE_LOCK_ICON,
  MESSAGE_PLACEHOLDER,
  NO_BULK_ICON,
  TEXT_PLACEHOLDER,
} from "../../lib/config";
import { getBulkMessages, unsendBulkMsg } from "../../services/bulkMessage";
import Img from "../../components/ui/Img/Img";
import { formatDate } from "../../lib/date-operation/date-operation";
import { s3ImageLinkGen } from "../../lib/UploadAWS/uploadAWS";
import NoChat from "./noChat";
import CustomDataLoader from "../../components/loader/custom-data-loading";
import PaginationIndicator from "../../components/pagination/paginationIndicator";
import { CHAT_EYE, UNLOCK_ICON, USER_LIST_AVATAR } from "../../lib/config/logo";
import { getExcerpt } from "../../redux/actions/chat/helper";
import Button from "../../components/button/button";
import { isAgency } from "../../lib/config/creds";
import { deleteBlkMsgSubject } from "../../lib/rxSubject";
import { bulkMessageStatus } from "../../lib/config/chat";
import { BarLoader } from "react-spinners";

const BulkMessageUI = (props) => {
  const [mobileView] = isMobile();
  const [lang] = useLang();
  const theme = useTheme();
  const bulkMsgRef = useRef(null);
  const bulkRxRef = useRef(null)

  // Local State
  const [allBulkMessages, setAllBulkMessages] = useState([]);
  const [selectionMsg, setSelectionMsg] = useState();

  // Pagination
  // const [pageCount, setPageCount] = useState(0);
  const [loader, setLoader] = useState(false);
  const [endPage, setEndPage] = useState(false);
  // const [flag,setFlag] = useState(false)

  // Redux State
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  useEffect(() => {
    if (props.bulkMsgListRef) {
      props.bulkMsgListRef.current = {
        refreshList: getBulkMessagesAPI
      }
    }
    close_progress();
    getBulkMessagesAPI(true);
  }, []);

  React.useEffect(() => {
    bulkRxRef.current = deleteBlkMsgSubject.subscribe((id) => {
      if (id) {
        setAllBulkMessages((prev) => {
          const allMsgs = [...prev]
          const replaceIndx = allMsgs.findIndex(f => f._id === id);
          if (replaceIndx !== -1) {
            let currMsg = { ...allMsgs[replaceIndx], status: bulkMessageStatus.UNSEND }
            allMsgs.splice(replaceIndx, 1, currMsg)
          }
          return [...allMsgs]
        })
      }
    })
    return () => {
      if (bulkRxRef.current) {
        bulkRxRef.current?.unsubscribe()
        bulkRxRef.current = undefined;
      }
    }
  }, [])

  useEffect(() => {
    if (props.flag) {
      getBulkMessagesAPI({});
      props.setFlag(false)
    }
  }, [props.flag])
  useEffect(() => {
    if (props.sortBy) {
      getBulkMessagesAPI(true);
      props.setPageCount(0)
    }
  }, [props.sortBy])

  useEffect(() => {
    return () => {
      props.setPageCount(0)
    }
  }, [])

  const getBulkMessagesAPI = async (isInitial = false) => {
    setLoader(true);
    return new Promise(async (resolve, reject) => {
      try {
        const payload = {
          limit: 10,
          offset: isInitial ? 0 : props.pageCount * 10,
        };
        if (isAgency()) {
          payload["userId"] = selectedCreatorId;
        }
        if (props.sortBy) {
          payload.sortBy = props.sortBy
        }

        const res = await getBulkMessages(payload);

        if (res.status === 200) {
          if (props.pageCount === 0 || isInitial) {
            setAllBulkMessages(res?.data?.data);
          } else {
            setAllBulkMessages([...allBulkMessages, ...res?.data?.data]);
          }

          props.setPageCount(props.pageCount + 1);
        } else if (res.status === 204) {
          setEndPage(true);
        }

        if (isInitial && res.data.data?.length && !mobileView) {
          if (props.bulkMsgDetailRef.current) {
            props.bulkMsgDetailRef.current.initializeMsg(res.data.data[0]);
            setSelectionMsg(res.data.data[0]._id);
          }
        }

        setLoader(false);
        resolve(res)
      } catch (err) {
        setLoader(false);
        stopLoader()
        // reject(err)
        console.error("ERROR IN getBulkMessagesAPI", err);
        Toast(lang.reportErrMsg, 'error')
      }
    })
  }

  const singleBulkMessageHandler = (message) => {
    if (mobileView) {
      open_drawer("singleBulkMessage", {
        message: message,
        close: () => close_drawer('singleBulkMessage'),
      },
        "right"
      )
    } else {
      if (props.bulkMsgDetailRef) {
        setSelectionMsg(message._id);
        props.bulkMsgDetailRef.current.initializeMsg(message)
      }
    }
  }

  const bulkmessageHandler = () => {
    mobileView
      ? open_drawer("bulkMessage", {
        close: () => close_drawer("bulkMessage"),
        onSuccess
      },
        "right"
      )
      // : open_dialog("bulkMessage", {})
      : console.log("bulkMessageDesktop")

  }

  const noBulkMsgPlaceholder = () => {
    return (<div className="py-3 d-flex align-items-center justify-content-center">
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

  const setCustomVhToBody = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vhCustom', `${vh}px`);
  };

  useEffect(() => {
    setCustomVhToBody();
    window.addEventListener('resize', setCustomVhToBody);

    return () => {
      window.removeEventListener('resize', setCustomVhToBody);
    };
  }, []);



  return (
    <div className='w-100 blk-wrapper' ref={bulkMsgRef}>
      {allBulkMessages && allBulkMessages.length
        ? allBulkMessages.map((message) =>
          <div className="d-flex flex-column" key={message?._id} style={{ borderBottom: "1.5px solid var(--l_border)" }}>
            <div className={`d-flex py-3 px-3 bulkMsgCard mx-2 mx-sm-0 cursorPtr ${message._id === selectionMsg && "gradient_active"}`}
              onClick={() => singleBulkMessageHandler(message)}
            >
              <div className='position-relative radius10 flex25' style={mobileView ? { width: "25%", aspectRatio: '1/1' } : { width: "25%", aspectRatio: '1/1' }}>
                {/* Text Post / Video Post / Image Post */}
                {message?.post?.postData.length && message.post.postData[0].type === 4
                  ? <div className="h-100 d-flex captionUL dv_border radius_8">
                    <Img
                      src={TEXT_PLACEHOLDER}
                      style={{ width: '100%' }}
                      alt="Text Post"
                      className="object-fit-cover radius_8"
                    />
                  </div>
                  : message?.post?.postData.length && message.post.postData[0].type === 2
                    ? <Img
                      src={s3ImageLinkGen(S3_IMG_LINK, message?.post?.postData[0]?.thumbnail, false, '25vw')}
                      alt="Video Post"
                      className="object-fit-cover radius_8 dv_base_bg_dark_color h-100 w-100"
                    />
                    : <Img
                      src={s3ImageLinkGen(S3_IMG_LINK, message?.post?.postData[0]?.url, false, '25vw')}
                      alt="Image Post"
                      className="object-fit-cover radius_8 dv_base_bg_dark_color h-100 w-100"
                    />
                }
                {message?.price
                  ? <div className='position-absolute'
                    style={{ top: 0, right: "5px" }}>
                    <Icon
                      icon={`${IMAGE_LOCK_ICON}#lock_icon`}
                      size={20}
                      color={theme.palette.white}
                      viewBox="0 0 68.152 97.783"
                    />
                  </div>
                  : ""
                }
                {message.post.postData.length && message?.post?.postData[0].type == 2
                  ? <div className='dv_set_mid_poAbs'>
                    <Img src={CHAT_PLAY} alt="play button" width="30px" />
                  </div>
                  : ""
                }
              </div>
              <div className='d-flex flex75 flex-column pl-2'>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="msgTitle mb-0">{message?.listTitle}</h6>
                  {
                    message?.status === bulkMessageStatus.UNSEND ? <div className="unsentChip"><div className="h-100 w-100 gradient_text text-center">{lang?.unsent}</div></div> : ""
                  }
                  {
                    message?.status === bulkMessageStatus.PENDING ? <div className="unsentChip"><div className="h-100 w-100 gradient_text text-center">{lang?.sending}</div></div> : ""
                  }
                  {/* <div className='fntSz13 light_app_text msgDate'>
                    {formatDate(message?.createdTs, "MMM DD YYYY")}
                  </div> */}
                </div>
                <div className="fntSz12">
                  {message?.post?.description ? message?.post?.description.length > 40 ? getExcerpt(message?.post?.description || '', 70).shortText : message?.post?.description : ''}
                </div>
                <div className="d-flex justify-content-between align-items-center ">
                  <div className="d-flex flex-row align-items-center light_app_text w-500">
                    <div className="d-flex align-items-center mr-2">
                      <Icon
                        icon={`${USER_LIST_AVATAR}#userListAvtar`}
                        width={18}
                        height={18}
                        color={"var(--l_light_app_text)"}
                        class='cursorPtr lineHeight'
                        viewBox="0 0 24 24"
                      />
                      <span className="mx-1 lineHeight" style={{ marginTop: '2px' }}>{message?.noOfUsers}</span>
                    </div>
                    <div className="d-flex align-items-end mr-2">
                      <Icon
                        icon={`${CHAT_EYE}#chatEye`}
                        width={18}
                        height={18}
                        color={"var(--l_light_app_text)"}
                        class='cursorPtr lineHeight'
                        viewBox="0 0 24 24"
                      />
                      <span className="mx-1 lineHeight" style={{ marginTop: '2px' }}>{message.readCount || 0}</span>
                    </div>

                    <div className="d-flex align-items-end mr-2">
                      <Icon
                        icon={`${UNLOCK_ICON}#unlockIcon`}
                        width={18}
                        height={18}
                        color={"var(--l_light_app_text)"}
                        class='cursorPtr lineHeight'
                        viewBox="0 0 24 24"
                      />
                      <span className="mx-1 lineHeight" style={{ marginTop: '2px' }}>{message?.noOfPurchases || 0}</span>
                    </div>

                    <div className='d-flex align-items-center'>
                      <Icon
                        icon={`${DOLLAR_ICON_BG}#dollarIconBg`}
                        width={18}
                        height={18}
                        color={"var(--l_light_app_text)"}
                        class='cursorPtr'
                        viewBox="0 0 24 24"
                      />
                      <span className='mx-1 lineHeight' style={{ marginTop: '2px' }}>
                        {message?.totalEarnings || 0}
                      </span>
                    </div>
                  </div>

                </div>
                <div className='fntSz13 light_app_text text-left mt-2 msgDate'>
                  {formatDate(message?.createdTs, "MMM DD YYYY hh:mm A")}
                </div>

              </div>

            </div>
            {
              message?.status == bulkMessageStatus.PENDING ? <BarLoader css={{ backgroundColor: 'var(--l_app_bg2)' }} height={'3px'} color="var(--l_base)" width={'100%'} /> : ''
            }
          </div>
        )
        : !loader || allBulkMessages?.length
          ? noBulkMsgPlaceholder()
          : ""
      }

      {loader
        ? <div className="text-center">
          <CustomDataLoader type="normal" isLoading={loader} />
        </div>
        : ""
      }

      {allBulkMessages && allBulkMessages.length
        ? <PaginationIndicator
          id="bulk-msg-pagination"
          // key={selectedFilter.value}
          elementRef={bulkMsgRef}
          totalData={allBulkMessages}
          totalCount={500}
          // items={users}
          pageEventHandler={() => {
            if (!endPage) {
              if (!loader) {
                setLoader(true);
                getBulkMessagesAPI();
              }
            }
          }}
        />
        : ""
      }

      {/* {mobileView ? <AddBulkMessage onSuccess={onSuccess} /> : ""} */}
      <style jsx>{`
        :global(.lineHeight) {
          line-height: 18px;
        }
        :global(.video_icon_msg) {
          position:absolute;
          top: 0; 
          left: 0;
          z-index:2;
        }
        .msgTitle {
          flex:1 1 100%;
        }
        .msgDate {
          flex:1 1 auto;
          white-space: nowrap
        }
        :global(.unsentChip) {
          padding: 2px 8px;
          width: fit-content;
          border-radius: 4px;
          background: linear-gradient(180deg, rgba(211, 58, 255, 0.2) 0%, rgba(255, 113, 164, 0.2) 100%);
          font-size: 12px;
        }
        .flexAuto {
          flex: 1 1 auto;
        }
        .flex25 {
          flex: 1 1 25%;
        }
        .flex75 {
          flex: 1 1 75%;
        }
      `}</style>
    </div>
  )
}

export default BulkMessageUI;
