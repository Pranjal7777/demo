import React from "react";
import { connect } from "react-redux";
import { blue34 } from "../../lib/color";
import {
  close_drawer,
  convertToDecimal,
  open_drawer,
  startLoader,
  stopLoader,
} from "../../lib/global";
import { backArrow, CHECK } from "../../lib/config";
import { getBilingDetails } from "../../services/billing";
import { LanguageSet } from "../../translations/LanguageSet";
import dynamic from "next/dynamic";
import { getVirtualOrderDetail } from "../../services/shoutout";
import { CROSS } from "../../lib/config/profile";
import { defaultCurrency } from "../../lib/config/creds";
const Image = dynamic(() => import("../image/image"), { ssr: false });
const FigureCloudinayImage = dynamic(
  () => import("../cloudinayImage/cloudinaryImage"),
  { ssr: false }
);
const ViewPost = dynamic(() => import("./ViewPost"), { ssr: false });
const Icon = dynamic(() => import("../image/icon"), { ssr: false });

class PaymentSucces extends React.Component {
  state = {
    postImg: "",
    postId: "",
  };

  componentDidMount() {
    if(this.props.txntype == 1 && this.props.trigger == "VIRTUAL_ORDER"){
      this.getPurchaseOrder();
    }
    if(this.props.txntype == 1 && this.props.trigger !== "VIRTUAL_ORDER"){
      this.handleGetBillingDetails();
    }
  }

  getPurchaseOrder = async () => {
    try {
      startLoader();
      let APIreponse = await getVirtualOrderDetail(this.props.orderId);
      let virtualOrderData = APIreponse?.data?.data;
      this.setState({postImg: virtualOrderData[0]?.orderThumbnailUrl || "", postId: this.props.orderId});
      stopLoader();
    } catch (e) {
      stopLoader();
      console.error("Error in getPurchaseOrder", e);
    }
  };

  handleGetBillingDetails = () => {
    startLoader();
    getBilingDetails(this.props.orderId)
      .then((res) => {
        stopLoader();
        if (res.status == 200) {
          // console.log("nffje", res.data.data);
          this.setState({
            postImg:
              res && res.data && res.data.data && res.data.data.url
                ? res.data.data.url
                : "",
            postId:
              res && res.data && res.data.data && res.data.data.productId
                ? res.data.data.productId
                : "",
          });
        }
      })
      .catch((err) => {
        console.error("dwid-->err", err);
        stopLoader();
        this.setState({
          postImg: [],
        });
      });
  };
  handleCloseMultipleDrawers = () => {
    this.props.onClose();
    close_drawer("WithDrawanDialog");
    close_drawer("BankDetails");
    close_drawer("Withdraw");
    this.props.getUserTransactions && this.props.getUserTransactions(0, false);
  };

  // Function for changing screen
  updateScreen = (screen) => {
    this.setState({
      currentScreen: screen,
    });
  };

