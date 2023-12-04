import React, { useEffect, useState } from "react";
import {
  backNavMenu,
  open_dialog,
  open_drawer,
  scrollToView,
} from "../../lib/global";
import {
  FLOATING_PLUS_BUTTON,
  TEXT_POST_ACTIVE_DESKTOP
} from "../../lib/config";
import useLang from "../../hooks/language";
import useCollection from "../../hooks/useCollection";
import isMobile from "../../hooks/isMobile";
import { getCookie } from "../../lib/session";
import dynamic from "next/dynamic";
const Placeholder = dynamic(
  () => import("../../containers/profile/placeholder"),
  { ssr: false }
);
const Header = dynamic(() => import("../header/header"), { ssr: false });
const Pagination = dynamic(() => import("../../hoc/divPagination"), {
  ssr: false,
});
const FigureCloudinayImage = dynamic(
  () => import("../cloudinayImage/cloudinaryImage"),
  { ssr: false }
);
const PageLoader = dynamic(() => import("../loader/page-loader"), {
  ssr: false,
});
const Image = dynamic(() => import("../image/image"), { ssr: false });
const DvCollections = dynamic(
  () => import("../../containers/dvCollection/dvCollection"),
  { ssr: false }
);
import CustomDataLoader from "../loader/custom-data-loading";
import { useTheme } from "react-jss";
import Button from "../button/button";
import { handleContextMenu } from "../../lib/helper";

