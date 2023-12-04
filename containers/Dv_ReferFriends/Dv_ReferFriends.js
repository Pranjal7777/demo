import React, { useEffect , useState } from "react";
import Wrapper from "../../hoc/Wrapper";
import useLang from "../../hooks/language";
import useProfileData from "../../hooks/useProfileData";
import CustomDataLoader from "../../components/loader/custom-data-loading";
import * as env from "../../lib/config";
import { close_dialog, open_dialog, Toast } from "../../lib/global";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Img from "../../components/ui/Img/Img";
import { useTheme } from "react-jss";
import Button from "../../components/button/button";
import isMobile from "../../hooks/isMobile";
import Link from "next/link";
import { getBitlyUrl } from "../../services/assets";
import {WEB_LINK} from "../../lib/config/creds";
import { getCookie } from "../../lib/session";

export default function Dv_ReferFriends(props) {
  const [lang] = useLang();
  const [profile] = useProfileData();
  const [sharedUrl, setSharedUrl] = useState();
  const theme = useTheme();
	const [showLoader, setShowLoader] = useState(false);
  const [mobileView] = isMobile();
  const userType = getCookie("userType");

  useEffect(() => {
    if(!mobileView){
			setShowLoader(true);
			setTimeout(() => {
			  setShowLoader(false);
			}, 1000);
		}
    props.homePageref && props.homePageref.current.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    getBitlyUrl(
      `${mobileView
        ? `${WEB_LINK}/signup-as-user?type=${userType == 2 ? "model" : "user"}&referId=${profile.referralCode}&referralSource=copyPaste`
        : `${WEB_LINK}/signup-as-user?referId=${profile.referralCode}&referralSource=copyPaste`
      }`
      ).then((url) => {
        setSharedUrl( url );
      })
      .catch((err) => console.error(err));
    }, []);
    
const handleSharePost = () => {
    open_dialog("SHARE_REFER", {
      shareType: "referFren",
      back: () => close_dialog("SHARE_REFER"),
    },
      "bottom"
    );
  };

  return (
    <Wrapper>
      <h5 className="content_heading px-1 myAccount_sticky__section_header sectionHeading">
        {lang.referYourFriends}
      </h5>
      <div className="col-12 text-center">
        <div className="d-flex align-items-center justify-content-center">
          <div>
            <Img src={env.Refer_Frens_Placeholder} height={170}/>
            <p className="fntSz14 referMsg">
              {lang.referralMsg}
            </p>

            <CopyToClipboard
              text={profile.referralCode}
              onCopy={() => Toast(lang.codeCopied, "success")}
            >
              <p className="referralCode">{profile.referralCode}</p>
            </CopyToClipboard>
            <span className="copyCode">{lang.codeCopy}</span>
          </div>
        </div>
        {sharedUrl &&  <div className="pt-2 d-flex justify-content-center align-items-center flex-row flex-nowrap">
            <span className="pr-1">Link -</span>
            <CopyToClipboard
              text={sharedUrl}
              onCopy={() => Toast(lang.codeCopied, "success")}
            >
              <div className="dv_base_color cursorPtr">{sharedUrl}</div>
            </CopyToClipboard>
          </div>}
        <div className="col-6 mx-auto mt-4 mb-3 px-3">
          <Button
            type="button"
            cssStyles={theme.blueButton}
            onClick={() => handleSharePost()}
          >
            {lang.share}
          </Button>
        </div>
      </div>
        {showLoader && !mobileView ? (
          <div className="d-flex align-items-center justify-content-center h-100 profileSectionLoader">
            <CustomDataLoader type="ClipLoader" loading={true} size={60} />
          </div>
        ) : ""}
    </Wrapper>
  );
}
