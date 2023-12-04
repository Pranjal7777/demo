import React from 'react';
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Router from "next/router";
import { useTheme } from "react-jss";
import useLang from '../../../hooks/language';
import FigureCloudinayImage from '../../../components/cloudinayImage/cloudinaryImage';
import { Avatar } from '@material-ui/core';
import Button from '../../../components/button/button';

const orderTemplate = ({ order }) => {
  const theme = useTheme();
  const [lang] = useLang();
  const isPurchasePage = order.requestType === 'purchase';

  const handleVideoCall = () => {
    Router.push('/conference');
  };


  return (
    <>
        <div className="align-items-center fntSz22 d-flex p-0">
        <ArrowBackIcon
            className="cursorPtr"
            onClick={() => Router.back()}
            style={{ color: `${theme?.text}` }}
        />
        <div className="fntWeight600 textColorCss pl-4">
            #{order?._id}
        </div>
        </div>
        <div className="mt-4 orderDetails">
        <div className="col-12 d-flex px-0">
            <div className="col fntSz16 textColorCss p-0">
            {isPurchasePage
                ? "Your Video Call Status"
                : "Video Call Request from"}
            </div>
            {!isPurchasePage && (
            <div className="col-auto earning fntWeight700 fntSz16 pr-0">
                {lang.myEarnings}{" "}
                {`${order?.price?.currencySymbol}${order?.finalAmount}`}
            </div>
            )}
        </div>
        <div className="col-12 d-flex pt-3 px-0">
            {isPurchasePage ? (
            <div className="col-auto p-0 TOsortName d-flex justify-content-center">
                {order?.creator?.profilePic ? (
                <FigureCloudinayImage
                    publicId={order?.creator.profilePic}
                    ratio={1}
                    className="order_and_profile mb-1"
                />
                ) : (
                <Avatar className="dv_profile_logo_requestShoutout mb-1 h-100 w-100 solid_circle_border">
                    {order.creator &&
                    order?.creator?.firstName &&
                    order?.creator?.lastName && (
                        <span className="initials_order">
                        {order?.creator?.firstName[0] +
                            order?.creator?.lastName[0]}
                        </span>
                    )}
                </Avatar>
                )}
            </div>
            ) : (
            <div className="col-auto p-0 TOsortName d-flex justify-content-center">
                {order?.user?.profilePic ? (
                <FigureCloudinayImage
                    publicId={order?.user?.profilePic}
                    ratio={1}
                    className="order_and_profile mb-1"
                />
                ) : (
                <Avatar
                    className="dv_profile_logo_requestShoutout mb-1 solid_circle_border"
                    style={{ width: "61px", height: "61px" }}
                >
                    {order?.user && (
                    <span className="initials_order">
                        {order?.user?.firstName[0] +
                        order?.user?.lastName[0]}
                    </span>
                    )}
                </Avatar>
                )}
            </div>
            )}
            <div className="col-auto d-flex flex-column justify-content-between">
            <div className="d-flex px-0">
                {isPurchasePage ? (
                <div className="fntWeight800 textColorCss">
                    {order?.creator?.firstName} {order?.creator?.lastName}
                </div>
                ) : (
                <div className="fntWeight800 textColorCss">
                    {order?.user ? `${order?.user?.firstName} ${order?.user?.lastName}` : order?.requestedFor?.fullName}
                </div>
                )}
                <div className="pl-3 textColorCss">
                {order?.price?.currencySymbol}
                {isPurchasePage ? order?.price?.price : order?.finalAmount}
                </div>
            </div>
            {isPurchasePage && (
                <div className="d-flex align-items-center px-0">
                <div className="reqFor">{lang.RequestedFor}</div>
                <div className="reqUser pl-4 textColorCss">
                    {order?.requestedFor?.fullName}
                </div>
                </div>
            )}
            </div>
            <div
            className="col pr-0 d-flex"
            style={{ justifyContent: "flex-end" }}
            >
            <div className="statusInfo fntWeight500">
                <p className="mb-0 statusDet">{order?.status}</p>
            </div>
            </div>
        </div>
        </div>


        <div className="pt-3">
            <Button
                type="button"
                cssStyles={theme.blueBorderButton}
                onClick={handleVideoCall}
            >
                {isPurchasePage ? 'Join Call' : 'Start Call' }
            </Button>
        </div>
        <style jsx>
            {`
            .orderDetails {
                border-radius: 8px;
                box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 15%);
                padding: 30px 22px;
                background: ${theme?.background};
              }
            :global(.textColorCss) {
                color: ${theme?.text};
              }
            :global(.earning) {
            color: ${theme?.appColor};
            }
    
            .reqFor {
            color: #b6b8ce;
            font-size: 12px;
            }
    
            .reqUser {
            font-size: 14px;
            font-weight: 500;
            }
            .statusInfo {
                display: flex;
                align-items: flex-end;
                justify-content: flex-end;
              }

            .statusDet {
                border: 1px solid #4918ec;
                padding: 0px 5px;
                border-radius: 3px;
                font-size: 14px;
                font-weight: 600;
                color: #4918ec;
                box-shadow: 0px 1px 1px #927ed4;
            }
            
            `}
        </style>
    </>
  )
}

export default orderTemplate;