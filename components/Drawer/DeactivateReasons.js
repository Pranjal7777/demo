import React, { useState } from "react";
import {
  backNavMenu,
  open_dialog,
  startLoader,
  stopLoader,
  Toast,
} from "../../lib/global";
import { deleteAccount } from "../../services/auth";
import { getCookiees } from "../../lib/session";
import useLang from "../../hooks/language";
import { useRouter } from "next/router";
import isMobile from "../../hooks/isMobile";
import { CHECK } from "../../lib/config";
import dynamic from "next/dynamic";
import Wrapper from "../../hoc/Wrapper";
const Header = dynamic(()=>import("../header/header"),{ssr:false})
const SelectoreDrawer = dynamic(()=>import("../../containers/drawer/selectore-drawer/selectore-drawer"),{ssr:false})
const Drawer = dynamic(()=>import("./Drawer"),{ssr:false})
const VerifyAcc = dynamic(()=>import("./VerifyAcc"),{ssr:false})
const InputField = dynamic(()=>import("../../containers/profile/edit-profile/label-input-field"),{ssr:false})
const Button = dynamic(()=>import("../button/button"),{ssr:false});
import { useTheme } from "react-jss";

export default function DeactivateReasons(props) {
  const theme = useTheme();
  const [selectedReason, setReasonSelected] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [toggleDrawer, setToggleDrawer] = useState("");
  const [lang] = useLang();
  const router = useRouter();
  const [mobileView] = isMobile();

  const Reasons = [...props.reasons];
  Reasons.push({
    reason: "Others",
    status: 1,
    statusMsg: "Active",
    userType: 3,
  });
  // console.log("fniefh", selectedReason);

  const handleDeactivate = async () => {
    startLoader();
    try {
      const uid = await getCookiees("uid");
      const reqPayload = {
        id: uid,
        reason: selectedReason == "Others" ? otherReason : selectedReason,
      };
      const response = await deleteAccount(reqPayload);
      if (response.status == 200) {
        stopLoader();
        if (mobileView) {
          setToggleDrawer(true);
          setTimeout(() => {
            router.reload();
          }, 1000);
        } else {
          open_dialog("successfullDialog", {
            title: lang.verifyHeading,
            desc: lang.verifyMsg,
            closeIconVisible: false,
            titleClass: "max-full",
            autoClose: true,
            closeAll: true,
          });
        }
      }
    } catch (e) {
      stopLoader();
      Toast(e.response.data.message, "error");
    }
  };

  // function to handle input control
  const changeInput = (value) => {
    setOtherReason(value);
  };

  return (
    <Wrapper>
      <div className={mobileView ? "drawerBgCss h-100" : "py-3 px-5"}>
        {mobileView ? (
          <Header
            title={lang.deactivateAccount}
            back={() => {
              backNavMenu(props);
            }}
          />
        ) : (
          <div className="text-center">
            <h5 className="txt-black dv__fnt30">{lang.deactivateAccount}</h5>

            <button
              type="button"
              className="close dv_modal_close"
              data-dismiss="modal"
              onClick={() => props.onClose()}
            >
              {lang.btnX}
            </button>
          </div>
        )}

        <div
          className={mobileView ? "col-12 px-0 vh-100" : "col-12 px-0"}
          style={
            mobileView
              ? {
                  paddingTop: "70px",
                }
              : {}
          }
        >
          <SelectoreDrawer
            darkgreyBg={mobileView ? true : false}
            title={lang.selectReasons}
            labelPlacement="right"
            value={selectedReason}
            data={
              Reasons &&
              Reasons.length &&
              Reasons.map((data) => ({
                name: "deactivateReasons",
                value: data.reason,
                label: data.reason,
              })).map((option) => {
                return option;
                ``;
              })
            }
            onSelect={(selectedReason) => setReasonSelected(selectedReason)}
          ></SelectoreDrawer>
          {selectedReason === "Others" ? (
            <div className={`col-12 ${mobileView && "px-4"}`}>
              <InputField
                autoComplete="off"
                onChange={changeInput}
                textarea={true}
                type="text"
                inputType="text"
                name="otherReason"
                placeholder="Reason"
              />
            </div>
          ) : (
            ""
          )}
          <div className={mobileView ? "bottomBtn px-3" : "my-3 px-3"}>
            <Button
              type="button"
              disabled={
                selectedReason == "" ||
                (selectedReason === "Others" && otherReason == "")
              }
              cssStyles={theme.blueButton}
              onClick={() => handleDeactivate()}
            >
              {lang.confirm}
            </Button>
          </div>
        </div>
      </div>
      <Drawer open={toggleDrawer} anchor="bottom">
        <VerifyAcc heading={lang.verifyHeading} msg={lang.verifyMsg} />
      </Drawer>
      <style jsx>
        {`
          :global(.MuiDrawer-paper) {
            color: inherit;
          }
        `}
      </style>
    </Wrapper>
  );
}
