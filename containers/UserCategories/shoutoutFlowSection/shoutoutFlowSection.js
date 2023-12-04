import React from "react";
import Icon from "../../../components/image/icon";
import Wrapper from "../../../hoc/Wrapper";
import useLang from "../../../hooks/language";
import { section1Icon, section2Icon, section3Icon, section4Icon, requestBooking, funBegins, processIcon, walletSection} from "../../../lib/config";
import { useTheme } from "react-jss";

const ShoutoutFlowSection = () => {
  const [lang] = useLang();
  const theme = useTheme();

  const shoutProfileSectionContent = [
    {
      sectionNumber: `${section1Icon}#section1`,
      sectionIcon: `${requestBooking}#requestBooking`,
      sectionLabel: lang.requestBooking,
      sectionContent: lang.requestBookingContent,
      numberViewbox: "0 0 23.228 70.451",
      iconViewbox: "0 0 36.078 45.871"
    },
    {
      sectionNumber: `${section2Icon}#section2`,
      sectionIcon: `${processIcon}#processIcon`,
      sectionLabel: lang.process,
      sectionContent: lang.processContent,
      numberViewbox:"0 0 31.24 73.451",
      iconViewbox: "0 0 36.078 45.871"
    },
    {
      sectionNumber: `${section3Icon}#section3`,
      sectionIcon: `${funBegins}#funBegins`,
      sectionLabel: lang.funBegins,
      sectionContent: lang.funBeginsContent,
      numberViewbox: "0 0 34.306 72.547",
      iconViewbox: "0 0 42.964 42.963"
    },
    {
      sectionNumber: `${section4Icon}#section4`,
      sectionIcon: `${walletSection}#walletSection`,
      sectionLabel: lang.happensSometime,
      sectionContent: lang.happensSometimeContent,
      numberViewbox: "0 0 38.018 73.418",
      iconViewbox: "0 0 47.552 41.715"
    },
  ];
  return (
    <Wrapper>
      <h6 className="mv_subHeader mb-0 mt-4">{lang.howDoesItWorksSection}</h6>
      <div className="row pt-2">
      {shoutProfileSectionContent.map((part, index)=>(
        <div className="col-3 col-sm-6 col-lg-3 d-flex px-0 align-items-center pt-3 pb-5" key={index}>
          <div className="col-auto">
            <Icon
              icon={part.sectionNumber}
              height={65}
              width={30}
              color={theme.text}
              class="pr-1 pb-1"
              viewBox={part.numberViewbox}
            />
          </div>
          <div className="col">
            <div className="m-0">
              <Icon
                icon={part.sectionIcon}
                height={65}
                width={30}
                color={theme.text}
                class="pr-1 pb-1"
                viewBox={part.iconViewbox}
              />
            </div>
            <p className="m-0 pt-0 pb-2 appTextColor fntSz16 font-weight-500">
              {part.sectionLabel}
            </p>
            <p className="m-0 py-2 fntSz14 sectionTextColor">
              {part.sectionContent}
            </p>
          </div>
        </div>
      ))}
      </div>
      <style jsx>{`
        .sectionTextColor {
          color: ${theme.type == "light" ? theme.text : "#BFBFBF"};
        }
      `}</style>
    </Wrapper>
  );
};

export default ShoutoutFlowSection;
