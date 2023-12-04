import React, { useEffect, useRef, useState } from "react";
import isMobile from "../../hooks/isMobile";
import useLang from "../../hooks/language";
import useCollection from "../../hooks/useCollection";
import {
  CHECK,
  COLLECTION_COVER_PLACEHOLDER,
  DARK_COLLECTION_COVER_PLACEHOLDER
} from "../../lib/config";
import {
  close_dialog,
  close_drawer,
  drawerToast,
  open_dialog,
  open_drawer,
  startLoader,
  stopLoader,
} from "../../lib/global";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
const FigureCloudinayImage = dynamic(() => import("../cloudinayImage/cloudinaryImage"), { ssr: false })
const InputText = dynamic(() => import("../formControl/inputText"), { ssr: false })
const Header = dynamic(() => import("../header/header"), { ssr: false })
const Image = dynamic(() => import("../image/image"), { ssr: false })
const Button = dynamic(() => import("../button/button"), { ssr: false });
import { useTheme } from "react-jss";
import { getCognitoToken } from "../../services/userCognitoAWS";
import fileUploaderAWS from "../../lib/UploadAWS/uploadAWS";
import Script from "next/script";
import { getCookie } from "../../lib/session";
import { isAgency } from "../../lib/config/creds";
import { useSelector } from "react-redux";
import { handleContextMenu } from "../../lib/helper";

