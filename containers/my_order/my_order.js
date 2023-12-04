import React, { useState, useEffect } from "react";
import moment from "moment";
import Wrapper from "../../hoc/Wrapper";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { NO_ORDER_PLACEHOLDER, ratingIcon, SPEAKER, videoOrderIcon } from "../../lib/config";
import CustomDataLoader from "../../components/loader/custom-data-loading";
import Image from "../../components/image/image";
import Router from "next/router";
import FigureCloudinayImage from "../../components/cloudinayImage/cloudinaryImage";
import { formatDate } from "../../lib/date-operation/date-operation";
import PageLoader from "../../components/loader/page-loader";
import Placeholder from "../profile/placeholder";
import useLang from "../../hooks/language";
import { useTheme } from "react-jss";
import Icon from "../../components/image/icon";
import Avatar from "@material-ui/core/Avatar";
import isMobile from "../../hooks/isMobile";
import { palette } from "../../lib/palette";
import OrderFilterMenu from '../../components/Drawer/myOrder/menu_items'
import { getCookie } from "../../lib/session";
import { handleShoutoutOrderCount } from "../../redux/actions/shoutout";
import { useDispatch, useSelector } from "react-redux";
import { handleContextMenu } from "../../lib/helper";
import CommonHeader from "../../components/commonHeader/commonHeader";

