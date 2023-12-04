import React from 'react'
import { open_dialog, open_drawer } from '../lib/global/loader'
import Button from './button/button'
import Image from './image/image'
import { s3ImageLinkGen } from '../lib/UploadAWS/s3ImageLinkGen'
import { useSelector } from 'react-redux'
import ReactCountryFlag from 'react-country-flag'
import useAgencyList from '../hooks/useAgencyList'
import { formatDate } from '../lib/date-operation/date-operation'
import isMobile from '../hooks/isMobile'

const AgencyTile = (props) => {
  const { data, isPast, isRequested, isCurrent, myAgency } = props;
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  const { findCountryCode, handleCancel } = useAgencyList();
  const [mobileView] = isMobile();
  const clickHanlder = (id) => {
    if (isCurrent) {
      if (!mobileView) {
      open_dialog("UnlinkAgency", {
        text: "Unlink Agency",
        btnText: "Unlink Agency",
        yes: () => handleCancel(id, "UNLINKED")
      })
      } else {
        open_drawer("UnlinkAgency", {
          text: "Unlink Agency",
          btnText: "Unlink Agency",
          yes: () => handleCancel(id, "UNLINKED")
        }, "bottom")
      }
    } else if (isRequested) {
      if (!mobileView) {
      open_dialog("confirmDialog", {
        title: "Cancel Request",
        subtitle: "Are you sure, you want to Cancel the Request ?",
        yes: () => handleCancel(id, "CANCELLED")
      })
      }
      else {
        open_drawer("confirmDrawer", {
          title: "Cancel Request",
          subtitle: "Are you sure, you want to Cancel the Request ?",
          yes: () => handleCancel(id, "CANCELLED")
        }, "bottom")
      }
    } else {
      if (!mobileView) {
      open_dialog("RequestAgencymodal", {
        agencyEmail: data.agencyEmail,
        agencyPhoneNumber: data.agencyPhoneNumber,
        standardCommission: data.standardCommission,
        agencyBrandName: data.agencyBrandName,
        agencyId: data._id,
        agencyCountryCode: data.agencyCountryCode
      })
      } else {
        open_drawer("RequestAgencymodal", {
          agencyEmail: data.agencyEmail,
          agencyPhoneNumber: data.agencyPhoneNumber,
          standardCommission: data.standardCommission,
          agencyBrandName: data.agencyBrandName,
          agencyId: data._id,
          agencyCountryCode: data.agencyCountryCode
        }, "bottom")
      }
    }
  }
  return (
    <div>
      {!mobileView ? <div className='col-12 pr-0 ml-2 mt-3 d-flex flex-row align-items-center  bg-Tile'>
        <div className='col-1 py-3 p-0'>
          <Image
            src={s3ImageLinkGen(S3_IMG_LINK, data.logo, 40, 188, 200)}
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "8px",
              objectFit: "cover"
            }}
          />
        </div>
        <div className='col-3 py-4 ml-4'>
          <h5 className='text-app pb-0 bold'>{data?.agencyLegalName}</h5>
          {!isPast ? <p className='mb-0 text-app d-flex flex-row fntSz12 bold'><span className='text-muted pr-2 font-weight-normal'>Brand </span> <span className='text-truncate'>{data.agencyBrandName}</span></p>
            : <p className='mb-0 text-app d-flex flex-row fntSz12 bold'><span className='text-muted font-weight-normal pr-2 text-truncate'>Standard Commission</span> {data?.standardCommission || data?.commissionPercentage}%</p>
          }        </div>
        <div className='col-4 py-4 ml-3'>
          <div className='d-flex flex-row pb-2'>
            <ReactCountryFlag
              countryCode={findCountryCode(data?.billingAddress?.country)}
              svg
              style={{
                height: '15px',
                width: "20px"
              }}
            />
            <p className='mb-0 text-app d-flex flex-row fntSz12 bold pl-2 pb-2'>{data?.billingAddress?.city}, {data?.billingAddress?.country}</p>
          </div>
          {!isPast ? <p className='mb-0 text-app d-flex flex-row fntSz12 bold'><span className='text-muted font-weight-normal pr-2'>Standard Commission</span> {data?.standardCommission || data?.commissionPercentage}%</p>
            : <p className='mb-0 text-app d-flex flex-row fntSz12 bold'><span className='text-muted font-weight-normal pr-2'>Start Date</span>{formatDate(data?.linkedTimestamps[data?.linkedTimestamps?.length - 1]?.startTs, "Do MMMM YYYY")} </p>
          }        </div>
        {!isPast ? <div className='col-4 py-4 mt-2 ml-4'>
          <Button
            type="submit"
            fclassname="font-weight-500 gradient_bg col-7 text-uppercase"
            cssStyles={{
              fontFamily: 'Roboto',
              fontSize: '13px'
            }}
            btnSpanClass="fntSz11"
            isDisabled={myAgency?.currentAgencyData?.length}
            id="logIn1"
            children={`${isCurrent ? "Unlink Agency" : isRequested ? "Cancel" : data.creatorAgencyRequest === "REQUESTED" ? "Requested" : "REQUEST"}`}
            onClick={() => clickHanlder(isRequested || isCurrent ? data.agencyId : data?._id)}
          />
        </div> :
          <div className='col-4 py-4  ml-2'>
            <p className='mb-0 text-app pb-3 d-flex flex-row fntSz12 bold'><span className='text-muted font-weight-normal pr-2'>Brand </span> {data.agencyBrandName}</p>
            <p className='mb-0 text-app d-flex flex-row fntSz12 bold'><span className='text-muted font-weight-normal pr-2'>End Date</span>{formatDate(data.endTs, "Do MMMM YYYY")} </p>
          </div>}
      </div>
        :
        <div className='col-11 pr-0 ml-2 mt-3 d-flex align-items-center flex-row bg-Tile'>
          <div className='col-3 p-0'>
            <Image
              src={s3ImageLinkGen(S3_IMG_LINK, data.logo, 40, 188, 200)}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "8px",
                objectFit: "cover"
              }}
            />
          </div>
          <div className={`${isPast ? "col-8 ml-3" : "col-5"} `}>
            <h6 className='text-app bold mb-0 text-capitalize'>{data?.agencyLegalName}</h6>
            <div className='d-flex flex-row'>
              <ReactCountryFlag
                countryCode={findCountryCode(data?.billingAddress?.country)}
                svg
                style={{
                  height: '15px',
                  width: "15px"
                }}
              />
              <p className='mb-0 text-app2 d-flex flex-row fntSz10 pl-2 pb-2 text-truncate'>{data?.billingAddress?.city}</p>
            </div>
            <p className='mb-0 text-app d-flex flex-row fntSz12 bold'><span className='text-app2 pr-2 font-weight-normal'>Brand </span> <span className='text-truncate text-capitalize'>{data.agencyBrandName}</span></p>
            <p className='mb-0 text-app d-flex flex-row fntSz12 bold'><span className='text-app2 font-weight-normal pr-2 text-truncate'>Commission</span> {data?.standardCommission || data?.commissionPercentage}%</p>
            {!!isPast &&
              <p className='mb-0 text-app d-flex flex-row fntSz12 bold'><span className='text-app2 font-weight-normal pr-2'>Start Date</span>{formatDate(data?.linkedTimestamps[data?.linkedTimestamps?.length - 1]?.startTs, "Do MMMM YYYY")} </p>}
            {!!isPast && <p className='mb-0 text-app d-flex flex-row fntSz12 bold'><span className='text-app2 font-weight-normal pr-2'>End Date</span>{formatDate(data.endTs, "Do MMMM YYYY")} </p>
            }
          </div>
          {!isPast ? <div className='col-6 ml-2'>
            <Button
              type="submit"
              fclassname="font-weight-500 gradient_bg col-7 px-0 py-2 text-uppercase"
              cssStyles={{
                fontFamily: 'Roboto',
                fontSize: '10px',
                borderRadius: '28px',
              }}
              isDisabled={myAgency?.currentAgencyData?.length}
              id="logIn1"
              children={`${isCurrent ? "Unlink" : isRequested ? "Cancel" : data.creatorAgencyRequest === "REQUESTED" ? "Requested" : "REQUEST"}`}
              onClick={() => clickHanlder(isRequested || isCurrent ? data.agencyId : data?._id)}
            />
          </div> :
            ""}
        </div>}
      <style jsx>{`
        .bg-Tile{
          background: var(--l_section_bg);
          border-radius:12px;
          height:${isPast ? "20vh" : "17vh"};
        }
        `}</style>
    </div >
  )
}

export default AgencyTile