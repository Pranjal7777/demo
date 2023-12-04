import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import parse from "html-react-parser";
import Router from "next/router";
import { useTheme } from "react-jss";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SearchIcon from "@material-ui/icons/Search";

import { guestLogin, startLoader, stopLoader, Toast } from "../lib/global";
import { getCookie, setCookie } from "../lib/session";
import { getFaqs ,getSubFaqs } from "../services/faqs";
import isMobile from "../hooks/isMobile";
import Wrapper from "../hoc/Wrapper"
import CustomHead from "../components/html/head";
import { WEB_LINK, backArrow_black } from "../lib/config";
import useLang from "../hooks/language";
import Image from "../components/image/image.jsx"
import Icon from "../components/image/icon";

const DesktopFooter = dynamic(() => import("../containers/timeline/desktop_footer"), { ssr: false });
const TimelineHeader = dynamic(() => import("../containers/timeline/timeline-header"), { ssr: false });
const MarkatePlaceHeader = dynamic(() => import("../containers/markatePlaceHeader/markatePlaceHeader"), { ssr: false });

function FAQ(props) {
  const { query } = props;
  const { tab = "timeline" } = query;
  const auth = getCookie("auth");
  const router = useRouter();
  const [mobileView] = isMobile();
  const homePageref = useRef(null);
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [validGuest, setValidGuest] = useState(false);
  const [activeNavigationTab, setActiveNavigationTab] = useState(tab);
  const [documents, setDocument] = useState([]);
  const [lang] = useLang();
  const {closeTrigger, back} = props;
  const theme = useTheme();
  const [isCreator, setIsCreator] = useState(false);
  const [usersType,setUsersType] = useState()
  const [subPoints,setSubPoints] = useState(null)

  useEffect(() => {
    if (!auth) {
      guestLogin().then((res) => {
        setCookie("guest", true);
        setValidGuest(true);
      });
    }
    handleGetFaqs();
    setToggleDrawer(true);
  }, []);

  let defaultUserType = +getCookie("userType") === 2 ? "CREATOR" : "USER" ;
  const handleGetFaqs = async (userType) => {
    startLoader()
    try {
      setUsersType(userType || defaultUserType )
      let response = await getFaqs(userType ? userType : defaultUserType);
      setDocument(response?.data?.data);
      stopLoader()
    } catch (e) {
      stopLoader()
      Toast(e.response.data.message, "error");
    }
  };

  const handleGetSubPointsFaqs = async ({_id,hasSubPoint}) => {
    if(!hasSubPoint) return 
    startLoader()
    try {
      if(!subPoints?.[_id]?.length){
        let response =await getSubFaqs(_id);
        setSubPoints(prev=>({...prev,[_id]:response?.data?.data}));
      }
      stopLoader()
    } catch (e) {
      stopLoader()
      Toast(e.response?.data?.message, "error");
    }
  };

  if (!validGuest && !auth) {
    return (
      <div>
        <CustomHead
          url={`${WEB_LINK}/faqs`}
          {...props.seoSettingData}
        ></CustomHead>
      </div>
    );
  }

  const handleCreatorButton = () => {
    setIsCreator(false);
  }

  const handleUserButton = () => {
    setIsCreator(true);
  }

  return (
    <Wrapper>
      {mobileView ? (
        <TimelineHeader
          setActiveState={(props) => {
            setActiveNavigationTab(props);
          }}
          scrollAndRedirect={async (e) => {
            let sc = await document.getElementById("top");
            sc.scrollIntoView({ behavior: "smooth" });
          }}
          {...props}
        />
      ) : (
        <MarkatePlaceHeader
          setActiveState={(props) => {
            setActiveNavigationTab(props);
          }}
          {...props}
        />
      )}
      <section className="web_main_div position-relative main-Section">
        <div className='d-flex flex-column align-items-center'>
          {mobileView && (
          <div className="col-12 d-flex position-absolute mt-2">
            <Icon
              icon={`${backArrow_black}#backArrow`}
              onClick={() => {
                closeTrigger && closeTrigger();
                back ? back() : Router.back();
              }}
              height="23"
              width="23"
              viewBox="0 0 64 64"
              alt="back-arrow"
              color="#fff"
            />
          </div>
          )}
          <div className='Dv_faqBgColor w-100 d-flex flex-column align-items-center justify-content-center'>
            <label className='white fntSz40 fntWeight700 textLabel pt-4'>{lang.faqs}</label>
            <div className='searchInputBox position-relative d-flex align-items-center justify-content-center'>
              <SearchIcon className='searchIcon fntlightGrey position-absolute fntSz19'></SearchIcon>
              <input className='searchInputField  w-100 h-100 fntlightGrey border-0 fntSz16 rounded-pill' type="text" placeholder={lang.search} />
            </div>
          </div>

          <div className='buttonGruop my-3 d-flex justify-content-between align-items-center'>
            <button onClick={()=>handleGetFaqs("CREATOR")} className={`formCreatorButton border rounded fntSz15 ${usersType === "CREATOR" ? 'buttonBackgroundColor white' : 'dv_base_color'}`}
            >{lang.fanzlyCreator}</button>
            <button onClick={()=>handleGetFaqs("USER")} className={`formUserButton rounded border fntSz15 ${usersType === "USER" ? 'buttonBackgroundColor white' : 'dv_base_color'}`}
            >{lang.fanzlyUser}</button>
          </div>

          <div className={`${mobileView ? "col-12" : "col-8"}`}>
            {documents && documents?.length > 0
              ? documents.map((item) => (
                <div className={`col-12 px-0 subscriptionSetting ${mobileView ? "pb-3" : ""}`} key={item._id}>
                  <Accordion >
                    <AccordionSummary
                      onClick={(e)=>handleGetSubPointsFaqs(item)}
                      expandIcon={<ExpandMoreIcon className="dv_appTxtClr_web mx-1" />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className="dv_appTxtClr">
                        <ul className='pl-3 dv_appTxtClr_web'>
                          <li className='pt-3 dv_appTxtClr_web fntSz15'>
                            {item.title}
                          </li>
                        </ul>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    {
                      item?.hasSubPoint ? <div className="col-12">
                        {subPoints?.[item?._id]?.map((item)=>{
                        return <Accordion key={item._id} >
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon className="dv_appTxtClr_web mx-1" />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography className="dv_appTxtClr">
                            <ul className='pl-3 dv_appTxtClr_web'>
                              <li className='pt-3 dv_appTxtClr_web fntSz15'>
                                {item.title}
                              </li>
                            </ul>
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Typography>
                            <p className='pl-3 dv_appTxtClr_web fntSz15'>
                              {item.htmlContent ? parse(item?.htmlContent) : ""}
                            </p>
                          </Typography>
                        </AccordionDetails>
                      </Accordion>
                      })}
                      </div>:
                    <Typography>
                        <p className='pl-3 dv_appTxtClr_web fntSz15'>
                          {item.htmlContent ? parse(item?.htmlContent) : ""}
                        </p>
                      </Typography>
                    }
                    </AccordionDetails>
                  </Accordion>
                </div>
              ))
              : ""}
          </div>
        </div>
      </section>

      {!mobileView && <DesktopFooter />}

      <style jsx>{`
      .web_main_div {
        padding-top: ${mobileView ? "2px" : ""};
        padding-bottom: ${mobileView ? "0" : "20vh"};
      }
      :global(.MuiAccordionDetails-root) {
        background-color: var(--l_profileCard_bgColor);
      }
      :global(.MuiPaper-elevation1) {
        box-shadow: none;
      }
      :global(.MuiPaper-root){ 
        background-color: var(--l_profileCard_bgColor);
      }
      .whiteBorderBtm{
        border-bottom: 1px dashed #b5b5b5;
      }
      :global(.MuiIconButton-root) {
        padding-top: 16px;
      }
      :global(.MuiIconButton-edgeEnd) {
        padding: 0px;
      }
      :global(.MuiAccordionSummary-root){
        background-color: var(--l_profileCard_bgColor);
      }
      :global(.MuiAccordionSummary-root.Mui-expanded) {
        background-color: var(--l_profileCard_bgColor);
        box-shadow: none;
      }
      :global(.MuiAccordion-rounded){
        background-color: var(--l_profileCard_bgColor);
      }
      :global(.MuiAccordion-rounded:last-child){
        background-color: var(--l_profileCard_bgColor);
      }
      .searchInputBox {
        width: ${mobileView ? "45vh" : "80vh"};
        height: 2.5rem;
      }
      .Dv_faqBgColor{
        height: ${mobileView ? "30vh" : "46vh"};
        line-height: ${mobileView ? "2" : "3"};
        background-color:var(--l_base)!important;
      }
      .buttonGruop{
        width: ${mobileView ? "89%" : "64%"};
      }
      .buttonBackgroundColor {
        background: ${theme.appColor};
        border: 1px solid ${theme.appColor};
      }
      `}</style>
    </Wrapper>
  );
}

FAQ.getInitialProps = async ({ ctx }) => {
  let { query = {}, req, res } = ctx;

  return {
    query: query,
  };
};

export default FAQ;
