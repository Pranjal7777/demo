import React, { useState, useEffect } from "react";
import Wrapper from "../../hoc/Wrapper";
import useLang from "../../hooks/language";
import { close_drawer, open_drawer, Toast } from "../../lib/global";
import Header from "../header/header";
import * as env from "../../lib/config";
import useProfileData from "../../hooks/useProfileData";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Img from "../ui/Img/Img";
import Button from "../button/button";
import { useTheme } from "react-jss";

export default function ReferFriends(props) {
  const theme = useTheme();
  const [lang] = useLang();
  const [profile] = useProfileData();

  const setCustomVhToBody = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vhCustom', `${vh}px`);
  };

  useEffect(() => {
    setCustomVhToBody();
    window.addEventListener('resize', setCustomVhToBody);

    return () => {
      window.removeEventListener('resize', setCustomVhToBody);
    };
  }, []);

  const handleSharePost = () => {
    open_drawer("SHARE_REFER", {
      shareType: "referFren",
      back: () => close_drawer("SHARE_REFER"),
    }, "bottom");
  };

  return (
    <Wrapper>
      <div className="drawerBgCss h-100">
        <Header
          title={lang.referYourFriends}
          back={() => {
            props.onClose();
          }}
        />

        <div className="col-12 text-center">
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: 'calc(var(--vhCustom, 1vh) * 100)' }}
          >
            <div>
              <Img src={env.Refer_Frens_Placeholder} />
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

            <div className="px-3 shareButton">
              <Button
                type="button"
                cssStyles={theme.blueButton}
                onClick={() => handleSharePost()}
              >
                {lang.share}
              </Button>
            </div>
          </div>
        </div>

      </div>
      <style jsx>{`
          :global(.MuiDrawer-paper) {
            color: inherit;
          }
          .shareButton{
            width: 100%;
            height: 12vh;
            position: absolute;
            bottom: 0;
          }
        `}
      </style>
    </Wrapper>
  );
}
