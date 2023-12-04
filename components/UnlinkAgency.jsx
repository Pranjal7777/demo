import React from 'react'
import { close_dialog } from '../lib/global/loader'
import Button from './button/button'
import isMobile from '../hooks/isMobile'
import { CROSS_SIMPLE } from '../lib/config/profile'
import Icon from './image/icon'


const UnlinkAgency = (props) => {
  const [mobileView] = isMobile();
  return (
    <div className='position-relative pt-2'>
      <div className='position-absolute' style={{ right: "6%", zIndex: "1", top: "12%" }}>
        <button
          style={{ fontSize: '20px' }}
          type="button"
          className="close custom_cancel_btn dv_appTxtClr text-dark"
          data-dismiss="modal"
        >
          <Icon
            icon={`${CROSS_SIMPLE}#Icons_back`}
            size={15}
            class=" pointer marginL"
            alt="cross icon"
            viewBox="0 0 40 40"
            color="var(--l_app_text)"
            onClick={() => {
              close_dialog("UnlinkAgency")
            }}
          />
        </button>
      </div>
      {!mobileView ? <div className='col-12 borderRadius' style={{ height: "40vh", width: "80vw" }}>
        <div className='d-flex justify-content-center align-items-center'>
          <h4 className='text-app text-center pt-3 pb-3 col-8'>Unlink Agency</h4>
        </div>
        <div className='col-12 px-5'>
          <div>
            <p className='text-app mb-0 bold fntSz16'>Reason</p>
            <textarea
              className="w-100 dv_textarea_lightgreyborder mb-3 pt-2 pl-2 fntSz14"
              rows={4}
              // list="creators"
              placeholder={"Enter reason"} />
          </div>
          <div className='py-3'>
            <Button
              fclassname="font-weight-500 btnGradient_bg radius_22"
              onClick={props.yes}
            >
              Unlink Agency
            </Button>
          </div>
        </div>
      </div>
        :
        <div className='col-12 borderRadius mb-2'>
          <div className='d-flex justify-content-center align-items-center'>
            <h4 className='text-app text-center pt-3 pb-3 col-8'>Unlink Agency</h4>
          </div>
          <div className='col-12'>
            <div>
              <p className='resontext mb-1 bold fntSz16'>Reason</p>
              <textarea
                className="w-100 dv_textarea_lightgreyborder mb-3 pt-2 pl-2 fntSz14"
                rows={4}
                // list="creators"
                placeholder={"Enter reason"} />
            </div>
            <div className='py-3'>
              <Button
                fclassname="font-weight-500 btnGradient_bg radius_22"
                onClick={props.yes}
              >
                Unlink Agency
              </Button>
            </div>
          </div>
        </div>}
      <style jsx>{`
      .text-dark{
        color:#000 !important;
      }
      .resontext{
        color: #836B8A;

      }
      .dv_textarea_lightgreyborder{
        background:none !important;
        border: 1px solid #3C2342 !important;
            }
            .dv_textarea_lightgreyborder::placeholder{
              color:#3C2342 !important;
            }
      .borderRadius{
        border-radius:18px;
      }
      `}</style>
    </div>
  )
}

export default UnlinkAgency