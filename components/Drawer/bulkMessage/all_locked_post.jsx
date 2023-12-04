import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "react-jss";
import useLang from "../../../hooks/language";
import useProfileData from "../../../hooks/useProfileData";
import Wrapper from "../../../hoc/Wrapper";
import Icon from "../../../components/image/icon";
import BulkMessageHeader from '../../header/bulkMessage';
import isMobile from "../../../hooks/isMobile";
import { DOLLAR_ICON, MULTI_IMG_SVG, NO_POST_PLACEHOLDER_DV, TEXT_PLACEHOLDER } from "../../../lib/config";
import { close_dialog, close_drawer, startLoader, stopLoader, Toast } from "../../../lib/global";
import { getLockedPost } from "../../../services/profile";
import { getCookie } from "../../../lib/session";
import TextPost from "../../TextPost/textPost";
import PaginationIndicator from "../../pagination/paginationIndicator";
import CustomDataLoader from "../../loader/custom-data-loading";
import Img from "../../ui/Img/Img";
import { s3ImageLinkGen } from "../../../lib/UploadAWS/uploadAWS";
import { handleContextMenu } from "../../../lib/helper";

const AllLockedPosts = (props) => {
  const [lang] = useLang();
  const [mobileView] = isMobile()
  const [profile] = useProfileData();
  const theme = useTheme();
  const uid = getCookie("uid");

  // Local States
  const [posts, setPosts] = useState();
  const [page, setPage] = useState(0);
  const [showLoader, setShowLoader] = useState(false);
  const [totalCount, setTotalCount] = useState(null);

  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

  const back = () => {
    mobileView ? close_drawer("allLockedPost") : close_dialog("allLockedPost");
  };

  useEffect(() => {
    getLockedPosts(0);
  }, []);

  const getLockedPosts = async (pageCount) => {
    try {
      pageCount ? setShowLoader(true) : startLoader();

      const payload = {
        limit: 10,
        offset: pageCount * 10,
        token: getCookie("token"),
      }

      const res = await getLockedPost(payload);

      if (res.status == 200) {
        if (!pageCount) {
          setPosts(res?.data?.data);
          setTotalCount(res?.data?.totalCount);
        } else {
          setPosts([...posts, ...res?.data?.data]);
        }

        setPage(pageCount);
      }

      pageCount ? setShowLoader(false) : stopLoader();
    } catch (err) {
      pageCount ? showShowLoader(false) : stopLoader();
      console.error("ERROR IN getLockedPosts > ", err);
      Toast(err?.response?.data?.message, "error");
    }
  }

  const lockedMsgPost = (mediaData) => {
    if (mediaData.postData[0].type === 4) {
      return <TextPost {...mediaData} textPost={mediaData.postData} />
    }
    return (
      mediaData.postData[0].type === 2
        ? <Img
          src={s3ImageLinkGen(S3_IMG_LINK, mediaData.postData[0]?.thumbnail, false, '25vw')}
          alt="Video Post"
          className="object-fit-contain dv_base_bg_dark_color h-100 w-100"
        />
        : <Img
          src={s3ImageLinkGen(S3_IMG_LINK, mediaData.postData[0]?.url, false, '25vw')}
          alt="Image Post"
          className="object-fit-contain dv_base_bg_dark_color h-100 w-100"
        />
    )
  }

  const handleLockedPost = (post) => {
    if (mobileView) {
      props.setFile(post.postData);
      props.setPrice(post.price);
      props.setPostCaption(post.description);
      props.setPostId(post.postId);
      props.setIsLockedGallery(true);
      close_drawer("allLockedPost");
    } else {
      props.setFile(post.postData);
      props.setPrice(post.price);
      props.setPostCaption(post.description);
      props.setPostId(post.postId);
      props.setIsLockedGallery(true);
      props.setPostSelection(1);
    }
  }

  return (
    <Wrapper>
      <>
        {mobileView && <BulkMessageHeader back={back} title={lang.selectLockedGallery} subTitle={""} mobileView={mobileView} />}

        {posts && posts.length > 0
          ? <div className={`row overflow-auto card_bg${mobileView ? " container m-0 pb-5 max-height100vh" : ""}`}
            style={mobileView ? {} : { maxHeight: "430px" }}
            id="lockedPostScrollEvent">
            {posts.map((post, index) => {
              return (
                <div className='col-4 m-0 p-0 mb-2 px-1 cursorPtr' key={index} style={{ height: "150px" }}
                  onClick={() => handleLockedPost(post)}>
                  {lockedMsgPost(post)}
                  <p className='m-0 locked_post_price d-flex'>
                    <Icon
                      class='mr-1'
                      icon={`${DOLLAR_ICON}#Dollar_tip`}
                      color={"#fff"}
                      height={25}
                      width={20}
                      viewBox='0 0 13.144 17.008'
                    />
                    {post.currency.symbol}{post.price}
                  </p>

                  {post.postData.length > 1
                    ? <img src={MULTI_IMG_SVG} alt="multiple image icon" onContextMenu={handleContextMenu} className="position-absolute callout-none" style={{ top: "10px", right: "10px" }} />
                    : ""}
                </div>
              )
            })}
          </div>
          : <div className={`d-flex align-items-center justify-content-center${mobileView ? " vh-100" : " vh-50"}`}>
            <div className="text-center">
              <img className="callout-none" onContextMenu={handleContextMenu} src={NO_POST_PLACEHOLDER_DV} width="50%" alt="no post placeholder" />
              <p className="font-weight-500">{lang.noPostFound}</p>
            </div>
          </div>
        }
      </>

      {showLoader && (
        <div className="d-flex justify-content-center align-items-center mb-3">
          <CustomDataLoader type="normal" isLoading={showLoader} />
        </div>
      )}

      {posts && posts.length &&
        (<PaginationIndicator
          id="lockedPostScrollEvent"
          totalData={posts}
          totalCount={totalCount}
          pageEventHandler={(val) => {
            if (showLoader) return;
            if (!val) return;
            getLockedPosts(page + 1);
          }}
        />
        )}
    </Wrapper>
  );
}

export default AllLockedPosts;