const EditCollections = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  const { updateCollectionData } = useCollection({});
  const [image, setImage] = useState(props.coverImage);
  const [name, setName] = useState(props.title);
  const router = useRouter();
  const coverImageRef = useRef(null)
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  const [mobile] = isMobile();
  const [postId, setPostId] = useState("");
  useEffect(() => {
    if (mobile) {
      // const heigth = editCollection && editCollection.offsetHeight;

      if (editCollectionBody) {
        editCollectionBody.style.paddingTop = "90px";

        // console.log("editCollectionBody", editCollectionBody);
      }
    }
  }, []);

  const handleCoverImageUpload = async (e)=>{
    try {

        startLoader()
        const file = e.target.files[0];

        if (!file) {
          return;
        }

        let fileUrl = "";
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            fileUrl = reader.result;
        };

        let userId = getCookie("uid");
        const cognitoToken = await getCognitoToken();
        const tokenData = cognitoToken?.data?.data;
        const imgFileName = `${userId}_${Date.now()}`;
        const folderName = `${props.collectionId}/`;

        const coverImageUrl = await fileUploaderAWS(
          fileUrl,
          tokenData,
          imgFileName,
          false,
          folderName,
          true,
        );

        setImage(coverImageUrl)
        coverImageUrl && stopLoader()
        } catch (error) {
        stopLoader()
        console.error(error.message)
    }
  }


  return (
    <>
    <Script src="https://sdk.amazonaws.com/js/aws-sdk-2.19.0.min.js" strategy="afterInteractive"/>
    <div
      className={
        mobile ? "drawerBgCss w-100 vh-100 overflow-hidden text-app" : ""
      }
    >
      {mobile && (
        <Header
          id="editCollection"
          title={lang.editCollection}
          back={props.onClose}
        />
      )}
      <div
        id="editCollectionBody"
        className="h-100 col-12  d-flex flex-column align-items-center"
      >
        {!mobile && (
          <div className="row  mt-3 pb-2">
            <div className="col-12 ">
              <h5 className="content_heading fntSz22 w-700 px-1 py-2 text-center m-0 ">
                {lang.editCollection}
              </h5>
            </div>
          </div>
        )}
        <div className={mobile ? "mt-4 text-center" : "text-center "}>
          <div className="Image-box">
            <div
                onContextMenu={handleContextMenu}
                className="collection-placeholder text-app callout-none"
              style={{ height: mobile ? 130 : 110, width: mobile ? 130 : 110 }}
            >
              {" "}
              {image ? (
                <FigureCloudinayImage
                  publicId={image}
                  style={{
                    borderRadius: "7px",
                    backgroundColor: "#485164",
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                    isVisible={image ? props?.isVisible : true}
                  isCollectionPage={true}
                  tileLockIcon={true}
                  width={130}
                  height={130}
                  crop={"fill"}
                />
              ) : (
                <Image height="55px" src={theme.type === "light" ? COLLECTION_COVER_PLACEHOLDER : DARK_COLLECTION_COVER_PLACEHOLDER} />
              )}
            </div>
          </div>
          <div
            className="dv_base_color mt-3 cursorPtr"
            onClick={() =>coverImageRef.current.click()}
          >
            <input type="file" accept="image/*" ref={coverImageRef} hidden
            onChange={handleCoverImageUpload}
            />
            {lang.changeCover}
          </div>
        </div>

        {/* {!mobile && (
          <div className="mt-4">
            <div
              className="redClr fntSz15 mb-2 cursorPtr"
              onClick={() => {
                mobile
                  ? open_dialog(
                      "DeleteConfirm",
                      {
                        collectionId: props.collectionId,
                        getCollectionData: props.getCollectionData,
                      },
                      "bottom"
                    )
                  : open_dialog(
                      "DeleteDialog",
                      {
                        collectionId: props.collectionId,
                        getCollectionData: props.getCollectionData,
                      },
                      "bottom"
                    );
              }}
            >
              Delete collection
            </div>
            <div className="text-blue34 fntSz13 pr-5">
              When you delete this collection, the photos and videos will be
              still in All posts.
            </div>
          </div>
        )} */}

        <div className="mt-4 w-100">
          <div className={mobile ? "w-500" : "col-12 mt-2 w-500"}>
            {mobile && <div className="text-blue34  fntSz14 mb-3">Name</div>}
            <InputText
              value={name}
              onChange={(e) => {
                // console.log("changing in edit collection")
                setName(e.target.value);
              }}
              className={mobile ? `w-100` : "input-collection mv_form_control_Input"}
              placeholder="Collection name"
                maxlength="32"
            />
          </div>
        </div>
        {mobile && (
          <div className="mt-4">
            <div
              className="dltButton fntSz20 mb-2"
              onClick={() => {
                open_dialog(
                  "DeleteConfirm",
                  {
                    collectionId: props.collectionId,
                    getCollectionData: props.getCollectionData,
                  },
                  "bottom"
                );
              }}
            >
              {lang.dlt_Collection}
            </div>
            <div className="text-blue34 fntSz14">
              {lang.dltCollectionCnfrm}
            </div>
          </div>
        )}

        <div className={mobile ? "posBtm" : "w-100 col-12"}>
          <Button
            //   disabled={!collectionName}
            type="button"
            fclassname={
              mobile
                ? "w-100"
                : " btn btn-default dv-dialog-profile x-0 mb-4 mt-2"
            }
            // cssStyles={mobile ? theme.blueButton : ""}
            cssStyles={theme.blueButton}
            onClick={() => {
              startLoader();
              let requestPayload = {
                title: name,
                collectionId: props.collectionId,
              };
              if (isAgency()) {
                requestPayload["userId"] = selectedCreatorId;
              }
              if (image != props.coverImage) {
                requestPayload["coverImage"] = image;
                // requestPayload["postId"] = postId;
              }

              updateCollectionData({
                requestPayload,
                cb: () => {
                  close_drawer();
                  close_dialog();
                  setTimeout(() => {
                    stopLoader();
                    mobile
                      ? drawerToast({
                        title: lang.updatedCollection,
                        closeIconVisible: false,
                        titleClass: "max-full",
                        autoClose: true,
                        isMobile: true,
                      })
                      : open_dialog("successfullDialog", {
                        title: lang.updatedCollection,
                        // desc: lang.cancelMsg,
                        closeIconVisible: false,
                        titleClass: "max-full",
                        autoClose: true,
                      });
                    startLoader();
                    props.getCollectionData && props.getCollectionData();
                    mobile ? "" : router.reload();
                  }, 200);
                },
              });
              // createCollection();
            }}
          >
            {lang.save}
          </Button>
        </div>
      </div>
    </div>
    </>
  );
};

export default EditCollections;
