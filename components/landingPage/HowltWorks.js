import React, { useState } from "react";
import { useSelector } from "react-redux";
import SimpleAccordion from "../accordion";
// import * as env from "../../lib/config";
// import BestBoatDeaals from "./ButtonComponent";
import Accordion from "../landingPageAccordion/index";
const HowItWorks = (props) => {
  const [index, setIndex] = useState(0);
  const isMobile = useSelector((state) => state.isMobile);
  return (
    <React.Fragment>
      {/* <BestBoatDeaals index={index} setIndex={setIndex}/> */}
      <div className="faq__section">
        <h2 className="museoSansFontFamily">Frequently Asked Questions</h2>
        {props?.FrequentlyAsked?.map((items) => {
          return (<div className="mb-3">
            <Accordion
              outsideText={items.outsideText}
              insideText1={items?.insideText1}
              insideText={items?.insideText}
              expanded={false}
            />
          </div>)
        })}
      </div>
      <style>
        {`
        .museoSansFontFamily{
          font-family: Roboto !important;
          margin-bottom: 32px;
          font-style: normal;
          font-weight: 400;
          font-size: 2.8vw;
          line-height: 100%;
          text-align: center;
        }
        @media(max-width:600px){
        .museoSansFontFamily{
          font-size: 1.4rem;
          text-align: center;
          margin-bottom: 25px;
          white-space: nowrap;
        }
        }
          `}
      </style>
    </React.Fragment>
  );
};
export default HowItWorks;
