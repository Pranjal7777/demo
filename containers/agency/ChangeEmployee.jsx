import React, { useEffect, useState } from 'react'
import { CROSS_SIMPLE } from '../../lib/config/profile'
import Button from '../../components/button/button'
import DVinputText from '../../components/DVformControl/DVinputText'
import useEmployee from './hook/useEmployee'
import { updateEmployeeList, updateStatus } from '../../services/agency'
import { getCookie } from '../../lib/session'
import { Toast, close_dialog, open_dialog, startLoader, stopLoader } from '../../lib/global/loader'
import { useDispatch, useSelector } from 'react-redux'
import { getSelectedEmplyee } from '../../redux/actions/agency'
import Icon from '../../components/image/icon'

const ChangeEmployee = (props) => {
  const uId = getCookie("agencyId")
  const { searchText, setSearchText, setValue } = useEmployee();
  const { creatorId, employeeData, agencyUserIds } = props;
  const selectedData = useSelector((state) => state.selectedEmployee) || []
  const [select, setSelect] = useState([]);
  const dispatch = useDispatch()
  useEffect(() => {
    let assignEmployee = employeeData?.filter((employee) => {
      return agencyUserIds?.includes(employee._id);
    });
    dispatch(getSelectedEmplyee(assignEmployee))
  }, [])


  const removeSelect = (id) => {
    dispatch(getSelectedEmplyee(
      selectedData.filter(item => item._id !== id)
    ));
  }
  const filteredIds = selectedData?.map(item => item._id);
  const handleAccept = () => {
    let payload = {
      agencyId: uId,
      agencyUserIds: filteredIds,
      creatorId: creatorId
    }
    updateEmployeeList(payload)
      .then((res) => {
        let response = res;
        if (response.status === 200) {
          Toast("Accepted");
        }
        dispatch(getSelectedEmplyee([]))
        close_dialog()
      })
      .catch((e) => {
        console.error("update error", e);
        Toast(e?.response?.data?.message, "error");
      })
  }

  const handleChangeEmployee = () => {
    open_dialog("selectAgency", {
      selectedEmployee: true,
      select: selectedData
    })
  }
  const SearchData = () => {
    return (
      <div>
        {
          selectedData?.map((data, index) => {
            return (
              <div className='d-flex flex-row justify-content-around col-12 align-items-center py-2 borderbottom' key={index}>
                <p className='text-app col-6 mb-0'>{data.firstName} {data.lastName}</p>
                <p className='text-muted col-6 m-0'>{data.email}</p>
                <p className='text-muted col-1 m-0' onClick={() => removeSelect(data._id)}>
                  <Icon
                    icon={`${CROSS_SIMPLE}#Icons_back`}
                    size={15}
                    class=" pointer marginL"
                    alt="cross icon"
                    viewBox="0 0 40 40"
                    color="var(--l_app_text)" />
                </p>
              </div>
            )
          })
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
          className="close custom_cancel_btn dv_appTxtClr"
          data-dismiss="modal"
        >
          <Icon
            icon={`${CROSS_SIMPLE}#Icons_back`}
            size={25}
            class=" pointer marginL"
            alt="cross icon"
            color="var(--l_app_text)"
            onClick={() => {
              close_dialog("changeEmployee")
            }}
          />
        </button>
      </div>
      <div className='col-12 card_bg borderRadius justify-content-center align-items-center' style={{ height: "60vh", width: "80vw" }}>
        <h4 className='text-app text-center py-3 '>
          Change Employee
        </h4>
        <div className='col-12' >
          <div>
            <DVinputText
              className="form-control dv_form_control stopBack text-lowercase position-relative"
              placeholder="Search Employee name/Employee email"
              onClick={handleChangeEmployee}
              value={searchText}
            />
            <div style={{ border: "1px solid #BEBEBE", borderRadius: "8px", marginBottom: "2rem", height: "32vh" }}>
              {SearchData()}
            </div>
          </div>
        </div>
        <div className='px-5'>
          <Button
            fclassname="font-weight-500 p-2 btnGradient_bg radius_22"
            onClick={handleAccept}
          >
            Confirm & Accept
          </Button>
        </div>
      </div>
      <style jsx>{`
    :global(.form-group){
      margin:0 !important;
    }
    :global(.buttonStyle){
      top:0.4rem !important;
      right:1.2rem !important;
      z-index:1 !important;
    }
    :global(.dv_form_control::placeholder) {
      font-size: 0.8rem !important;
      text-transform:capitalize !important;
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

export default ChangeEmployee