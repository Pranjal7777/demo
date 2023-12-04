import React, { useEffect, useState } from 'react'
import { CROSS_SIMPLE } from '../../lib/config/profile'
import Button from '../../components/button/button'
import DVinputText from '../../components/DVformControl/DVinputText'
import useEmployee from './hook/useEmployee'
import { updateStatus } from '../../services/agency'
import { getCookie } from '../../lib/session'
import { Toast, close_dialog, open_dialog, startLoader, stopLoader } from '../../lib/global/loader'
import useAgencyCreatorList from './hook/useAgencyCreatorList'
import Icon from '../../components/image/icon'
import useLang from '../../hooks/language'
import { updateCreatorHandler } from '../../redux/actions/agency'
import { useDispatch } from 'react-redux'

const AssignEmployee = (props) => {
  const uId = getCookie("agencyId")
  const { searchText, setSearchText, setValue } = useEmployee();
  const { getCreatorList } = useAgencyCreatorList();
  const { selectedData, removeItem, creatorId } = props;
  const [select, setSelect] = useState(selectedData);
  const [lang] = useLang();
  const dispatch = useDispatch();
  const removeSelect = (id) => {
    setSelect(prevData => {
      const updatedData = prevData.filter(item => item._id !== id);
      return updatedData;
    });
    removeItem(id);
  }
  const filteredIds = select?.map(item => item._id);
  const handleAccept = () => {
    let payload = {
      agencyId: uId,
      agencyUserIds: filteredIds,
      action: "ACCEPTED",
      creatorId: creatorId
    }
    updateStatus(payload)
      .then((res) => {
        let response = res;
        if (response.status === 200) {
          Toast("Accepted");
          dispatch(updateCreatorHandler(creatorId))
        }
      })
      .catch((e) => {
        console.error("update error", e);
        Toast(e?.response?.data?.message, "error");
      })
  }

  const SearchData = () => {
    return (
      <div>
        {
          select?.length ? select?.map((data, index) => {
            return (
              <div className='d-flex flex-row justify-content-around col-12 align-items-center py-2 borderbottom' key={index}>
                <p className='text-app col-6 mb-0'>{data.firstName} {data.lastName}</p>
                <p className='text-muted col-6 m-0'>{data.email}</p>
                <p className='text-muted col-1 m-0' onClick={() => removeSelect(data._id)}><Icon
                  icon={`${CROSS_SIMPLE}#Icons_back`}
                  size={10}
                  class="pr-2 pointer marginL pb-1"
                  alt="cross icon"
                  viewBox="0 0 40 40"
                  color="var(--l_app_text)" /></p>
              </div>
            )
          })
            : <div style={{ height: "32vh" }} className='d-flex align-items-center justify-content-center'> <p className='mb-0'>{lang.noData}</p> </div>
        }
        <style jsx>{`
        input[type=checkbox] {
          position: relative;
          cursor: pointer;
     }
     input[type=checkbox]:before {
          content: "";
          display: block;
          position: absolute;
          width: 16px;
          height: 16px;
          top: 0;
          left: 0;
          border: 1px solid #BEBEBE;
          border-radius: 3px;
          background-color: white;
 }
     input[type=checkbox]:checked:after {
          content: "";
          display: block;
          width: 5px;
          height: 10px;
          border: solid #ff71a4;
          border-width: 0 2px 2px 0;
          -webkit-transform: rotate(45deg);
          -ms-transform: rotate(45deg);
          transform: rotate(45deg);
          position: absolute;
          top: 2px;
          left: 6px;
 }
 .borderBottom{
  border-bottom:1px solid #BEBEBE;
 }
        `}</style>
      </div>
    )
  }
  return (
    <div className='position-relative'>
      <div className='position-absolute' style={{ right: "3%", zIndex: "1", top: "5%" }}>
        <button
          style={{ fontSize: '20px' }}
          type="button"
          className="close custom_cancel_btn dv_appTxtClr text-app"
          data-dismiss="modal"
        >
          <Icon
            icon={`${CROSS_SIMPLE}#Icons_back`}
            size={25}
            class="pr-2 pointer marginL pb-1"
            alt="cross icon"
            viewBox="0 0 40 40"
            color="var(--l_app_text)"
            onClick={() =>
              close_dialog("assignEmployee")
            }
          />
        </button>
      </div>
      <div className='col-12 borderRadius justify-content-center align-items-center' style={{ width: "80vw" }}>
        <h4 className='text-app text-center py-3 '>
          {`${!props.isAdminInfo ? "Assign Employee" : "Change Employee"}`}
        </h4>
        <div className='col-12' >
          <div>
            <DVinputText
              className="form-control dv_form_control stopBack text-lowercase position-relative"
              placeholder="Search Employee name/Employee email"
              onClick={() =>
                close_dialog("assignEmployee")
              }
              value={searchText}
            />
            <div style={{ border: "1px solid #BEBEBE", borderRadius: "8px", height: "35vh", overflowY: "auto", overflowX: "hidden" }}>
              {SearchData()}
            </div>
          </div>
        </div>
        <div className='px-5 my-3'>
          <Button
            fclassname="font-weight-500 p-2 btnGradient_bg radius_22"
            onClick={() => open_dialog("confirmDialog", {
              title: "Assign Employee",
              subtitle: `Are you sure want to Accept @${props?.details?.username} ?`,
              yes: handleAccept,
            })}
        >
            Confirm & Accept
        </Button>
        </div>
      </div>
      <style jsx>{`
   
    :global(.buttonStyle){
      top:0.4rem !important;
      right:1.2rem !important;
      z-index:1 !important;
    }
    :global(.dv_form_control::placeholder) {
      font-size: 0.8rem !important;
      text-transform:capitalize !important;
      color: var(--l_light_grey1) !important;
    }
    .borderRadius{
      border-radius:18px;
    }
   
    :global(.borderbottom){
      border-bottom:1px solid var(--l_grey_border) ;
    }
    `}</style>
    </div>
  )
}

export default AssignEmployee