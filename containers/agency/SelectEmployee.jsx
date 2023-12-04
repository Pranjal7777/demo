import React, { useEffect, useState } from 'react'
import { CROSS_SIMPLE } from '../../lib/config/profile'
import Button from '../../components/button/button'
import DVinputText from '../../components/DVformControl/DVinputText'
import useEmployee from './hook/useEmployee'
import { close_dialog, open_dialog } from '../../lib/global/loader'
import { useDispatch, useSelector } from 'react-redux'
import { getSelectedEmplyee } from '../../redux/actions/agency'
import PaginationIndicator from '../../components/pagination/paginationIndicator'
import Icon from '../../components/image/icon'

const SelectEmployee = (props) => {

  const { searchText, totalPostCount, setSearchText, handlePageEvent } = useEmployee();
  const dispatch = useDispatch()
  const [selectedData, setSelectedData] = useState(props.select || [])
  const apiData = useSelector((state) => state?.allEmployeeData);
  useEffect(() => {
    if (selectedData) {
      dispatch(getSelectedEmplyee(selectedData))
    }
  }, [selectedData.length])
  const handleCheckboxChange = (e, data) => {
    if (e.target.checked) {
      setSelectedData(prevData => [...prevData, data]);
    } else {
      setSelectedData(prevData => prevData.filter(item => item.email !== data.email));
    }
  };

  const removeItem = (id) => {
    setSelectedData(prevData => {
      const updatedData = prevData.filter(item => item._id !== id);
      return updatedData;
    });
  };
  const handleSelect = () => {
    if (props.selectedEmployee) {
      close_dialog("selectAgency")
    } else
    open_dialog("assignEmployee", {
      selectedData: selectedData,
      removeItem,
      ...props
    })
  }
  const SearchData = () => {
    return (
      <div>
        {apiData?.map((data, index) => {
          return (
            <div className='d-flex flex-row justify-content-around col-12 align-items-center py-2 borderbottom' key={index}>
              <div className='col-1'>
                <input
                  type="checkbox"
                  onChange={(e) => handleCheckboxChange(e, data)}
                  id={`vehicle${index}`}
                  name={`vehicle${index}`}
                  value="Bike"
                  checked={selectedData.some((item) => item._id === data._id)}
                />                </div>
              <p className='text-app col-5 mb-0'>{data.firstName} {data.lastName}</p>
              <p className='text-muted col-6 m-0'>{data.email}</p>
            </div>
          )
        })}
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
              close_dialog("selectAgency")
            }
          />
        </button>
      </div>
      <div className='col-12 card_bg borderRadius justify-content-center align-items-center' style={{ height: "60vh", width: "80vw" }}>
        <h4 className='text-app text-center py-3 '>
          Select Employee
        </h4>
        <div className='col-12' >
          <div>
            <DVinputText
              className="form-control dv_form_control stopBack text-lowercase position-relative"
              placeholder="Search Employee name/Employee email"
              onChange={(e) => { setSearchText(e.target.value) }}
              value={searchText}
            />
            {!props.isAdminInfo && <Button
              fclassname="col-1 p-1 position-absolute buttonStyle btnGradient_bg radius_22"
              btnSpanClass="fntSz10 px-1"
              onClick={handleSelect}
              isDisabled={!selectedData.length}
            >
              Done
            </Button>}
            <div id="searchData" style={{ border: "1px solid #BEBEBE", borderRadius: "8px", marginBottom: "6rem", height: "40vh", overflowY: "auto" }}>
              {SearchData()}
              <PaginationIndicator
                id="searchData"
                totalData={apiData}
                totalCount={totalPostCount}
                pageEventHandler={() => handlePageEvent(0)}
              />
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
    :global(.dv_form_control){
      background:var(--l_app_bg) !important;
      color:var(--l_app_text) !important;
    }
    :global(.form-group){
      margin:0 !important;
    }
    :global(.buttonStyle){
      top:0.4rem !important;
      right:1.2rem !important;
      z-index:1 !important;
    }
    :global(.dv_form_control:focus){
      background:var(--l_app_bg) !important;
      color:var(--l_app_text) !important;
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

export default SelectEmployee