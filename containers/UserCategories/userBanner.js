import dynamic from "next/dynamic";
import Wrapper from "../../hoc/Wrapper";
import CustomSlider from "../../components/slider/slider";
import isMobile from "../../hooks/isMobile";
import FigureCloudinayImage from "../../components/cloudinayImage/cloudinaryImage";
import { BANNER_PLACEHOLDER_IMAGE } from "../../lib/config/placeholder";
import { left_slick_arrow, right_slick_arrow } from "../../lib/config/homepage";
import { useTheme } from "react-jss";
import Image from "../../components/image/image";
import { handleContextMenu } from "../../lib/helper";

const Skeleton = dynamic(() => import("@material-ui/lab/Skeleton"), {
  ssr: false,
});

const UserBanner = (props) => {
  const { banners, isSkalaton, aspectRatio } = props;
  const [mobileView] = isMobile();
  const theme = useTheme();

  const settings = {
    className: "center",
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    speed: 500,
    autoplay: true,
    arrows: mobileView ? false : true,
    dots: true,
    prevArrow: 
      <Image
        src={left_slick_arrow}
        className="logoImg"
        alt="leftArrow"
      />,
    nextArrow: 
      <Image
        src={right_slick_arrow}
        className="logoImg"
        alt="rightArrow"
      />
  };

  return (
    <Wrapper>
      <div className={`col-12 ${mobileView ? "pb-0 userBannerGlobal" : "pb-4 userBannerGlobal"} px-0`}>
        <CustomSlider settings={settings} className="bannerRatio">
          {isSkalaton ? (
            <>
              <Skeleton
                variant="rect"
                width="100%"
                height={`${mobileView ? "210px" : "350px"}`}
                className="mx-2 feat_skelt bg-color imgStyle"
              />
            </>
          ) : (
            banners.length > 0 &&
            banners.map((ban, index) => (
              <div
                key={index}
                className="position-relative cursorPtr h-100 px-1 callout-none"
                onContextMenu={handleContextMenu}
              >
                <FigureCloudinayImage
                  publicId={mobileView ? ban?.appUrl : ban?.webUrl}
                  crop="thumb"
                  ratio={1}
                  errorImage={BANNER_PLACEHOLDER_IMAGE}
                  style={{width: "100%"}}
                  className={
                    mobileView ? "titleImg bg-shadow" : "titleImg bg-shadow"
                  }
                  alt="banner_image"
                  visibleByDefault={true}
                />
              </div>
            ))
          )}
        </CustomSlider>
      </div>
      <style jsx>{`
      .imgStyle{
        filter: brightness(0.4);
        border-radius : 12px;
      }
      .textInfo{
        font-size: ${mobileView ? "20px" : "30px"};
        position: absolute;
        color: #fff;
        width: 100%;
        padding: 0px 25px;
        text-align: center;
        top: 50%;
        left: 50%;
        transform: translateX(-50%) translateY(-50%);
        font-weight: 700;
      }
      .slick-prev:before,
        .slick-next:before {
          color: ${theme.appColor};
        }
        :global(.bannerRatio .slick-list){
          aspect-ratio: ${aspectRatio.width} / ${aspectRatio.height};
        }
        :global(.bannerRatio .slick-track) {
          height: 100%;
        }
        :global(.bannerRatio .slick-slide > div) {
          height: 100%;
        }
        :global(.userBannerGlobal .slick-prev) {
          width: auto;
          height: 25px;
          cursor: pointer;
          top: 50% !important;
          left: 1% !important;
          z-index: 2;
        }
        :global(.userBannerGlobal .slick-next) {
          width: auto;
          height: 25px;
          cursor: pointer;
          top: 50% !important;
          right: 1% !important;
          z-index: 2;
        }

        :global(.userBannerGlobal .slick-dots li.slick-active button:before){
          opacity: .75;
          color: ${theme.appColor};
        }

        :global(.userBannerGlobal .slick-dots li button:before){
          opacity: .75;
          color: silver;
        }

        :global(.userBannerGlobal .slick-dots li button:before){
          font-size: 10px;
        }
      `}</style>
    </Wrapper>
  );
};

export default UserBanner;