const MyOrder = (props) => {
  const [lang] = useLang();
  const theme = useTheme();
  const dispatch = useDispatch();
  const userType = getCookie("userType");
  const [mobileView] = isMobile();
  const [showLoader, setShowLoader] = useState(false);
  const { setPageCount, setPurchaseListOrder, selectedFilter, setSelectedFilter } = props
  const orderCount = useSelector((state) => state?.profileData?.orderCount);
  const filterOption = [
    { label: "ALL", value: 5 },
    { label: "REQUESTED", value: 1 },
    { label: "ACCEPTED", value: 2 },
    { label: "COMPLETED", value: 3 },
    { label: "CANCELLED", value: 4 },
    { label: "FAILED", value: 6 },
    { label: "REJECTED", value: 7 },
  ]

  useEffect(() => {
    if (!mobileView) {
      setShowLoader(true);
      setTimeout(() => {
        setShowLoader(false);
      }, 1000);
    }
    props.homePageref && props.homePageref.current.scrollTo(0, 0);
  }, []);

  const gotoDetailOrderPage = (order) => {
    props.isOrderPage
      ? Router.push(`/my-orders/orderdetail?orderId=${order._id}`)
      : Router.push(`/virtual-request/purchasedetail?orderId=${order._id}`);
  };

  const handleSelectedFilter = (value) => {
    selectedFilter !== value.label && setPurchaseListOrder([]);
    setPageCount(0)
    setSelectedFilter(value.label)
  }

  useEffect(() => {
    orderCount >= 0 && dispatch(handleShoutoutOrderCount(0));
  }, [])


  return (
    <Wrapper>
      <div id='order_page' className='w-100 overflow-auto' style={{height: "calc(var(--vhCustom, 1vh) * 100)"}}>
        <div className="sticky-top borderBtm">
          <CommonHeader
            title={props.pageTitle}
            filterList={filterOption}
            setSelectedFilterValue={(value) => handleSelectedFilter(value)}
          />
        </div>
        <div className="px-3 pb-3 position-relative">
          {props?.shoutoutOrderList && props?.shoutoutOrderList.length ? (
            props?.shoutoutOrderList.map((order, index) => (
              <div
                className="px-4 bg-light orderList mt-4 cursorPtr"
                onClick={() => gotoDetailOrderPage(order)}
              >
                {!order?.isViewed && <div className="notification-dot"></div>}
                <div
                  className="col-12 d-flex align-items-center py-3 px-0 px-sm-3 px-lg-0 cursorPtr"
                >
                  <div className="col p-0 ">
                    <div className="fntWeight600 pageBlackTextCss fntSz18 py-1">
                      #{order?._id}
                    </div>
                    <div className="fntlightGrey fntSz12">
                      {formatDate(order?.createdDate, "D MMM YYYY h:mm a")}
                    </div>
                  </div>
                  {order?.rating && <div className="d-flex col-auto px-0 flex-column justify-content-end pl-3">
                    <div className="col-auto d-flex align-items-center pr-0 statusInfo">
                      <Icon
                        icon={`${ratingIcon}#ratingIcon`}
                        width={15}
                        height={15}
                        unit="px"
                        style={{ marginBottom: "4px" }}
                        viewBox="0 0 21.491 20.439"
                      />
                      <p className="m-0 fntSz14 appTextColor font-weight-500">{order?.rating}</p>
                    </div>
                    {!props?.isOrderPage && <p className="m-0 fntSz12" style={{ color: "var(--l_breadcrum_deactive)" }}>{lang.youRated}</p>}
                  </div>}
                  <div className="col-auto pr-0">
                    <div>
                      {order?.orderType === "VIDEO_CALL" ? (
                        <Icon
                          icon={`${videoOrderIcon}#shoutvideoSVG`}
                          color={theme.appColor}
                          alt="No Like Post Placeholder SVG Image"
                          size={45}
                          viewBox="0 0 24 24"
                        />
                      ) : (
                        <Icon
                          icon={`${SPEAKER}#Group_56760`}
                          color={theme.appColor}
                          alt="No Like Post Placeholder SVG Image"
                          size={48}
                          viewBox="0 0 48 48"
                        />
                      )
                      }
                      {/* <ArrowForwardIosIcon
                      style={{ color: `${theme?.appColor}` }}
                    /> */}
                    </div>
                  </div>
                </div>
                <div
                  className={`col-12 d-flex align-items-center ${order?.orderType === "VIDEO_CALL" ? props?.isOrderPage ? "pb-1" : "pb-3" : "pb-3"} px-0`}
                // style={{
                //   borderBottom: `${!props.isOrderPage && "1px solid #c0c0c066"
                //     }`,
                // }}
                >
                  <div className="col-auto TOsortName fntWeight600 px-0 justify-content-center callout-none" onContextMenu={handleContextMenu}>
                    {order?.opponentUser?.profilePic ? (
                      <FigureCloudinayImage
                        publicId={order?.opponentUser.profilePic}
                        ratio={1}
                        className="order_and_profile mb-1"
                      />
                    ) : (
                      <Avatar
                        className="dv_profile_logo_requestShoutout mb-1 solid_circle_border"
                        style={{ width: "61px", height: "61px" }}
                      >
                        {order.opponentUser &&
                          order?.opponentUser?.firstName &&
                          order?.opponentUser?.lastName && (
                            <span className="initials_order">
                              {order?.opponentUser?.firstName[0] +
                                order?.opponentUser?.lastName[0]}
                            </span>
                          )}
                      </Avatar>
                    )}
                  </div>
                  <div className="col pr-0">
                    <div className="userName fntSz14 fntWeight600">
                      {`${order?.opponentUser?.username}` || `${order?.opponentUser?.firstName} ${order?.opponentUser?.lastName}` ||
                        "ANTHONY MOSIS"}
                    </div>
                    <div
                      className={`fntWeight700 ${order?.status == "REQUESTED" ||
                        order?.status == "ACCEPTED"
                        ? "statusPending"
                        : (["CANCELLED", "REJECTED", "FAILED"].includes(order?.status) || order?.isRefunded)
                          ? "statusCancelled"
                          : "statusComplete"
                        } statusBasic fntSz12`}
                    >
                      {order?.status || "PENDING"}
                    </div>
                  </div>
                  <div className="col-auto pr-0">
                    <div>
                      {/* Group_56760 */}
                    </div>
                  </div>
                  {!props?.isOrderPage && ["VIDEO_CALL", "VIDEO_SHOUTOUT"].includes(order?.orderType) && (["CANCELLED", "FAILED", "REJECTED"].includes(order?.status) || order?.isRefunded) && <div className="batchlevalgreen rounded-pill py-1 px-3 fntSz13 txt-heavy mr-4  font-weight-700">{order?.price?.currencySymbol} {order?.price?.price + order?.tax} REFUNDED</div>}
                  <div className="d-flex flex-column">
                    {/* {<div className="d-flex align-items-start" >
                    <Avatar
                      className="dv_profile_logo_requestShoutout mb-1 solid_circle_border mr-2"
                      style={{ width: "25px", height: "25px" }}
                    >
                      <span className="initials_order fntSz8">
                        {order?.bookingFor && !order?.bookingFor?.startsWith("6") ? (order?.bookingFor?.split(" ")?.length === 2 ? order?.bookingFor?.split(" ")[0][0] + order?.bookingFor?.split(" ")[1][0] : order?.bookingFor?.split(" ")[0][0]) :
                          order?.requestedFor?.fullName?.split(" ")[0][0] + order?.requestedFor?.fullName?.split(" ")[1][0] ||
                          order?.opponentUser?.firstName[0] +
                          order?.opponentUser?.lastName[0]}
                      </span>
                    </Avatar>
                    <p className="fntWeight600 userName fntSz14 m-0"><span className="fntSz14 fntlightGrey m-0">{lang.for}</span>  {order?.bookingFor && !order?.bookingFor.startsWith("6") ? order?.bookingFor : `${order?.requestedFor?.fullName || order?.opponentUser?.firstName + " " +
                      order?.opponentUser?.lastName} (Myself)`}</p>
                  </div>} */}
                    <div className="align-self-end text-primary fntSz13" style={{ color: "#0B44FF" }}>{lang.details}</div>
                  </div>
                </div>
                {!props.isOrderPage || ["VIDEO_CALL", "VIDEO_SHOUTOUT"].includes(order?.orderType) && (
                  <div className="col-12 d-flex align-items-center mt-3 pb-3 px-0">
                    {["VIDEO_CALL", "VIDEO_SHOUTOUT"].includes(order?.orderType) && (["CANCELLED", "FAILED", ""].includes(order?.status) || order?.isRefunded) && (props.isOrderPage ? <div className="batchleval rounded-pill py-2 px-3 fntSz10 txt-heavy   font-weight-700">MONEY REFUNDED BACK TO USER</div> : "")}
                    {/* <div className="col-auto d-flex justify-content-center p-0 FromsortName fntWeight600">
                    <div className="fntSz12">{`${order?.opponentUser?.firstName[0]}${order?.opponentUser?.lastName[0]}`}</div>
                  </div> */}
                    <div className="col pr-0">
                      <div className="fntSz14 pageBlackTextCss d-flex">
                        {/* For{" "}
                      <span
                        style={{ color: `${theme?.text}` }}
                        className="fntWeight600 ml-1"
                      >
                        {order?.orderType === "VIDEO_CALL" ? 'Video Call' : order?.requestedFor?.fullName || "Sam Alexander"}
                      </span> */}
                        {
                          order?.orderType === "VIDEO_CALL" && (
                            <>
                              <span className="ml-auto fntWeight600 text-capitalize">
                                {moment(order?.scheduleData?.scheduleDate, 'YYYY-MM-DD').format('on: Do MMMM YYYY')}
                              </span>
                            </>)
                        }
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center pt-5">
              {!props.handleDesktopLoader && !mobileView && <Placeholder
                style={{ height: "20%" }}
                pageName="orderList"
                placeholderImage={NO_ORDER_PLACEHOLDER}
                alt="Collection Cover Placeholder"
                label={lang.noOrderFound}
              />}
              {props.handleDesktopLoader && !mobileView && <div className="text-center pt-5 contentModddleCss">
                <CustomDataLoader type="ClipLoader" loading={true} size={60} />
              </div>}
            </div>
          )}
        </div>
      </div>
      <style jsx>{`
        .orderInfo {
          background: ${theme?.sectionBackground};
        }

        .notification-dot {
          width: 10px;
          height: 10px;
          background-color: var(--l_base);
          border-radius: 50%;
          display: inline-block;
          position: absolute;
          right: 1rem;
        }

        .pageBlackTextCss {
          color: ${theme?.text};
        }
        .orderList {
          border-radius: 8px;
          box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 15%);
          background: var(--l_section_bg) !important;
          border:1px solid var(--l_border);
        }

        .TOsortName {
          border-radius: 50%;
          height: 56px;
          width: 56px;
          align-items: center;
          display: flex;
          background: #e8ebfc;
          color: var(--l_base);
        }
        .userName {
          color: ${theme?.text};
        }

        statusBasic {
          font-size: 12px;
          font-weight: 600;
        }

        .statusPending {
          color:var(--l_base) !important;
        }

        .statusComplete {
          color: #09cc4d;
        }

        .statusCancelled {
          color: #ec1818;
        }

        .FromsortName {
          border-radius: 50%;
          height: 35px;
          width: 35px;
          align-items: center;
          display: flex;
          background: #e8ebfc;
          color: ${theme?.appColor};
        }

        .loaderCss{
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translateX(-50%) translateY(-50%);
        }
        .bottom_line{
          border-bottom : 1px solid ${palette.border_line};
          padding-bottom:30px!important;
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
        :global(.myAccount_sticky__section_header){
          top:0px !important;
        }
      `}</style>
    </Wrapper>
  );
};

export default MyOrder;
