import React, { useState } from 'react'
import { DARK_LOGO_HEADER, JUICY_HEADER_LOGO } from '../../lib/config'
import FigureImage from '../../components/image/figure-image'
import Accordion from '../../components/accordion'
import { useTheme } from 'react-jss'
import { LOGO_IMG } from '../../lib/config/logo'
import { useRouter } from 'next/router'
import AgencySelect from './AgencySelect'
import useLang from '../../hooks/language'
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import { getCookie } from '../../lib/session'


const AgencySideBar = () => {
  const theme = useTheme()
  const route = useRouter();
  const [lang] = useLang();
  let userType = getCookie("userType") || "3";
  let userRole = getCookie("userRole") || "ADMIN";
  const [isSelect, setIsSlect] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const otherMenuContent = [
    {
      label: "Agency Creators",
      isCreator: true,
      active: route.pathname === "/homePageAgency" ? true : false,
      url: "/homePageAgency"
    },
    {
      label: "Agency Employee",
      isCreator: true,
      url: "/agencyEmployee",
      active: route.pathname === "/agencyEmployee" ? true : false,
    },
    {
      label: "Agency Wallet",
      isCreator: true,
      url: ""
    },
    {
      label: "Agency Profile",
      isCreator: true,
      url: "/agencyProfile",
      active: route.pathname === "/agencyProfile" ? true : false,
    },
    {
      label: "My Profile",
      isCreator: true,
      url: "/agencyMyprofile",
      active: route.pathname === "/agencyMyprofile" ? true : false,
    }
  ]
  const togleHanler = () => {
    setDropdownVisible(false);
    setIsSlect(true);
  }
  return (
    <div className='bg-white vh-100 sideBorder'>
      <div className='col-12 pt-3 pb-4'>
        <FigureImage
          src={DARK_LOGO_HEADER}
          width="150"
          height='80'
          fclassname="m-0"
          id="logoUser"
          alt="logoUser"
        />
      </div>
      <div>
        <div className='col-12 divclass cursorPtr'>
          {userType === "3" && userRole === "ADMIN" ? <Accordion
            theme={theme}
            items={otherMenuContent}
            defaultExpanded
          >
            <span className='gradient-text bgColor'>Agency</span>
          </Accordion>
            :
            userType === "3" && userRole !== "ADMIN" &&
            <div className={`myProfile col-12 d-flex align-items-center position-relative ${isSelect ? "borderActive" : "borderInactive"}`}
              onClick={togleHanler}>
              <span className={`${isSelect ? "gradient-text" : "text-muted"} pl-3`}>{lang.myProfile}</span>
              <div className={`${!isSelect ? "arrow_on_down" : "arrow_on_up"} position-absolute`}>
                <ArrowForwardIosIcon className=" fntSz15 cursor-pointer" color='red' />
              </div>
            </div>
          }
        </div>
        <div className='bgColor mt-3'>
          <div className='col-12' onClick={() => setIsSlect(false)}>
            <AgencySelect
              dropdownVisible={dropdownVisible}
              setDropdownVisible={setDropdownVisible}
            />
          </div>

        </div>
      </div>
      <style jsx>{`
      :global(.MuiAccordion-root){
        background: #FFFFFF !important;
        border-radius: 33px !important;
        width: 100%;
      }
      .gradient-text {
        background-color: #f3ec78;
        background-image: linear-gradient(#FF71A4, #D33BFE);
        background-size: 100%;
        font-size:15px;
        text-align:left;
        -webkit-background-clip: text;
        -moz-background-clip: text;
        -webkit-text-fill-color: transparent; 
        -moz-text-fill-color: transparent;
    }
      :global(.MuiAccordion-root:active), :global(.MuiAccordion-root:focus){
        background: #FFFFFF !important;
      }
      :global(.MuiCollapse-wrapperInner ){
        background:#FFFFFF !important;
        border-radius: 33px !important;
        display:flex !important;
        flex-direction:cloumn !important;
        width:15vw !important;
      }
      :global(.heading){
        text-align:center !important;
        display:flex !important;
        align-item:center !important;
      }
      :global(.lableClass){
        color:#5F596B !important;
      }
      :global(.MuiAccordionSummary-root){
        border:2px solid #FE6FA6 !important;
      border-radius: 33px !important;
      }
      :global(.MuiAccordionSummary-root.Mui-expanded),
      :global(.Mui-expanded){
        min-height:0px !important;
        margin:0px 0px !important;
      }
      :global(.MuiIconButton-edgeEnd){
margin-right:0px !important;
      }
      :global(.MuiAccordionSummary-expandIcon){
        color:#000 !important;
      }
      :global(.heading){
        text-align:left !important;
      }
      :global(.MuiAccordionSummary-content.summary){
        justify-content:left !important;
      }
      :global(.MuiAccordionDetails-root.selectlable){
        background: #F6F6F6;
        color:#5F596B !important;
        border-radius:5px !important;
        width:13vw !important;
        padding:10px !important;
      }
      :global(.MuiCollapse-root){
        margin-top:2vh !important;
      }
      .sideBorder{
        border-right:1px solid #D7D7D7 ;
        width:21%;
        overflow-y:auto;
      }
      :global(.divclass .MuiCollapse-wrapperInner){
        padding-left:1vw;
      }
      .myProfile{
        width:20vw;
        height:7vh;
        border-radius:33px;
      }
      .borderActive{
        border:2px solid #FE6FA6;
      }
      .borderInactive{
        border:2px solid #D7D7D7;
      }
      .arrow_on_down{
        top:31%;
        transform: rotate(90deg) !important;
         left: 88.5%;
      }
      .arrow_on_up{
        top:31%;
        transform: rotate(270deg) !important;
         left: 88%;
      }
      `}</style>
    </div>
  )
}

export default AgencySideBar