  render() {
    const { mobileView, theme, langCode = "en" } = this.props;
    const { postImg, postId, currentScreen } = this.state;
    const { updateScreen } = this;

    // console.log("fjiw", this.props);
    let getInfo = (label, value) => {
      return (
        <div className="mb-4">
          <span
            className={
              mobileView ? "label-2" : "txt-roman dv__fnt17 dv__Grey_var_5"
            }
          >
            {label}
          </span>
          <div
            className={
              mobileView ? "label-3" : "dv__fnt16 txt-roman text-app"
            }
          >
            {value}
          </div>
        </div>
      );
    };

    let getText = () => {
      // console.log("asdada", this.props);
      switch (this.props.type) {
        case 3:
          return `You have recharged your wallet with ${
            this.props.currency + " " + convertToDecimal(this.props.amount)
          }`;
        case 4:
          return `Plan purchased successfully`;
        case 7:
          return `You have withdrawn ${
            this.props.currency + " " + convertToDecimal(this.props.amount)
          }`;
      }
    };
    let getModeText = () => {
      switch (this.props.type) {
        case 3:
          return `Recharge Mode`;
        case 4:
          return `Plan detail`;
        case 7:
          return `Withdraw Mode`;
        case 11:
          return `Withdraw Mode`;
        case 12:
          return `Daily Pool`;
      }
    };
    const lang = LanguageSet[langCode];

    return (
      <div
      className={
        mobileView
          ? `d-flex flex-column drawerBgCss`
          : `d-flex flex-column ${postImg ? "" : "h-100"}`
      }
    >
      {currentScreen ? (
        currentScreen
      ) : (
        <>
          <div
            onClick={() =>
              this.props.type == 7
                ? this.handleCloseMultipleDrawers()
                : this.props.onClose()
            }
          >
            {mobileView ? (
              <div
              className="text-muted cursorPtr position-absolute"
              style={{ right: '2%', top: '5%' }}
              onClick={() => mobileView ? close_drawer("withdrawMoney") : close_dialog("withdrawMoney")}
          >
              <Icon
                  icon={`${CROSS}#cross`}
                  size={30}
                  unit={"px"}
                  color={"#1E1C22"}
                  viewBox="0 0 20 20"
              />
          </div>
            ) : (
              <button
                type="button"
                className="close dv_modal_close"
                data-dismiss="modal"
                onClick={() => this.props.onClose()}
              >
                {lang.btnX}
              </button>
            )}
          </div>

          <div
            className="payment-sucess-check text-center pt-3 pb-4 mt-2"
            style={
              mobileView
                ? {
                    borderBottom: "1px solid #818ca3",
                  }
                : { borderBottom: "1px solid #C4C4C4" }
            }
          >
            <div className="">
              {/* <Image
                height={mobileView ? "86px" : "75px"}
                src={CHECK}
              ></Image> */}

              <Icon
                icon={`${CHECK}#check_icon`}
                color={theme?.appColor}
                size={60}
                viewBox="0 0 74.521 74.521"
              />
            </div>

            <div
              className={
                mobileView
                  ? "amount-label mt-3"
                  : "dv__fnt30 dv__Grey_var_8 pt-3"
              }
            >
                  {this.props.currency || "USD"} {this.props?.txntype === 2 ? "-" : ""}{defaultCurrency}{convertToDecimal(this.props.amount) || "20000"}
            </div>
            <div
              className={
                mobileView
                  ? "label1"
                  : "dv__fnt16 txt-roman dv__Grey_var_5"
              }
            >
              {this.props.successMessage ||
                this.props.text ||
                getText()}
            </div>

              {/* {postImg && ((this.props.type != 12 && this.props.trigger !== "REFERRAL_EARNING") || this.props.trigger !== "VIRTUAL_ORDER") ? (
                <div className="col-12 cursorPtr">
                  <div
                    className="row m-0 mt-3 py-3 d-flex flex-nowrap align-items-center"
                    style={
                      mobileView
                        ? {
                            backgroundColor: "#313746",
                            borderRadius: "9px",
                          }
                        : {
                            backgroundColor: "#f2f3f5",
                            borderRadius: "9px",
                          }
                    }
                  >
                    <div className="col-auto pr-0 ">
                      <FigureCloudinayImage
                        publicId={postImg}
                        postType={1}
                        style={
                          mobileView
                            ? {
                                width: "19.466vw",
                                height: "19.466vw",
                                borderRadius: "8px",
                                marginRight: "2.666vw",
                                objectFit: "cover",
                                objectPosition: "top",
                                padding: "0",
                              }
                            : {
                                width: "5.344vw",
                                height: "5.344vw",
                                borderRadius: "8px",
                                marginRight: "1.666vw",
                                objectFit: "cover",
                                objectPosition: "top",
                                padding: "0",
                              }
                        }
                      />
                    </div>
                    <div
                      className={`${
                        mobileView ? "col-8" : "col"
                      } pl-0 text-left`}
                    >
                      <p
                        className={`mb-2 txt-heavy ${
                          mobileView
                            ? "fntSz14 dv_appTxtClr"
                            : "dv__fnt14 dv__black_color"
                        }`}
                        onClick={
                          mobileView
                            ? this.props.trigger == "VIRTUAL_ORDER" ? ()=>{} : () =>
                                open_drawer(
                                  "ViewPost",
                                  { postId: postId },
                                  "right"
                                )
                            : this.props.trigger == "VIRTUAL_ORDER" ? ()=>{} : () =>
                                updateScreen(
                                  <ViewPost
                                    postId={postId}
                                    updateScreen={updateScreen}
                                  />
                                )
                        } */}
                        {/* style={{
                        //   whiteSpace: "nowrap",
                        //   overflow: "hidden",
                        //   textOverflow: "ellipsis",
                        //   width: "90%",
                        // }} */}
                      {/* > */}
                        {/* Tap if you wish to see the post */}
                        {/* post desc */}
                      {/* </p> */}
                      {/* <p
                    className={`m-0 txt-roman dv__Grey_var_13 ${
                      mobileView ? "fntSz14" : "dv__fnt14"
                    }`}
                  >
                    Posted on Monday july 5, 2020 */}
                      {/* posted date {moment(date).format(
                      "dddd MMM DD, YYYY, hh:mm a"
                    )} */}
                      {/* </p> */}
                    {/* </div>
                  </div>
                </div>
            ) : ""}*/}

          </div> 
          <div className="tansaction-block pt-4">
            {getInfo(
              "Transaction Id",
              this.props.id || "Transaction Id"
            )}
            {getInfo(
              getModeText(),
              this.props.rechargeMode &&
                this.props.rechargeMode != "null"
                ? this.props.rechargeMode
                : "Bank"
            )}
            {getInfo("Date & Time", this.props.time || "Date & Time")}
          </div>
        </>
      )}
      <style jsx>
        {`
          :global(.MuiDrawer-paper) {
            background: ${theme.background};
          }
          .payment-success-dialog {
            width: 350px;
          }
          .button-wraper {
            padding: 20px 20px;
          }
          :global(.payment-dialog-done) {
            cursor: pointer;
            font-size: 0.85rem;
            width: 100%;
            padding: 7px;
            border-radius: 3px;
          }
          .tansaction-block {
            padding: 6px 20px;
          }
          :global(.label1) {
            font-size: 0.75rem;
            color: ${blue34};
          }
          .amount-label {
            color: ${theme.text};
            font-size: 1.2rem;
            font-weight: 700;
          }
          .border-bottom {
            border-bottom-color: ${blue34} !important;
          }
          :global(.view-dialog-close) {
            position: absolute;
            height: 33px;
            right: -13px;
            cursor: pointer;
            z-index: 3;
            top: -13px;
          }

          :global(.label-2) {
            font-size: 0.9rem;
            color: ${blue34};
          }
          :global(.label-3) {
            font-size: 1rem;
            color: ${theme.text};
          }
        `}
      </style>
    </div>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    langCode: store?.language,
  };
};

export default connect(mapStateToProps)(PaymentSucces);
