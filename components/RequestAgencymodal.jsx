import React, { useState } from 'react'
import Button from './button/button'
import { CROSS_POSTSLIDER } from '../lib/config/profile'
import { Toast, close_dialog, close_drawer } from '../lib/global/loader'
import DVinputText from './DVformControl/DVinputText'
import { CLOSE_ICON_BLACK, CLOSE_ICON_WHITE } from '../lib/config'
import useAgencyList from '../hooks/useAgencyList'
import { sendAgencyRequest } from '../services/agencyList'
import Icon from './image/icon'
import isMobile from '../hooks/isMobile'
import useLang from '../hooks/language'

const RequestAgencymodal = (props) => {
  const { agencyBrandName, agencyEmail, agencyPhoneNumber, standardCommission, agencyId, agencyCountryCode } = props;
  const [commission, setCommision] = useState(standardCommission)
  const { getMyAgency, getAgency } = useAgencyList();
  const [desc, setDesc] = useState();
  const [mobileView] = isMobile()
  const [lang] = useLang();
  const requestAgency = async () => {
    let payload = {
      agencyId: agencyId,
      commissionPercentage: commission,
      description: desc
    }


    try {
      const res = await sendAgencyRequest(payload)
      if (res.status === 200) {
        Toast("Request Sent Sucessfully");
        getMyAgency();
        getAgency();
        !mobileView ? close_dialog("RequestAgencymodal") : close_drawer("RequestAgencymodal") 
      }
    } catch (err) {
      Toast(err?.response?.data.message, "error");
    }
  }
  return (
    <>
      <div className='position-relative pt-2'>
      <div className='position-absolute' style={{ right: "6%", zIndex: "1", top: "6%" }}>
        <button
          style={{ fontSize: '20px' }}
          type="button"
          className="close custom_cancel_btn dv_appTxtClr text-app"
          data-dismiss="modal"
        >
          <Icon
            icon={`${CLOSE_ICON_WHITE}#close-white`}
            viewBox="0 0 24 24"
            width="22"
            height="22"
              color="var(--l_app_text)"
            onClick={() => {
              !mobileView ? close_dialog("RequestAgencymodal") : close_drawer("RequestAgencymodal")
            }}
          />
        </button>
      </div>
        {!mobileView ? <div className='col-12  borderRadius mb-4' style={{ width: "80vw" }}>
          <div className='d-flex flex-column justify-content-center align-items-center'>
            <h4 className='text-app text-center pt-3  col-8'>Request Agency</h4>
            <p className='text-muted text-center fntSz12 col-9'>You need to contact the agency on the details below before you make a custom
              commission request</p>
          </div>
          <div className='col-12 px-5'>
            <h6 className='text-app'>Agency Details</h6>
            <div className='d-flex col-12 px-2 align-items-center justify-content-between flex-row bgHighlight'>
              <div className='bold fntSz16'>{agencyBrandName}</div>
              <div className='d-flex flex-row'>
                <p className='gradient-text fntSz13  mb-0 pr-1'>{agencyCountryCode} {agencyPhoneNumber}</p>
                <p className='gradient-text fntSz13  mb-0'>- {agencyEmail}</p>
              </div>
            </div>
            <div className='pt-3'>
              <p className='text-app bold'>Commission<span className='text-danger'>*</span></p>
              <div className='position-relative'>
                <DVinputText
                  className="form-control dv_form_control cursor-pointer commission"
                  placeholder={lang.enterCommision}
                  value={commission}
                  onChange={(e) => setCommision(e.target.value)}
                />
                <p className="arrow_on position-absolute text-app  cursor-pointer fntSz18 m-0 px-2" style={{ borderLeft: "2px solid var(--l_light_grey1)" }}>%</p>
              </div>
            </div>
            <div>
              <p className='text-app mb-0 bold'>Introduce Yourself</p>
              <textarea
                className="w-100 dv_textarea_lightgreyborder introduce mb-3 pt-2 pl-2 fntSz14"
                rows={4}
                // list="creators"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                placeholder={"Introduce Yourself"} />
            </div>
            <Button
              fclassname="font-weight-500 btnGradient_bg radius_22"
              isDisabled={!commission}
              onClick={requestAgency}
            >
              Request
            </Button>
          </div>
        </div>
          :
          <div className='col-12  borderRadius'>
            <div className='d-flex flex-column justify-content-center align-items-center'>
              <h4 className='text-app text-center pt-3  col-8'>Request Agency</h4>
              <p className='text-muted text-center fntSz12 col-12'>You need to contact the agency on the details below before you make a custom
                commission request</p>
            </div>
            <div className='col-12 mb-3'>
              <h6 className='text-app'>Agency Details</h6>
              <div className='d-flex col-12 flex-column align-items-start justify-content-center bgHighlight'>
                <div className=' bold fntSz17 text-app'>{agencyBrandName}</div>
                <div className='d-flex flex-row'>
                  <p className='gradient-text fntSz13  mb-0 pr-1'>{agencyCountryCode} {agencyPhoneNumber}</p>
                  <p className='gradient-text fntSz13  mb-0'>- {agencyEmail}</p>
                </div>
              </div>
              <div className='pt-3'>
                <p className='text-app bold'>Commission<span className='text-danger'>*</span></p>
                <div className='position-relative'>
                  <DVinputText
                    className="form-control dv_form_control cursor-pointer commission"
                    placeholder={lang.enterCommision}
                    value={commission}
                    onChange={(e) => setCommision(e.target.value)}
                  />
                  <p className="arrow_on position-absolute text-app  cursor-pointer fntSz18 m-0 px-2" style={{ borderLeft: "2px solid var(--l_light_grey1)" }}>%</p>
                </div>
              </div>
              <div>
                <p className='text-app mb-1 bold'>Introduce Yourself</p>
            <textarea
                  className="w-100 dv_textarea_lightgreyborder introduce mb-3 pt-2 pl-2 fntSz14"
              rows={4}
              // list="creators"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder={"Introduce Yourself"} />
          </div>
          <Button
                fclassname="font-weight-500 btnGradient_bg radius_22"
                btnSpanClass="text-white"
            isDisabled={!commission}
            onClick={requestAgency}
          >
            Request
          </Button>
        </div>
      </div>

        }
        <style jsx>{`
        .dv_textarea_lightgreyborder{
          background:var(--l_white) !important;
        }
        :global(.commission).dv_form_control{
          background:var(--l_app_bg) !important;
          border:1px solid var(--l_base) !important;
        }
        :global(.introduce).dv_textarea_lightgreyborder{
          background:var(--l_app_bg) !important;
          border:1px solid var(--l_base) !important;
        }
      .borderRadius{
        border-radius:18px;
      }
      
      .arrow_on{
             top: 10%;
                right:1%;
              }
      .bgHighlight {
        background: linear-gradient(102.83deg, rgba(254, 111, 166, 0.1) 0%, rgba(212, 60, 252, 0.1) 100%);
        height: 4rem;
        border-radius:12px;
      }
      .gradient-text {
               background-color: #f3ec78;
              background-image: linear-gradient(#FF71A4, #D33BFE) !important;
               background-size: 100%;
               font-size:15px;
               text-align:left;
               -webkit-background-clip: text;
               -moz-background-clip: text;
               -webkit-text-fill-color: transparent; 
               -moz-text-fill-color: transparent;
           }
      `}</style>
    </div>
    </>
  )
}

export default RequestAgencymodal