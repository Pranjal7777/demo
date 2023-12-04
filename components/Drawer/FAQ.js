import React, { useState, useEffect } from "react";
import useLang from "../../hooks/language";
// Asstes
import * as env from "../../lib/config";
import {
  backNavMenu,
  Toast,
} from "../../lib/global";
import { getSubFaqs } from "../../services/faqs";
import parse from "html-react-parser";
import isMobile from "../../hooks/isMobile";
import dynamic from "next/dynamic";
import Wrapper from "../../hoc/Wrapper";
import CustomDataLoader from "../loader/custom-data-loading";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SearchIcon from "@material-ui/icons/Search";
import { getCookie, setCookie } from "../../lib/session";
import CustomHead from "../../components/html/head";
import { WEB_LINK } from "../../lib/config";
import { getFaqs } from "../../services/faqs";
import { useTheme } from "react-jss";
import { guestLogin } from "../../lib/global/guestLogin";

const Header = dynamic(() => import("../header/header"), { ssr: false })
const Img = dynamic(() => import("../ui/Img/Img"), { ssr: false })

export default function FAQ(props) {
  const [lang] = useLang();
  const {
    FaqList,
    icon,
    title,
    back,
    subpoints,
  } = props;
  const [currentScreen, setCurrentScreen] = useState();
  const [dvLoader, setDvLoader] = useState(false)
  const [mobileView] = isMobile();
  const [documents, setDocument] = useState([]);
  const auth = getCookie("auth");
  const [validGuest, setValidGuest] = useState(false);
  const theme = useTheme();
  const [searchValue, setSearchValue] = useState("")
  const [subPoints, setSubPoints] = useState(null)
  const [value, setValue] = useState("");
  let defaultUserType = +getCookie("userType") === 2 ? "CREATOR" : "USER";

  useEffect(() => {
    setSearchValue("");
    setValue("");
    props.homePageref && props.homePageref.current.scrollTo(0, 0);
    if (!auth) {
      guestLogin().then((res) => {
        setCookie("guest", true);
        setValidGuest(true);
      });
    }
    handleGetFaqs(defaultUserType);
  }, []);

  const handleGetFaqs = async () => {
    setDvLoader(true);
    try {
      let response = await getFaqs(defaultUserType);
      setDocument(response?.data?.data);
      setDvLoader(false);
    } catch (e) {
      setDvLoader(false);
      Toast(e?.response?.data?.message, "error");
    }
  };

  const handleGetSubPointsFaqs = async ({ _id, hasSubPoint }) => {
    if (!hasSubPoint) return
    try {
      if (!subPoints?.[_id]?.length) {
        let response = await getSubFaqs(_id);
        setSubPoints(prev => ({ ...prev, [_id]: response?.data?.data }));
      }
    } catch (e) {
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

  const searchItem = (searchValue) => {
    const a = documents?.filter((item) => item.title.toLowerCase().includes(searchValue.toLowerCase()))
    setSearchValue(a);
    setValue(searchValue);
  }

  return (
    <Wrapper>
      <div className="col-12 px-md-0 h-100 faqMainSection">
        {mobileView ? (
          <div className="row m-0">
            <Header
              title={title ? title : lang.faqs}
              back={() => props.onClose()}
              icon={icon}
            />
          </div>
        ) : (
          <div className="d-flex align-items-center myAccount_sticky__section_header">
            {subpoints ? (
              <Img
                src={env.backArrow_black}
                onClick={() => {
                  back ? back() : backNavMenu(props);
                }}
                className="backArrow"
                alt="Back Arrow in Black"
              />
            ) : (
              ""
            )}
          </div>
        )}
        <div className='d-flex flex-column align-items-center overflowY-auto' style={{ maxHeight: mobileView ? "calc( var(--vhCustom, 1vh) * 100)" : "" }}>
          <div className='w-100 d-flex flex-column pb-3'>
            <h4 className=' mb-3 sectionHeading'>{lang.faqs}</h4>
            <div className='position-relative d-flex align-items-center justify-content-center mt-4 pt-2'>
              <SearchIcon style={{ left: "15px" }} className='searchIcon position-absolute fntSz19 light_app_text'></SearchIcon>
              <input value={value} className='searchInputField rounded-pill w-100' type="text" placeholder={lang.search} onChange={(e) => searchItem(e.target.value)} />
            </div>
          </div>

          <div className={`w-100 radius_12 px-0 ${mobileView ? "" : "overflow-hidden"}`} style={{ background: theme?.dialogSectionBg }}>
            {searchValue && searchValue?.length > 0
              ? searchValue.map((item) => (
                <div className='col-12 px-0 borderBtm' key={item._id}>
                  <Accordion >
                    <AccordionSummary
                      onClick={(e) => handleGetSubPointsFaqs(item)}
                      expandIcon={<ExpandMoreIcon className="dv_appTxtClr_web mx-1" />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className="dv_appTxtClr">
                        <ul className='dv_appTxtClr_web'>
                          <li className='dv_appTxtClr_web fntSz15'>
                            <span className="dotStyle"></span>
                            {item.title}
                          </li>
                        </ul>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      {
                        item?.hasSubPoint ? <div className="col-12">
                          {subPoints?.[item?._id]?.map((item) => {
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
                                  <p className='px-3 dv_appTxtClr_web fntSz15'>
                                    {item.htmlContent ? parse(item?.htmlContent) : ""}
                                  </p>
                                </Typography>
                              </AccordionDetails>
                            </Accordion>
                          })}
                        </div> :
                          <Typography>
                            <p className='px-3 dv_appTxtClr_web fntSz15 innerHtmlSection'>
                              {item.htmlContent ? parse(item?.htmlContent) : ""}
                            </p>
                          </Typography>
                      }
                    </AccordionDetails>
                  </Accordion>
                </div>
              ))
              : documents?.map((item) => (
                <div className='col-12 px-0 borderBtm' key={item._id} >
                  <Accordion >
                    <AccordionSummary
                      onClick={(e) => handleGetSubPointsFaqs(item)}
                      expandIcon={<ExpandMoreIcon className="dv_appTxtClr_web mx-1" />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className="dv_appTxtClr">
                        <ul className='dv_appTxtClr_web'>
                          <li className='dv_appTxtClr_web fntSz15'>
                            <span className="dotStyle"></span>
                            {item.title}
                          </li>
                        </ul>
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails classes={{ width: "100%" }}>
                      {
                        item?.hasSubPoint ? <div className="col-12">
                          {subPoints?.[item?._id]?.map((item) => {
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
                                  <p className='px-3 dv_appTxtClr_web fntSz15 w-100'>
                                    {item.htmlContent ? parse(item?.htmlContent) : ""}
                                  </p>
                                </Typography>
                              </AccordionDetails>
                            </Accordion>
                          })}
                        </div> :
                          <Typography>
                            <p className='px-3 dv_appTxtClr_web fntSz15 w-100 innerHtmlSection'>
                              {item.htmlContent ? parse(item?.htmlContent) : ""}
                            </p>
                          </Typography>
                      }
                    </AccordionDetails>
                  </Accordion>
                </div>
              ))}
          </div>

        </div>
      </div>

      {dvLoader
        ? (
          <div className="d-flex align-items-center justify-content-center h-100 profileSectionLoader">
            <CustomDataLoader type="ClipLoader" loading={dvLoader} size={60} />
          </div>
        )
        : ""}

      <style jsx>
        {`
          :global(.faqMainSection .MuiCollapse-wrapperInner){
            width:100% !important;
            background: none!important;
          }
          .backArrow {
            width: 1.244vw;
            margin-right: 0.366vw;
            cursor: pointer;
          }
          .whiteBorderBtm{
            border-bottom: 1px dashed #b5b5b5;
          }
          :global(.faqMainSection .MuiAccordionSummary-root) {
            background: none !important;
          }
          :global(.faqMainSection .MuiAccordionDetails-root) {
            background:none !important;
            padding: 0px !important;
          }
          :global(.faqMainSection .MuiAccordionSummary-content) {
            margin: 0px !important;
          }
          :global(.faqMainSection .MuiAccordionSummary-content ul) {
            margin: 0px !important;
          }
          :global(.faqMainSection .MuiPaper-elevation1) {
            box-shadow: none !important;
          }
          :global(.faqMainSection .MuiPaper-root > div){ 
            background: none!important;
            margin: 0px !important;
          }
          :global(.faqMainSection .MuiAccordionSummary-content.Mui-expanded) {
            margin ${mobileView ? "1px 0px" : ""};
          }
          .textLabel{
            padding-top: ${mobileView ? "4rem" : ""};
          }
          :global(.faqMainSection .MuiSvgIcon-root)
          {
            left:22px;
          }
          .buttonBackgroundColor {
            background: ${theme.appColor} !important;
            border: 1px solid ${theme.appColor} !important;
          }
          :global(.faqMainSection .MuiSvgIcon-root){
            left:5px;
          }
          :global(.faqMainSection .MuiIconButton-root) {
            padding: 15px 0px !important;
          }
          :global(.faqMainSection .MuiAccordion-root:active, .MuiAccordion-root:focus) {
            background: none !important;
          }
          :global(.faqMainSection .searchInputField){
            padding: 0.7em 3em;
            color: var(--l_app-text);
            border: 1px solid var(--l_border) ;
            background: var(--l_section_bg) ;
          }
          :global(.faqMainSection .searchInputField::placeholder){
            color: var(--l_light_app_text);
          }
          :global(.faqMainSection .MuiAccordion-root){
            background: none !important;
          }
          .dotStyle{
            background: var(--l_linear_btn_bg);
            display: inline-block;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin-right: 8px;
          }
          li {
            list-style: none;
          }
          :global(.innerHtmlSection ul) {
            margin: 0px 15px !important;
          }
        `}
      </style>
    </Wrapper>
  );
}

FAQ.getInitialProps = async ({ ctx }) => {
  let { query = {}, req, res } = ctx;

  return {
    query: query,
  };
};