export default function CollectionPosts(props) {
  const [lang] = useLang();
  const { collections, getCollectionData, setCollection, pageLoader } = useCollection({});
  const [firstPost, setFirstPost] = useState({});
  const [firstPostCollection, setFirstPostCollection] = useState([]);
  const [boolForCollection, setBoolForCollection] = useState(true);
  const [newCollectionCounter, setNewCollectionCounter] = useState(0);
  const [currentScreen, setCurrentScreen] = useState();
  const userType = getCookie("userType");
  const theme = useTheme();
  const [textPostInfo, setTextPostInfo] = useState({});

  const getCollections = (page = 0) => {
    return new Promise(async (res, rej) => {
      try {
        await getCollectionData({
          offset: page,
          limit: 10,
          all: true,
        });
        res();
      } catch (e) {
        rej();
      }
    });
  };

  // Function for changing screen
  const updateScreen = (screen) => {
    setCurrentScreen(screen);
    setTextPostInfo({});
    setBoolForCollection(true);
    // handleFirstPost();
  };
  const [mobile] = isMobile();

  useEffect(() => {
    if (newCollectionCounter > 0) {
      getCollections().catch(e => {
        console.log("collection error")
      });
    }
  }, [newCollectionCounter])

  const returnCollectionCover = (collectionId, index) => {
    if (collectionId) {
      return (
        firstPostCollection && firstPostCollection[index]?.text ? <div className="h-100 w-100">
          <p className="w-100" style={{ fontFamily: firstPostCollection[index]?.font, color: firstPostCollection[index]?.colorCode, background: firstPostCollection[index]?.bgColorCode, height: "100%", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center" }}>
            {/* {firstPostCollection[index]?.text} */}
            <Image height="100%" width="100%" src={TEXT_POST_ACTIVE_DESKTOP} className="p-5" alt="Collection Cover Placeholder" />
          </p>
        </div> : textPostInfo?.text ? <div className="h-100 w-100">
          <p className="w-100" style={{ fontFamily: textPostInfo?.font, color: textPostInfo?.colorCode, background: textPostInfo?.bgColorCode, height: "100%", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Image height="100%" width="100%" src={TEXT_POST_ACTIVE_DESKTOP} className="p-5" style={{ backgroundColor: "#003973" }} alt="Collection Cover Placeholder" />
          </p></div> : <Image height="100%" width="100%" src={TEXT_POST_ACTIVE_DESKTOP} className="p-5 dv_base_bg_color" alt="Collection Cover Placeholder" />
      )
    } else {
      return (
        firstPost && firstPost?.text ? <div className="h-100 w-100">
          <p className="w-100" style={{ fontFamily: firstPost?.font, color: firstPost?.colorCode, background: firstPost?.bgColorCode, height: "100%", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center" }}>
            {firstPost?.text}
          </p>
        </div> : <Image height="100%" width="100%"
          src={TEXT_POST_ACTIVE_DESKTOP}
          className="p-5"
          style={{ backgroundColor: "#003973" }}
          alt="Collection Cover Placeholder"
        />
      )
    }
  }

  const GetCollectionPlaceholder = (collection, isTextPost, index) => {
    // if(isTextPost && collection?.collectionId){
    //   handleFirstPost(collection?.collectionId, index)
    // }
    return (
      <div
        className={`collection-placeholder ${mobile ? "" : "dv-collection-image dv__bg_light_color"
          }`}
      >
        {returnCollectionCover(collection?.collectionId, index)}

      </div>
    );
  };

  useEffect(() => {
    setBoolForCollection(true);
    getCollections().catch(e => {
      console.log("collection error")
    });
    userType == 1
      ? scrollToView(props.homePageref, 270)
      : scrollToView(props.homePageref);
  }, []);

  const handleAddCollection = () => {
    open_dialog(
      "newCollection",
      {
        back: (collections, collectionData) => {
          setCollection(collections);
          setNewCollectionCounter((prev) => prev + 1);
          collectionData && setTextPostInfo(collectionData);
        },
        type: 3,
        isNewCollection: true
      },
      "bottom"
    );
  }

  return (
    <div>
      {currentScreen ? (
        currentScreen
      ) : (
        <div
          className={mobile ? "drawerBgCss" : ""}
          style={mobile ? {} : { marginBottom: "150px" }}
        >
          {mobile ? (
            <Header
              title={lang.collections}
              back={() => {
                backNavMenu(props);
              }}
            />
          ) : (
            <div className="myAccount_sticky__section_header d-flex justify-content-between align-items-center py-3 ">
              <h5 className="m-0 sectionHeading">
                {lang.collections}
              </h5>
              <div className="">
                <Button
                  type="button"
                  fclassname='gradient_bg rounded-pill d-flex align-items-center justify-content-center text-white'
                  btnSpanClass='text-white px-2'
                  onClick={handleAddCollection}
                  children={`+ Add`}
                />
              </div>
            </div>

          )}
          <div
            style={mobile ? { paddingTop: "70px" } : { paddingTop: "10px" }}
            id="profile_coll_cont"
            className={mobile && "vh-100 overflow-auto"}
          >
            <Pagination
              id={mobile ? "profile_coll_cont" : "page_more_side_bar"}
              items={collections}
              totalRecord={0}
              getItems={getCollections}
            />
            {mobile && (
              <div className="flowting-button">
                <div>
                  <Image
                    onClick={() => {
                      open_drawer(
                        "newCollection",
                        {
                          back: (collections, collectionData) => {
                            setCollection(collections);
                            setNewCollectionCounter((prev) => prev + 1);
                            collectionData && setTextPostInfo(collectionData);
                          },
                          isNewCollection: true,
                          type: 3
                        },
                        "bottom"
                      );
                    }}
                    src={FLOATING_PLUS_BUTTON}
                    className="floating-action-button"
                  />
                </div>
              </div>
            )}

            <div className="fluid h-100">
              <div className="row mx-0 justify-content-start h-100">
                {collections ? (
                  collections.length ? (
                    <>
                      {collections.map((collection, index) => {
                        return (
                          <div className="col-6 col-sm-4 px-0" key={index}>
                            <div className="px-2 mb-3 position-relative">
                              <div
                                onClick={
                                  mobile
                                    ? () => {
                                      open_drawer(
                                        "bookmarkPosts",
                                        {
                                          title: collection.title,
                                          count: collection.totalCount,
                                          collectionId: collection.collectionId,
                                          getCollectionData: getCollections,
                                          allCollections: collections,
                                          homePageref: props.homePageref,
                                        },
                                        "right"
                                      );
                                    }
                                    : () => {
                                      updateScreen(
                                        <DvCollections
                                          back={updateScreen}
                                          title={collection.title}
                                          count={collection.totalCount}
                                          collectionId={collection.collectionId}
                                          getCollectionData={getCollections}
                                          homePageref={props.homePageref}
                                          allCollections={collections}
                                          isMoreMenu={props?.isMoreMenu}
                                        />
                                      );
                                    }
                                }
                              >
                                {!collection.coverImage ? (
                                  GetCollectionPlaceholder(collection, boolForCollection, index)
                                ) : (
                                  <div
                                    onContextMenu={handleContextMenu}
                                    className={`callout-none collection-placeholder ${mobile ? "" : "dv-collection-image"
                                      }`}
                                  >
                                    <FigureCloudinayImage
                                      publicId={collection.coverImage}
                                      style={{
                                        borderRadius: "7px",
                                        backgroundColor: "#485164",
                                        width: "100%",
                                        height: "100%",
                                        padding: "0",
                                        objectFit: "cover",
                                        boxShadow: "0 8px 6px -6px #485164",
                                        // border: "1px solid #485164",
                                      }}
                                      width={mobile ? "100%" : "100%"}
                                      // height={mobile ? "100%" : "100%"}}
                                      crop={"fill"}
                                        isVisible={collection?.coverImage ? collection?.isVisible : true}
                                      isCollectionPage={true}
                                      tileLockIcon={true}
                                    />
                                  </div>
                                )}
                              </div>

                              <div
                                className={`${mobile
                                  ? "fntSz15 w-400 mt-1 text-truncate"
                                  : ` ${theme.type === "light"
                                    ? "dv-collecion"
                                    : "dv-collecion_dark"
                                  } fntSz15 w-400 mt-2  text-truncate`
                                  }`}
                              >
                                <span className="">{collection.title}</span> &nbsp;
                                <span className="w-600">
                                  {collection.totalCount || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      {pageLoader && (
                        <div className="my-4 align-items-center text-center w-100">
                          <PageLoader start={true} />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="w-100 placeholder-image h-100 d-flex align-items-center justify-content-center">
                      <Placeholder pageName="collections" />
                    </div>
                  )
                ) : (
                  <div className="d-flex align-items-center justify-content-center h-100 profileSectionLoader">
                    <CustomDataLoader type="ClipLoader" loading={true} size={60} />
                  </div>
                )}
              </div>
            </div>

            {/* </div> */}
          </div>
        </div>
      )}
      <style jsx>
        {`
          :global(.MuiDrawer-paper) {
            color: inherit;
          }
          :global(.collection-placeholder){
            background: none !important;
            height: ${mobile && "100% !important"};
            aspect-ratio: ${mobile && "1/1"};

          }
          :global(.dv-collection-image){
            width: 100% !important;
            aspect-ratio: 1/1 !important;
          }
          :global(.dv-collection-image){
            height:100% !important;
          }
          :global(.colletionTitle){
            position: absolute;
            bottom: 0px;
            width: 37vh;
            padding-left: 10px;
            padding-bottom: 5px;
            border-bottom-left-radius: 7px;
            border-bottom-right-radius: 7px;
            background-image: linear-gradient(to bottom, transparent 0%, black 100%);
          }
          .backColor{
            background-color: #18171C !important;
          }
          .dynamicFlex{
            display:flex;
            width:100%;
            padding: 0px 5px !important;
            justify-content: start;
          }
          :global(.dynamicFlex>div) {
            width:49.9%;
            aspect-ratio:1/1;
          }
        `}
      </style>
    </div>
  );
}
