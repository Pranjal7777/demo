import React, { useEffect, useState } from "react";
import Head from 'next/head';
import useLang from "../../hooks/language";
import * as config from "../../lib/config";
import { getDocuments, uploadDocument } from "../../services/auth";
import { getCookie, setCookie } from "../../lib/session";
import {
  getUserId,
  startLoader,
  stopLoader,
  Toast,
  UploadImage,
} from "../../lib/global";
import { getCognitoToken } from "../../services/userCognitoAWS";
import fileUploaderAWS from "../../lib/UploadAWS/uploadAWS";
import { DocumentPayload } from "../../lib/data-modeling";
import dynamic from "next/dynamic";
const SelectoreDrawer = dynamic(() => import("../../containers/drawer/selectore-drawer/selectore-drawer"), { ssr: false });
import Wrapper from "../../hoc/Wrapper"
import { useSelector } from "react-redux";
import find from "lodash/find";
import { close_dialog, open_dialog } from "../../lib/global/loader";
import { signOut } from "../../lib/global/clearAll";

const ArrowDropDownIcon = dynamic(() => import("@material-ui/icons/ArrowDropDown"), { ssr: false });
const CancelIcon = dynamic(() => import("@material-ui/icons/Cancel"), { ssr: false });
const ImagePicker = dynamic(() => import("../formControl/imagePicker"), { ssr: false });
const Image = dynamic(() => import("../../components/image/image"), { ssr: false });
const Img = dynamic(() => import("../ui/Img/Img"), { ssr: false });

