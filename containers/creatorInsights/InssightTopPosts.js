import * as React from 'react';
import { defaultCurrency } from '../../lib/config/creds';
import { convertCurrencyLocale } from '../../lib/global';
import isMobile from '../../hooks/isMobile';
import FigureCloudinayImage from '../../components/cloudinayImage/cloudinaryImage';
import ShowMore from "../../components/show-more-text/ShowMoreText";
import useLang from '../../hooks/language';
import Image from '../../components/image/image';
import { ARROW_GRADIENT_ICON } from '../../lib/config';
import { formatDate } from '../../lib/date-operation/date-operation';
import { getExcerpt } from '../../redux/actions/chat/helper';
import { getPostById } from '../../services/assets';
import { open_dialog, startLoader, stopLoader } from '../../lib/global/loader';
import { useRouter } from 'next/router';
import MobilePostView from '../../components/mobileGridView/MobilePostView';
import Model from '../../components/model/model';

export const InsightTopPosts = ({ topData }) => {
    const [mobileView] = isMobile()
    const [lang] = useLang()
    const router = useRouter()
    const [mobilePost, setMobilePost] = React.useState()
    const [isModelOpen, setModelOpen] = React.useState(false)
    const topPosts = topData?.topPosts || []
    const [seeMore, setSeeMore] = React.useState()
    const [dataLimit, setDataLimit] = React.useState(3)
    const handleSeeMoreClick = () => {
        setSeeMore(!seeMore)
        if (seeMore) {
            setDataLimit(3)
        } else {
            setDataLimit(10)
        }
    }

    const handleDialog = (flag) => {
        setModelOpen(flag)
        setMobilePost()
    }

    const handlePostClick = async (postId) => {
            try {
                startLoader()
                const res = await getPostById(postId)
                const postData = res?.data?.result?.[0];
                stopLoader()
                if (postData) {
                    if(mobileView) {
                        setMobilePost(postData)
                        setModelOpen(true)
                        return;
                    }
                    open_dialog("PostSlider", {
                        profileLogo: postData.profilePic,
                        price: postData.price,
                        currency: postData.currency || {},
                        postImage: postData.postData,
                        postType: postData.postType,
                        isBookmarked: postData.isBookmarked,
                        profileName: postData.firstName,
                        onlineStatus: postData.scheduledTimestamp || postData.postedAt,
                        likeCount: postData.likeCount,
                        commentCount: postData.commentCount,
                        postDesc: postData.description,
                        postId: postData.postId,
                        userId: postData.userId,
                        isLiked: postData.isLike,
                        username: postData.username || postData.userName,
                        // followUnfollowEvent:props.followUnfollowEvent,
                        isVisible: postData.isVisible || 0,
                        taggedUsers: postData.taggedUsers,
                        isFollow: postData.isFollow || 0,
                        allData: [postData],
                        postToShow: 0,
                        isHashtagPost: false,
                        adjustWidth: true,
                    })
                }
            } catch (e) {
                stopLoader()
                console.log("post open error", e)
            }
    }

    return (
        <div className={`topPosts mt-3 ${mobileView ? 'p-2' : 'p-4'}`}>
            <h3 className='secTitle'>{lang?.topPosts}</h3>
            <div className='topList'>
                <div className='inner-wrapper'>
                    {
                        topPosts.filter((f, indx) => indx < dataLimit).map((post, idx) => {
                            return (
                                <div className='postItem borderBtm cursorPtr d-flex align-items-center justify-content-between p-3' key={post?.id} onClick={() => handlePostClick(post?.id)}>
                                    <div className='postInfo d-flex align-items-center flex-full'>
                                        <div className='postThumb mr-3 cursorPtr' style={{ height: mobileView ? 60 : 80, width: mobileView ? 60 : 80 }}>
                                            <FigureCloudinayImage
                                                publicId={post?.previewData?.[0]?.thumbnail || post?.postData?.[0]?.thumbnail}
                                                width={mobileView ? 60 : 80}
                                                height={mobileView ? 60 : 80}
                                                ratio={1}
                                                className="postThumbnail"
                                                alt={post?.title}
                                            />
                                        </div>
                                        <div className='postDatail flex-full'>
                                            {
                                                post?.Title ? <h5 className='postTitle cursorPtr mb-3 dv_appTxtClr text-truncate' onClick={() => handlePostClick(post?.id)}>
                                                    {
                                                        mobileView ? post.Title.length > 30 ? getExcerpt(post.Title, 30).shortText : post?.Title :
                                                            post.Title.length > 70 ? getExcerpt(post.Title, 70).shortText : post?.Title
                                                    }
                                                </h5> : ""
                                            }
                                            <div className='d-flex p-0 justify-content-between'>
                                                <div className='col-auto postAitem pl-0'>
                                                    <p className='m-0 pTitle'>{lang?.postedDate}</p>
                                                    <p className='m-0 pValue'>{formatDate(post?.postedTs, "MMM DD YYYY")}</p>
                                                </div>
                                                <div className='col-auto postAitem pl-0'>
                                                    <p className='m-0 pTitle'>{lang?.price}</p>
                                                    <p className='m-0 pValue'>{`${defaultCurrency}${post?.price}`}</p>
                                                </div>
                                                <div className='col-auto postAitem pl-0'>
                                                    <p className='m-0 pTitle'>{lang?.totalPurchases}</p>
                                                    <p className='m-0 pValue'>{post?.totalPurchase}</p>
                                                </div>
                                                <div className='col-auto postAitem pl-0'>
                                                    <p className='m-0 pTitle'>{lang?.earnings}</p>
                                                    <p className='m-0 pValue'>{`${defaultCurrency}${convertCurrencyLocale(post?.Revenue)}`}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                {
                    topPosts?.length > 3 ? <div className={`seeMore cursorPtr d-flex justify-content-center align-items-center p-2 mt-2  ${seeMore ? 'active' : ""}`} onClick={handleSeeMoreClick}>
                        <div className='cursorPtr d-flex justify-content-center align-items-center'>
                            <h3 className='m-0 yTitle gradient_text position-relative'>{seeMore ? lang?.seeLess : lang.seeMore}</h3>
                            <Image
                                src={`${ARROW_GRADIENT_ICON}#arrowGradient`}
                                width={24}
                                className="ml-1 smicon"
                            />
                        </div>
                    </div> : ""
                }
            </div>
            {mobileView && (
                <Model
                    open={isModelOpen}
                    className={"full_screen_dialog vw-100"}
                    // closeIcon={true}
                    // keepMounted={true}
                    fullScreen={true}
                >
                    <MobilePostView
                        onClose={() => handleDialog(false)}
                        selectedPost={mobilePost?.postId}
                        posts={mobilePost ? [mobilePost] : []}
                        id="search-page"
                        title={"Post"}
                        isScheduled={mobilePost?.isScheduled}
                        handleDialog={handleDialog}
                    />
                </Model>)}
            <style jsx>
                {
                    `.topPosts {
                        border: 1px solid var(--l_border);
                        border-radius: ${mobileView ? '12px' : '20px'};
                        border-width: ${mobileView ? '1px' : '1px'} !important;
                    }
                    .pTitle {
                        color: var(--l_light_app_text);
                        font-size: ${mobileView ? '8px' : '14px'};
                    }
                    .pValue {
                        color: var(--l_app_text);
                        font-size: ${mobileView ? '10px' : '14px'};
                        font-weight: 600;
                    }
                    .postItem .userName {
                        font-size: ${mobileView ? '12px' : '18px'};
                        font-weight: 600;
                        letter-spacing: 0px;
                    }
                    .postItem .postTitle {
                        font-size: ${mobileView ? '12px' : '16px'};
                        font-weight: 600;
                        letter-spacing: 0px;
                    }
                    .flex-full {
                        flex: 1;
                    }
                    :global(.postThumb img) {
                        height: 100% !important;
                        width: 100% !important;
                        border-radius: 12px;
                    }
                    .topPosts .postItem:last-child {
                        border-bottom-width: 0px !important;
                    }
                    .seeMore {
                        background-color: var(--l_grayf6);
                        border-radius: 20px;
                        position: relative;
                    }
                    :global(.seeMore.active .smicon){
                        transform: rotate(180deg);
                    }
                    .seeMore h3::after {
                        display: block;
                        content: '';
                        position: absolute;
                        bottom: 0;
                        height: 2px;
                        width: 100%;
                        background: linear-gradient(180deg, #D33AFF 0%, #FF71A4 100%);
                    }
                    .yTitle {
                        font-size:  ${mobileView ? '12px' : '18px'};
                        font-weight: 600;
                        letter-spacing: 0px;
                        text-align: left;
                    }
                    `
                }
            </style>
        </div>
    );
};