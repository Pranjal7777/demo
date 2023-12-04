import React, { useEffect, useState } from "react";
import Button from "../../components/button/button";
import Image from "../../components/image/image";
import useLang from "../../hooks/language";
import {
  backgroudDocument,
  LOGOUT,
  MENU_LOGOUT,
  DOCUMNET_UPLOAD,
  CANCEL_UPLOAD,
  IMAGE_TYPE,
  DRAWER_CLOSE,
  share_icon_profile,
} from "../../lib/config";
import {
  close_drawer,
  getUserId,
  open_drawer,
  signOut,
  startLoader,
  stopLoader,
  Toast,
  UploadImage,
} from "../../lib/global";
import { getDocuments, uploadDocument } from "../../services/auth";
import find from "lodash/find";
import { DocumentPayload } from "../../lib/data-modeling";
import { getCookie, setCookie } from "../../lib/session";
import Img from "../../components/ui/Img/Img";
import { useTheme } from "react-jss";
import { useSelector } from "react-redux";
import { getCognitoToken } from "../../services/userCognitoAWS";
import fileUploaderAWS from "../../lib/UploadAWS/uploadAWS";
import Icon from "../../components/image/icon";
import { useRouter } from "next/router";

const Document = (props) => {
  const theme = useTheme();
  const [documents, setDocument] = useState([]);
  const [frontImage, setFrontImage] = useState({});
  const [backImage, setBackImage] = useState({});
  const [docType, setDocType] = useState("");
  const [lang] = useLang();
  const [currentTheme, setCurrentTheme] = useState("dark")
  const router = useRouter()

  const getDocumentData = () => {
    getDocuments().then((data) => {
      // console.log("Sadasdsd", data.data.data);
      setDocument(data.data.data);
    });
  };

  const fileSelect = (e, handleChange) => {
    const file = e?.target.files;
    if (file?.[0]) {
      const fileUrl = URL.createObjectURL(file[0]);
      open_drawer(
        "ImageCropper",
        {
          file: file,
          currentImg: fileUrl,
          handleUploadMedia: handleChange,
          onClose: () => close_drawer("ImageCropper")
        },
        "top"
      );
    }
  };

  useEffect(() => {
    getDocumentData();
  }, []);

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

  //file select
  const onFrontSelect = (file, url) => {
    setFrontImage({
      file,
      url,
    });
  };
  //file select
  const onBackChnage = (file, url) => {
    setBackImage({
      file,
      url,
    });
  };

  const handleDocUploadedRedirection = () => {
    setTimeout(() => {
      open_drawer("profileDocSubmitted", {
        docSubmittedRedirection: true, currentTheme: "white", drawerClick: () => {
          window.location.href = "/"
        },
      }, "bottom")
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
      let count = 1;
      const postCount = 2;
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
      Toast(e.response.data.message, "error");
    }

    stopLoader();
  };

  useEffect(() => {
    if (router.query.theme === "white") {
      setCurrentTheme("white")
    }
  }, [router.query])

  // console.log("document type ", docType);
  return (
    <div
      className="scr card_bg manageCurrentTheme"
      style={theme.documentBg}
    >
      <div className="header-top-secion w-330 mx-auto py-3">
        <div className="col-12">
          <div className="row justify-content-between">
            <div className="col-auto"></div>
            <div className="col-auto">
              {theme.type === "light" ? 
                <Img
                  onClick={() => signOut(true)}
                  src={LOGOUT}
                  width={15}
                  id="back"
                /> :
                <Icon
                  onClick={() => signOut(true)}
                  icon={`${share_icon_profile}#export-variant`}
                  color={`${currentTheme === "white" ? "#000" : theme?.text}`}
                  size={23}
                  class="pointer ml-2"
                  style={{ transform: "rotate(90deg)" }}
                  viewBox="0 0 19.529 19.535"
                />
              }
            </div>
          </div>
        </div>
      </div>
      <form className="w-330 mx-auto content-secion py-3">
        <div className="col-12 text-center">
          <h4 className={`titleH4 mb-4 ${currentTheme === "white" ? "text-black" : "appTextColor"}`}>{lang.uploadDoc}</h4>
          <div className="mb-4">
            <div
              className="form-group mb-0"
              data-toggle="modal"
              data-target="#btmModal"
            >
              <div
                className="position-relative"
                onClick={() => {
                  open_drawer(
                    "radioSelectore",
                    {
                      value: docType._id,
                      data:
                        documents &&
                        documents.map((document) => {
                          return {
                            name: "document",
                            value: document._id,
                            label: document.name,
                          };
                        }),
                      onSelect: (type) => {
                        setDocType(find(documents, { _id: type }));
                        setFrontImage({});
                        setBackImage({});
                      },
                      theme: "white"
                    },
                    "bottom"
                  );
                }}
              >
                <input
                  type="text"
                  disabled
                  className="text-black bold form-control form-control-trans placholderColor"
                  style={{ backgroundColor: "#e9ecef", border: "2px solid #000" }}
                  placeholder="Select"
                  value={docType.name}
                />
                <Image
                  src={MENU_LOGOUT}
                  width={10}
                  className="setRgtPosAbs"
                  id
                  alt="close"
                />
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            {docType.frontRequire && (
              <div className="col-auto">
                <input
                  id="frontDoc498723"
                  type="file"
                  className="form-input"
                  style={{ display: "none" }}
                  onChange={(e) => fileSelect(e, onFrontSelect)}
                  accept={IMAGE_TYPE}
                />
                <label htmlFor="frontDoc498723" className="m-0">
                  <figure>
                    {frontImage.url ? (
                      <Image
                        src={frontImage.url || DOCUMNET_UPLOAD}
                        width={141}
                        height={141}
                        className="image_bordered"
                        alt={document || ""}
                      />
                    ) : (
                      <>
                        <div className="upload-img">
                          <figure>
                            <Img
                              src={DOCUMNET_UPLOAD}
                              className="img_upld_icons"
                            />
                          </figure>
                        </div>
                          <div className={`txt-trans fntWeight700 ${currentTheme === "white" ? "text-black" : "appTextColor"} `}>
                          {lang.front}
                        </div>
                      </>
                    )}
                  </figure>
                </label>

                {frontImage.url && (
                  <Image
                    src={CANCEL_UPLOAD}
                    width={18}
                    className="posAbsClose"
                    alt="close"
                    onClick={() => setFrontImage({})}
                  />
                )}
              </div>
            )}
            {docType.backRequire && (
              <div className="col-auto">
                <input
                  id="BackDoc498723"
                  type="file"
                  className="form-input"
                  style={{ display: "none" }}
                  onChange={(e) => fileSelect(e, onBackChnage)}
                  accept={IMAGE_TYPE}
                />
                <label htmlFor="BackDoc498723" className="m-0">
                  <figure>
                    {backImage.url ? (
                      <Image
                        src={backImage.url || DOCUMNET_UPLOAD}
                        width={141}
                        height={141}
                        className="image_bordered"
                        alt={document || ""}
                      />
                    ) : (
                      <>
                        <div className="upload-img">
                          <figure>
                            <Img
                              src={DOCUMNET_UPLOAD}
                              className="img_upld_icons"
                            />
                          </figure>
                        </div>
                          <div className={`txt-trans  ${currentTheme === "white" ? "text-black" : "appTextColor"} fntWeight700 `}>
                          {lang.back}
                        </div>
                      </>
                    )}
                  </figure>
                </label>

                {backImage.url && (
                  <Image
                    src={CANCEL_UPLOAD}
                    width={18}
                    className="posAbsClose"
                    alt="close"
                    onClick={() => setBackImage({})}
                  />
                )}
              </div>
            )}{" "}
          </div>

          {validateSubmitButton() && (
            <div className="posBtm">
              <Button
                type="button"
                onClick={submitData}
                cssStyles={theme.blueButton}
              >
                Submit
              </Button>
            </div>
          )}
        </div>
      </form>
      <style jsx>{`
      :global(.manageCurrentTheme){
        background : ${currentTheme === "white" && "white !important"}
      }
      
      `}</style>
    </div>
  );
};
export default Document;
