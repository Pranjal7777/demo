import React, { useEffect, useState } from "react";
import FigureCloudinayImage from "../../components/cloudinayImage/cloudinaryImage";
import Image from "../../components/image/image";
import PageLoader from "../../components/loader/page-loader";
import useCollection from "../../hooks/useCollection";
import Pagination from "../../hoc/divPagination";
import { useRouter } from "next/router"
import {
  COLLECTION_COVER_PLACEHOLDER,
  DV_COLLECTION_PLACEHOLDER,
} from "../../lib/config";
import { open_dialog, open_drawer, scrollToView } from "../../lib/global";
import isMobile from "../../hooks/isMobile";
import Placeholder from "./placeholder";
import DvCollections from "../dvCollection/dvCollection";
import Wrapper from "../../hoc/Wrapper";
import { getCookie } from "../../lib/session";
import { getBookmarkPosts } from "../../services/collection";
import { isAgency } from "../../lib/config/creds";
import { useSelector } from "react-redux";
import Button from "../../components/button/button";
import { handleContextMenu } from "../../lib/helper";

const Collections = (props) => {
  const {
    collections,
    getCollectionData,
    setCollection,
    pageLoader,
  } = useCollection({});
  const [currentScreen, setCurrentScreen] = useState();
  const userType = getCookie("userType");
  const [firstPost, setFirstPost] = useState({});
  const [firstPostCollection, setFirstPostCollection] = useState([]);
  const [boolForCollection, setBoolForCollection] = useState(true);
  const [newCollectionCounter, setNewCollectionCounter] = useState(0);
  const [mobile] = isMobile();
  const router = useRouter()
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

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

  const getCollectionPlaceholder = (collection, isTextPost, index) => {
    return (
      <div
        className={`collection-placeholder dv__bg_light_color ${mobile ? "" : "dv-collection-image"
          }`}
        style={userType ? { maxHeight: '28vh' } : {}}
      >
        {returnCollectionCover(collection?.collectionId, index)}
      </div>
    );
  };
  const returnCollectionCover = (collectionId, index) => {
    if (collectionId) {
      return (
        firstPostCollection && firstPostCollection[index]?.text ? <div style={{ height: "100%", width: "100%" }}>
          <p style={{ width: "100%", fontFamily: firstPostCollection[index]?.font, color: firstPostCollection[index]?.colorCode, background: firstPostCollection[index]?.bgColorCode, height: "100%", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center" }}>
            {firstPostCollection[index]?.text}
          </p>
        </div> : <Image
          height="65px"
          src={
            mobile ? COLLECTION_COVER_PLACEHOLDER : DV_COLLECTION_PLACEHOLDER
          }
          alt="Collection Cover Placeholder"
        />
      )
    } else {
      return (
        firstPost && firstPost?.text ? <div style={{ height: "100%", width: "100%" }}>
          <p style={{ width: "100%", fontFamily: firstPost?.font, color: firstPost?.colorCode, background: firstPost?.bgColorCode, height: "100%", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center" }}>
            {firstPost?.text}
          </p>
        </div> :
          <Image
            height="65px"
            src={
              mobile ? COLLECTION_COVER_PLACEHOLDER : DV_COLLECTION_PLACEHOLDER
            }
            alt="Collection Cover Placeholder"
          />
      )
    }
  }
  useEffect(() => {
    setBoolForCollection(true);
    getCollections();
  }, []);

  useEffect(() => {
    if (newCollectionCounter > 0) {
      getCollections();
    }
  }, [newCollectionCounter])

  const handleBack = () => {
    userType == 1
      ? scrollToView(props.homePageref, 270)
      : scrollToView(props.homePageref),
      updateScreen();
  };

  // Function for changing screen
  const updateScreen = (screen) => {
    setBoolForCollection(true);
    setCurrentScreen(screen);
  };

  return (
    <Wrapper>
      {currentScreen ? (
        currentScreen
      ) : (
        <div className={`collections ${!mobile && ""}`}>
          <Pagination
            id={"profile_page_cont"}
            items={collections}
            totalRecord={0}
            getItems={getCollections}
          />
          {collections && collections.length > 0 ? (
            <div className="d-flex justify-content-end py-1 px-3 px-sm-1">
              <div className="float-right">
                <Button
                  type="button"
                  fclassname="gradient_bg rounded-pill py-2 text-nowrap"
                  onClick={() => {
                    mobile ? open_drawer(
                      "newCollection",
                      {
                        isNewCollection: true,
                        isFromProfile: true,
                        back: (collections) => {
                          setCollection(collections);
                          setNewCollectionCounter((prev) => prev + 1);
                        },
                      },
                      "bottom"
                    ) :
                      open_dialog(
                        "newCollection",
                        {
                          isNewCollection: true,
                          isFromProfile: true,
                          back: (collections) => {
                            setCollection(collections);
                            setNewCollectionCounter((prev) => prev + 1);
                          },
                        },
                      );
                  }}
                  children={"+ Add"}
                />
              </div>
            </div>
          ) : ""}
          <div className={`row mx-0 active pt-2 px-2 px-md-0`}>
            {collections ? (
              collections.length ? (
                <>
                  {collections.map((collection, index) => {
                    return (
                      <div className={`px-1 mb-4 col-6 col-sm-4 col-md-3 col-lg-2`} key={index} >
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
                                    allCollections: collections
                                  },
                                  "right"
                                );
                              }
                              : () => {
                                updateScreen(
                                  <DvCollections
                                    key={collection.title}
                                    back={handleBack}
                                    title={collection.title}
                                    count={collection.totalCount}
                                    collectionId={collection.collectionId}
                                    getCollectionData={getCollections}
                                    homePageref={props.homePageref}
                                    isProfilePage={router.asPath == "/profile" ? true : false}
                                    allCollections={collections}
                                  />
                                );
                              }
                          }
                        >
                          {!collection.coverImage ? (
                            getCollectionPlaceholder(collection, boolForCollection, index)
                          ) : (
                            <div
                              className={`collection-placeholder callout-none ${mobile ? "" : "dv-collection-image"
                                }`}
                              onContextMenu={handleContextMenu}
                              style={!mobile ? { maxHeight: "28vh", height: '28vh', minHeight: '28vh' } : {}}
                            >
                              <FigureCloudinayImage
                                publicId={collection.coverImage}
                                style={{
                                  borderRadius: "7px",
                                  backgroundColor: "#485164",
                                  width: "100%",
                                  height: "100%",
                                  padding: "0",
                                  objectFit: 'cover'
                                }}
                                width={'100%'}
                                height={'100%'}
                                crop={"fill"}
                                isVisible={collection.isVisible}
                                isCollectionPage={true}
                              />
                            </div>
                          )}
                        </div>

                        <div
                          className={`${mobile
                            ? "fntSz15 w-400 mt-1 text-truncate"
                            : " dv-collecion dv__fnt16 w-700 mt-2 text-truncate"
                            } text-app`}
                        >
                          <span className="">{collection.title}</span> &nbsp;
                          <span className="w-600">
                            {collection.totalCount || 0}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {pageLoader && (
                    <div className="my-4  align-items-center text-center  w-100">
                      <PageLoader start={true} />
                    </div>
                  )}
                </>
              ) : // <div className="text-center w-100 placeholder-image">
                //   <Placeholder style={{}} pageName="collections"></Placeholder>
                // </div>

                mobile ? (
                  <div className="text-center w-100 placeholder-image">
                    <Placeholder pageName="collections" />
                  </div>
                ) : (
                  <div className="col">
                    <Placeholder
                      style={{ height: "20%" }}
                      pageName="collections"
                    />
                  </div>
                )
            ) : (
              <div className="col mt-5 text-center w-100">
                <PageLoader start={true} />
              </div>
            )}
          </div>
        </div>
      )}
      <style jsx>{`
      .dv-collecion span{
        color:var(--l_app_text) !important;
      }
      :global(.dv__bg_light_color){
        background: rgb(30, 28, 34) !important;
      }
      .tabgrid-content{
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: auto;
      }

      `}
      </style>
    </Wrapper>
  );
};

export default Collections;