export default function VerifyId(props) {
  const [lang] = useLang();
  const [documents, setDocument] = useState([]);
  const [toggleDropdown, setDropdown] = useState(false);
  const [docType, setDocType] = useState("");
  const [frontImage, setFrontImage] = useState({});
  const [backImage, setBackImage] = useState({});
  const { back, onClose, doc } = props;

  useEffect(() => {
    getDocumentData();
  }, []);

  const getDocumentData = () => {
    getDocuments().then((data) => {
      setDocument(data.data.data);
    });
    getBtnValidationValue();
  };

  const toggleSelection = (value) => {
    setDropdown(value);
    getBtnValidationValue();
  };

  const handleClearSelection = () => {
    setDocType("");
  };

  //file select
  const onFrontSelect = (file, url) => {
    setFrontImage({
      file,
      url,
    });
    getBtnValidationValue();
  };

  //file select
  const onBackChnage = (file, url) => {
    setBackImage({
      file,
      url,
    });
    getBtnValidationValue();
  };

  const handleDocUploadedRedirection = () => {
    close_dialog();
    setTimeout(() => {
      open_dialog("profileSubmitted", {
        docSubmittedRedirection: true, currentTheme: "white", dialogClick: () => {
          signOut(false);
          close_dialog();
        },
      })
    }, 50)
  }

  //   upload document
  const submitData = async () => {
    startLoader();
    let url1 = "";
    let url2 = "";
    const Id = getCookie("uid");
    try {
      const cognitoToken = await getCognitoToken();
      const tokenData = cognitoToken?.data?.data;
      const postCount = 2;
      let count = 1;
      if (docType.frontRequire && Id) {
        const imgFileNameFront = `${Date.now()}_FrontDoc`;
        url1 = await fileUploaderAWS(frontImage.file[0], tokenData, imgFileNameFront, false, 'users/documents', false, 'no', null, false, true, postCount, count);
        count++;
      }
      if (docType.backRequire && Id) {
        const imgFileNameBack = `${Date.now()}_backDoc`;
        url2 = await fileUploaderAWS(backImage.file[0], tokenData, imgFileNameBack, false, 'users/documents', false, 'no', null, false, true, postCount, count);
        count++;
      }

      const documentPayload = { ...DocumentPayload };
      documentPayload.userId = getUserId();
      documentPayload.documentTypeId = docType._id;
      url1 ? (documentPayload.frontImage = url1) : "";
      url2 ? (documentPayload.backImage = url2) : "";

      await uploadDocument(documentPayload);
      props.doc ? window.location.href = "/profile" : handleDocUploadedRedirection();
      setCookie("auth", true);
    } catch (e) {
      Toast(e?.response?.data?.message, "error");
    }

    stopLoader();
  };


  const getBtnValidationValue = () => {
    return validateSubmitButton();
  }

  // validateSubmit button
  const validateSubmitButton = () => {
    let isValid = true;
    if (docType.frontRequire && !frontImage.url) {
      isValid = false;
    }
    if (docType.backRequire && !backImage.url) {
      isValid = false;
    }
    return isValid;
  };

  const handleBack = () => {
    back && back();
    onClose && onClose("");
  };

  return (
    <Wrapper>
      <Head>
        <script defer={true} src="https://sdk.amazonaws.com/js/aws-sdk-2.19.0.min.js" />
      </Head>
      <div className="p-4 text-center">
        <button
          type="button"
          className="close dv_modal_close"
          data-dismiss="modal"
          onClick={() => handleBack()}>
          {lang.btnX}
        </button>
        <div className="col-12 user__docType__modal__layout">
          <div className="dv_modal_title text-center mb-3">
            {lang.idVerification}
          </div>
          <h6 className="hdr__sm__Title text-center text-app">{lang.whyVerifyMsg}</h6>
          <p className="why__need__this text-center mb-4 text-app">
            {lang.idVerificationMsg}
          </p>
          <div className="position-relative">
            <button
              type="button"
              className="btn dv__dropdown__docType__btn"
              onClick={() =>
                toggleDropdown ? toggleSelection(false) : toggleSelection(true)
              }
            >
              {docType ? docType.name : "Select"}
            </button>
            <div className="dropdown_icon">
              {docType ? (
                <CancelIcon onClick={() => handleClearSelection()} />
              ) : (
                <ArrowDropDownIcon
                  onClick={() =>
                    toggleDropdown
                      ? toggleSelection(false)
                      : toggleSelection(true)
                  }
                />
              )}
            </div>
          </div>
          {toggleDropdown ? (
            <div className="row m-0 mt-4">
              {docType !== "" ? (
                <div className="col-12 p-0">
                  <div className="row m-0 justify-content-center">
                    {docType.frontRequire && (
                      <div className="col-auto">
                        <div
                        // style={{
                        //   border: frontImage.url ? "" : "1px solid #c4c4c4",
                        //   borderRadius: "12px",
                        // }}
                        >
                          <ImagePicker
                            key={docType._id}
                            onChange={onFrontSelect}
                            render={() => {
                              return (
                                <figure className="m-0 cursorPtr">
                                  {frontImage.url ? (
                                    <Image
                                      src={
                                        frontImage.url ||
                                        config.DV_DOCUMNET_UPLOAD
                                      }
                                      width={141}
                                      height={141}
                                      className="image_bordered"
                                      alt="document"
                                    />
                                  ) : (
                                    <div className="upload-img">
                                      <figure className="m-0">
                                        <Img
                                          src={config.DV_DOCUMNET_UPLOAD}
                                          className="img_upld_icons"
                                        />
                                      </figure>
                                    </div>
                                  )}
                                </figure>
                              );
                            }}
                          />
                          <p className="font-weight-500">{lang.front}</p>
                        </div>
                        {frontImage.url && (
                          <Image
                            src={config.CANCEL_UPLOAD}
                            width={18}
                            className="dvPosAbsClose"
                            alt="close"
                            onClick={() => setFrontImage({})}
                          />
                        )}
                      </div>
                    )}
                    {docType.backRequire && (
                      <div className="col-auto">
                        <div
                        // style={{
                        //   border: backImage.url ? "" : "1px solid #c4c4c4",
                        //   borderRadius: "12px",
                        // }}
                        >
                          <ImagePicker
                            key={docType._id}
                            onChange={onBackChnage}
                            render={() => {
                              return (
                                <figure className="m-0">
                                  {backImage.url ? (
                                    <Image
                                      src={
                                        backImage.url ||
                                        config.DV_DOCUMNET_UPLOAD
                                      }
                                      width={141}
                                      height={141}
                                      className="image_bordered"
                                      alt="document"
                                    />
                                  ) : (
                                    <div className="upload-img">
                                      <figure className="m-0">
                                        <Img
                                          src={config.DV_DOCUMNET_UPLOAD}
                                          className="img_upld_icons"
                                        />
                                      </figure>
                                    </div>
                                  )}
                                </figure>
                              );
                            }}
                          />
                          <p className="font-weight-500">{lang.back}</p>
                        </div>
                        {backImage.url && (
                          <Image
                            src={config.CANCEL_UPLOAD}
                            width={18}
                            className="dvPosAbsClose"
                            alt="close"
                            onClick={() => setBackImage({})}
                          />
                        )}
                      </div>
                    )}{" "}
                  </div>
                </div>
              ) : (
                <div className="col-12">
                  {/* <h6 className="hdr__md__Title text-center mb-3">
                  Select Document
                </h6> */}
                  <SelectoreDrawer
                    verifyDoc="true"
                    title=""
                    value={docType._id}
                    data={
                      documents &&
                      documents.length &&
                      documents
                        .map((data) => ({
                          name: "selectDoc",
                          value: data._id,
                          label: data.name,
                        }))
                        .map((option) => {
                          return option;
                          ``;
                        })
                    }
                    onSelect={(type) => {
                      setDocType(find(documents, { _id: type }));
                      setFrontImage({});
                      setBackImage({});
                    }}
                  />
                </div>
              )}
            </div>
          ) : (
            ""
          )}
          <button
            type="button"
            className="btn btn-default dv_bseBtn mt-4"
            // If button ui messed up use this.. Bhavleen Added This
            // cssStyles={theme.blueButton}
            disabled={!getBtnValidationValue()}
            onClick={() => submitData()}
          >
            Submit
          </button>
        </div>
      </div>

      <style jsx>
        {`
          .closeIcon {
            width: 16px;
            position: absolute;
            top: 15px;
            right: 15px;
            cursor: pointer;
          }
          .dropdown_icon {
            position: absolute;
            top: 50%;
            right: 15px;
            transform: translate(0, -50%);
            cursor: pointer;
          }
          .posAbsClose {
            position: absolute;
            z-index: 1;
            cursor: pointer;
            bottom: -5px;
            right: 10px;
            width: 22px;
            background: #333333;
            border-radius: 50%;
          }
          .why__need__this {
            font-size: 12px;
            font-family: Roboto !important;
          }
        `}
      </style>
    </Wrapper>
  );
}
