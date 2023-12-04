import React, { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Wrapper from "../../hoc/Wrapper";
import useLang from "../../hooks/language";
import { useTheme } from "react-jss";
import Button from "../../components/button/button";
import dynamic from "next/dynamic";
const InputTextArea = dynamic(
  () => import("../../components/formControl/textArea"),
  { ssr: false }
);
import * as config from "../../lib/config";
import Image from "../../components/image/image";
import { reportProblem } from "../../services/report_problem"
import isMobile from "../../hooks/isMobile";
import Header from "../../components/header/header";
import { close_drawer, getTransformedImageUrl, startLoader, stopLoader } from "../../lib/global";
import Router from "next/router";
import { useSelector } from "react-redux";
import { Toast, UploadImage } from "../../lib/global";
import { getCognitoToken } from "../../services/userCognitoAWS";
import { getCookie } from "../../lib/session";
import fileUploaderAWS from "../../lib/UploadAWS/uploadAWS";
import Icon from "../../components/image/icon";
import { isAgency } from "../../lib/config/creds";

export default function Dv_ReportProblem(props) {
  const [lang] = useLang();
  const theme = useTheme();
  const [otherReason, setOtherReason] = useState("");
  const [mobileView] = isMobile();
  const imageSelect = useRef(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedImagesWithFile, setSelectedImagesWithFile] = useState([]);
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);
  useEffect(() => {
    props.homePageref && props.homePageref.current.scrollTo(0, 0);
  }, []);

  const APP_IMG_LINK = useSelector((state) => state?.appConfig?.baseUrl);

  // function to handle input control
  const changeInput = (event) => {
    let inputControl = event.target.value;
    setOtherReason(inputControl);
  };

  const onImageSelect = async (e) => {
    let imgObj = {};
    const file = e && e.target.files;
    if (file && file[0]) {
      imgObj["url"] = URL.createObjectURL(file[0]);
    }
    setSelectedImages([...selectedImages, imgObj]);
    setSelectedImagesWithFile([...selectedImagesWithFile, file[0]])
  };

  const handleRemoveImages = (imageIndex) => {
    let array = [...selectedImages];
    let fileArray = [...selectedImagesWithFile];
    array.splice(imageIndex, 1);
    fileArray.splice(imageIndex, 1);
    setSelectedImages(array);
    setSelectedImagesWithFile(fileArray);
  };

  const handleReportProblem = async () => {

    let attechmentsArray = [];
    startLoader();
    const userId = getCookie('uid');
    const cognitoToken = await getCognitoToken();
    const tokenData = cognitoToken?.data?.data;
    const folderName = `${userId}/${config.FOLDER_NAME_IMAGES.reportImages}`;
    let count = 1;
    const postCount = selectedImagesWithFile.length;

    for (let imgFile of selectedImagesWithFile) {
      const fileName = `${userId}_reportImg_${Date.now()}_${imgFile.name}`;
      let res = await fileUploaderAWS(imgFile, tokenData, fileName, false, folderName, false, 'no', null, true, true, postCount, count);
      let transFormedImageUrl = APP_IMG_LINK + '/' + res;
      attechmentsArray = [...attechmentsArray, transFormedImageUrl];
      count++;
    }

    stopLoader();
    startLoader();
    let list = {
      problemText: otherReason,
    }
    if (attechmentsArray.length > 0) {
      let dummyList = { ...list };
      dummyList["attachments"] = attechmentsArray;
      list = dummyList;
    }
    if (isAgency()) {
      list["userId"] = selectedCreatorId;
    }
    try {
      startLoader();
      let response = await reportProblem(list);
      Toast(lang.reportMsg, "success");
      setOtherReason("");
      setSelectedImages([]);
      setSelectedImagesWithFile([]);
      stopLoader();
      // Router.back()
    } catch (e) {
      stopLoader();
      Toast(lang.reportErrMsg, "error")
    }

  }

  const backNavMenu = () => {
    close_drawer("report_problem");
    Router.push("/")
  };

  return (
    <Wrapper>
      <Head>
        <script defer={true} src="https://sdk.amazonaws.com/js/aws-sdk-2.19.0.min.js" />
      </Head>

      {mobileView
        ? <>
          <Header back={() => backNavMenu()} title={lang.reportProblem} />

          <div style={{ paddingTop: "65px" }} className="h-100 d-flex flex-column justify-content-between px-3 card_bg">

            <div style={{ paddingBottom: "30%" }}>
              <div>
                <p className="mb-0 fntSz18 fntWeight700 sectionColor">
                  {lang.report}
                </p>
                <div className="col-12 px-0 pt-2">
                  <textarea
                    autoComplete="off"
                    onChange={(e) => changeInput(e)}
                    textarea={true}
                    type="text"
                    inputType="text"
                    name="otherReason"
                    placeholder="Text here"
                    rows={5}
                    value={otherReason}
                    className=" form-control mv_form_control_profile_textarea_white"
                  />
                </div>
              </div>

              <div>
                <p className="pt-2 mb-0 fntSz18 fntWeight700 sectionColor">{lang.addImage}</p>
                <p className="pt-2 mb-0 fntSz18 sectionColor">{lang.limitUploadImg}</p>
              </div>

              <div className="row px-2 align-items-center pt-2">
                {/* image select */}
                {selectedImages?.length > 0 &&
                  selectedImages.map((image, index) => (
                    <div className="position-relative pr-1">
                      <img src={image.url} className="pt-1 imgCss" />
                      <Image
                        onClick={() => handleRemoveImages(index)}
                        src={config.CANCELCLR}
                        width="18"
                        style={{
                          position: "absolute",
                          top: "0",
                          right: "-4px !important",
                        }}
                        className="mv_upload_img_close_icon right-0"
                        alt=""
                      />
                    </div>
                  ))}

                {selectedImages && selectedImages.length != 5 && (
                  <div
                    className="position-relative pl-1"
                    onClick={() => imageSelect.current.click()}
                  >
                    <img
                      src={config.report_img_picker}
                      className="pt-2 imgCss"
                    />
                  </div>
                )}

                <input
                  style={{ display: "none" }}
                  type="file"
                  accept={config.IMAGE_TYPE}
                  ref={(e) => {
                    imageSelect.current = e;
                  }}
                  onChange={(e) => onImageSelect(e)}
                />
              </div>
            </div>

            <div className="pb-3">
              <Button cssStyles={theme.blueButton}
                isDisabled={!(otherReason.length)}
                onClick={handleReportProblem}
              >
                {lang.send}
              </Button>
            </div>
          </div>

        </>
        : <div className="mr-5 pr-5">
          <h4 className="  px-1 py-3 m-0 sectionHeading">
            {lang.reportProblem}
          </h4>
          <p className="pt-3 light_app_text">{lang.reportProblemText}</p>
          <div className="col-12 px-0">
            <textarea
              autoComplete="off"
              onChange={(e) => changeInput(e)}
              textarea={true}
              type="text"
              inputType="text"
              name="otherReason"
              placeholder="Text here"
              rows={5}
              value={otherReason}
              className=" form-control mv_form_control_profile_textarea_white"
            />
          </div>
          <div className="pt-4">
            <p className="font-weight-500 fntSz17 mb-1">{lang.addImage}</p>
            <p
              className="font-weight-400 fntSz15 mb-1 light_app_text"
            >
              {lang.limitUploadImg}
            </p>
            <div className="d-flex px-0 align-items-center">
              {/* image select */}
              {selectedImages &&
                selectedImages.length > 0 &&
                selectedImages.map((image, index) => (
                  <div className="position-relative pl-2">
                    <img src={image.url} className="pt-1 imgCss" />
                    <Image
                      onClick={() => handleRemoveImages(index)}
                      src={config.CANCELCLR}
                      width="18"
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "-4px !important",
                      }}
                      className="mv_upload_img_close_icon right-0"
                      alt=""
                    />
                  </div>
                ))}
              {selectedImages && selectedImages.length != 5 && (
                <div
                  className="position-relative pl-2"
                  onClick={() => imageSelect.current.click()}
                >
                  <Icon
                    icon={config.report_img_picker + "#add-image"}
                    width={72}
                    height={72}
                    class=''
                    viewBox="0 0 100 100"
                  />
                </div>
              )}
              <input
                style={{ display: "none" }}
                type="file"
                accept={config.IMAGE_TYPE}
                ref={(e) => {
                  imageSelect.current = e;
                }}
                onChange={(e) => onImageSelect(e)}
              />
            </div>
          </div>
          <div className="float-right mt-5">
            <Button
              type="button"
              fclassname='gradient_bg rounded-pill d-flex align-items-center justify-content-center text-white'
              btnSpanClass='text-white px-3'
              isDisabled={!(otherReason.length)}
              onClick={handleReportProblem}
              children={lang.send}
            />
          </div>
        </div>
      }

      <style jsx>
        {`
          :global(.mv_form_control_profile_textarea_white) {
            width: 100%;
            height: 50px;
            padding: 0.375rem 0.75rem;
            font-size: 1rem;
            font-weight: 400;
            line-height: 1.5;
            color: var(--l_app_text) !important;
            border: 1px solid var(--l_border) !important;
            background-color: var(--l_app_bg);
            background-clip: padding-box;
            border-radius: 0.25rem;
            -webkit-transition: border-color 0.15s ease-in-out,
              box-shadow 0.15s ease-in-out;
            transition: border-color 0.15s ease-in-out,
              box-shadow 0.15s ease-in-out;
          }

          :global(.mv_form_control_profile_textarea_white:focus) {
            color: var(--l_app_text) !important;
            border: 1px solid var(--l_border) !important;
            background-color: var(--l_app_bg);
          }
          :global(.mv_form_control_profile_textarea_white::placeholder) {
            color: var(--l_light_app_text) !important;
          }

          .imgCss {
            height: ${mobileView ? "70px" : "5vw"};
            width: ${mobileView ? "70px" : "5vw"};
            border-radius: 10px;
            cursor: pointer;
          }
          .sectionColor{
            color : ${theme?.text}
          }
        `}
      </style>
    </Wrapper>
  );
}
