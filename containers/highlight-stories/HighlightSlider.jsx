import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Slider from 'react-slick';
import Icon from '../../components/image/icon';
import { Next_Arrow_Story, Prev_Arrow_Story } from '../../lib/config/profile';
import LazyLoadImg from "../../components/imageLazy/LazyLoadImage";
import { s3ImageLinkGen } from "../../lib/UploadAWS/s3ImageLinkGen";
import Tooltip from "@material-ui/core/Tooltip"
import { TEXT_PLACEHOLDER } from "../../lib/config/placeholder";

const HighlightSlider = ({ featuredStoryList, mobileView, storyClickHandler, otherProfile, theme }) => {
    const slider = React.useRef(null);
    const [count, setCount] = useState(0)
    const [windowWidth, setWindowWidth] = useState(null);
    const [ownProfileCount, setOwnProfileCount] = useState(Math.floor(windowWidth / 140))
    const [otherProfileCount, setOtherProfileCount] = useState(Math.floor(windowWidth / 95))
    const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);

    const settings = {
        dots: false,
        slidesToScroll: 1,
        vertical: false,
        swipeToSlide: true,
        arrows: false,
        infinite: false,
        variableWidth: true,
        afterChange: (current) => setCount(current),
        beforeChange: (current) => setCount((prev) => prev + 1),
    };

    useEffect(() => {
        const handleWindowResize = () => {
            setWindowWidth(window.innerWidth);
        };
        handleWindowResize()
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
        };
    }, []);

    useEffect(() => {
        setOwnProfileCount(Math.floor(windowWidth / 140))
        setOtherProfileCount(Math.floor(windowWidth / 95))
    }, [windowWidth])
    return (
        <>
            <Slider ref={slider} {...settings}>
                {featuredStoryList.map((item, i) => {
                    const coverImageUrl = s3ImageLinkGen(S3_IMG_LINK, item.coverImage, null, 100);
                    return (
                        <div key={i} className="col-auto p-0 d-flex flex-column align-items-center" >
                            <Tooltip title={item.title}>
                                <div
                                    onClick={() => storyClickHandler(featuredStoryList, i)
                                    }
                                    className="position-relative"
                                >
                                    <LazyLoadImg
                                        image={{
                                            src: item.coverImage ? coverImageUrl : TEXT_PLACEHOLDER,
                                            alt: "Highlighted story cover image"
                                        }}
                                        width="60px"
                                        threshold={20}
                                        className={`${otherProfile ? "tileLiteRoundedOtherProfile" : "tileLiteRounded"} cursorPtr`}
                                    />
                                </div>
                            </Tooltip>
                            <Tooltip title={item.title}>
                                <p
                                    className={
                                        mobileView
                                            ? "featured_story_title text-truncate dv_appTxtClr m-0 text-center mt-1 w-500 light_app_text"
                                            : otherProfile
                                                ? "featured_story_title text-truncate cursorPtr m-0 text-center mt-1 w-500 light_app_text fntSz12"
                                                : "featured_story_title text-truncate newStoryTextCss cursorPtr text-center mb-0 mt-1 w-500 light_app_text fntSz12"
                                    }
                                >

                                    {item.title}
                                </p>
                            </Tooltip>
                        </div>
                    );
                })}

            </Slider>
            {count != 0 && !mobileView && <div className="customPrevArrow cursor-pointer widthContent" onClick={() => slider?.current?.slickPrev()}>
                <Icon icon={`${Prev_Arrow_Story}#Group_135661`}
                    color={"var(--l_base)"}
                    width={22}
                    height={22}
                    viewBox="0 0 50 50"
                /></div>}
            {!mobileView && !otherProfile && featuredStoryList.length > ownProfileCount && featuredStoryList.length - count > ownProfileCount && <div className="customNextArrow cursor-pointer widthContent" onClick={() => slider?.current?.slickNext()}>
                <Icon icon={`${Next_Arrow_Story}#Group_135661`}
                    color={"var(--l_base)"}
                    width={22}
                    height={22}
                    viewBox="0 0 50 50"
                />
            </div>}
            {!mobileView && otherProfile && featuredStoryList.length > otherProfileCount && featuredStoryList.length - count > otherProfileCount && <div className="customNextArrow cursor-pointer widthContent" onClick={() => slider?.current?.slickNext()}>
                <Icon icon={`${Next_Arrow_Story}#Group_135661`}
                    color={"var(--l_base)"}
                    width={22}
                    height={22}
                    viewBox="0 0 50 50"
                />
            </div>}

            <style jsx>{`
        .featured_story_title {
          width: 60px !important;
          overflow: hidden;
        }
        .newStoryTextCss{
          color : ${theme?.text}
        }
        :global(.slick-current>div){
          display:flex;
        }
        .customPrevArrow{
          position: absolute;
          top: 20%;
          left:6px;
        }
        .customNextArrow{
          position: absolute;
          right: 2px;
          top: 20%;
        }
        :global(.highlightSlider .slick-track){
          display:flex;
          gap:5px;
          margin-left:3px;
          width:${otherProfile && !mobileView && "fit-content !important"};
          margin:${otherProfile && !mobileView && "initial !important"};
        }
        :global(.highlightSlider .slick-list){
          padding:0 !important;
        }
      `}</style>
        </>
    )
}

export default HighlightSlider