import React from "react";
import Wrapper from "../../hoc/Wrapper";
import useLang from "../../hooks/language";
import { useTheme } from "react-jss";
import isMobile from "../../hooks/isMobile";

const InfoTab = () => {
  const [lang] = useLang();
  const theme = useTheme();
  const [mobileView] = isMobile();


  return (
    <Wrapper>

      {/* date of birthday */}
      <div className={`${mobileView ? "p-2" : ""}`}>
        <div className={`col-12 d-flex py-3 px-1 ${mobileView ? "mv_subPlanCss rounded-3" : "subPlanCss"}`}>
          <div className="col-6">
            <div className="appTextColor fntWeight700 fntSz20">{lang.dateOfBirth} :</div>
          </div>
          <div className={`col-6 ${mobileView ? "d-flex justify-content-end" : ""}`}>
            <div className="appTextColor align-items-center">12/02/2022</div>
          </div>
        </div>

        {/* Language */}
        <div className={`col-12 d-flex py-3 px-1`}>
          <div className="col-6">
            <div className="appTextColor fntWeight700 fntSz20">{lang.language} :</div>
          </div>
          <div className={`col-6 ${mobileView ? "d-flex justify-content-end" : ""}`}>
            <div className="appTextColor align-items-center">English / spanish</div>
          </div>
        </div>

        {/* Orientation */}
        <div className={`col-12 d-flex py-3 px-1 ${mobileView ? "mv_subPlanCss" : "subPlanCss"}`}>
          <div className="col-6">
            <div className="appTextColor fntWeight700 fntSz20"> {lang.orientation} :</div>
          </div>
          <div className={`col-6 ${mobileView ? "d-flex justify-content-end" : ""}`}>
            <div className="appTextColor align-items-center">Straight</div>
          </div>
        </div>

        {/* Gender */}
        <div className={`col-12 d-flex py-3 px-1`}>
          <div className="col-6">
            <div className="appTextColor fntWeight700 fntSz20">{lang.gender} :</div>
          </div>
          <div className={`col-6 ${mobileView ? "d-flex justify-content-end" : ""}`}>
            <div className="appTextColor align-items-center">Female</div>
          </div>
        </div>

        {/* Breast size */}
        <div className={`col-12 d-flex py-3 px-1 ${mobileView ? "mv_subPlanCss" : "subPlanCss"}`}>
          <div className="col-6">
            <div className="appTextColor fntWeight700 fntSz20">{lang.breastSize} :</div>
          </div>
          <div className={`col-6 ${mobileView ? "d-flex justify-content-end" : ""}`}>
            <div className="appTextColor align-items-center">F</div>
          </div>
        </div>

        {/* Height */}
        <div className={`col-12 d-flex py-3 px-1`}>
          <div className="col-6">
            <div className="appTextColor fntWeight700 fntSz20">{lang.height} :</div>
          </div>
          <div className={`col-6 ${mobileView ? "d-flex justify-content-end" : ""}`}>
            <div className="appTextColor align-items-center">148 lbs</div>
          </div>
        </div>

        {/* Weight */}
        <div className={`col-12 d-flex py-3 px-1 ${mobileView ? "mv_subPlanCss" : "subPlanCss"}`}>
          <div className="col-6">
            <div className="appTextColor fntWeight700 fntSz20">{lang.weight} :</div>
          </div>
          <div className={`col-6 ${mobileView ? "d-flex justify-content-end" : ""}`}>
            <div className="appTextColor align-items-center">5'9"</div>
          </div>
        </div>
        <style jsx>{`
        .subPlanCss {
          background-color: ${theme.type == "light" ? "#fff" : "#424242"};
          border-radius: 5px;
        }
        .mv_subPlanCss{
          background-color: ${theme.type == "light" ? "#f1f1f6" : "#2e2e2e"};
          border-radius: 5px;
          padding : 5vw
        }
        `}</style>
      </div>
    </Wrapper>
  );
};

export default InfoTab;
