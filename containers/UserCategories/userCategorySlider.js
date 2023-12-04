import isMobile from "../../hooks/isMobile";
import { BANNER_PLACEHOLDER_IMAGE } from "../../lib/config/placeholder";
import FigureCloudinayImage from "../../components/cloudinayImage/cloudinaryImage";
import { useTheme } from "react-jss";
import { handleContextMenu } from "../../lib/helper";

export default function UserCategorySlider(props) {
  const theme = useTheme();
  const [mobileView] = isMobile();

  return (
    <>
      <div
        key={props.id}
        className={`mv_feat_creators_list cursorPtr callout-none ${
          mobileView
            ? "position-relative mx-2"
            : "position-relative webStyleCss"
        }`}
        onContextMenu={handleContextMenu}
        onClick={(e) => props.onClickHandler(e)}
      >
        <FigureCloudinayImage
          publicId={props.imageUrl}
          crop="thumb"
          quallity={100}
          transformWidth={mobileView ? "39vw" : "16vw"}
          errorImage={BANNER_PLACEHOLDER_IMAGE}
          style={
            mobileView
              ? {
                  borderRadius: "8px",
                  height: "100%",
                }
              : {
                  width: "100%",
                  borderRadius: "0.366vw",
                  objectFit: "cover",
                  objectPosition: "top",
                  transition: "transform 0.4s cubic-bezier(0.17, 0.67, 0.13, 1.02) 0s"
                }
          }
          className={mobileView ? "titleImg bg-shadow" : "titleImg object-fit-cover bg-shadow"}
          alt={props.fullName || props.username || "banner_image"}
          id={props.userId}
        />

        <div className="d-flex pt-1 w-100 text-center parentTitle">
          <span className="title fntSz16 w-100">{props.title}</span>
        </div>
      </div>
      <style jsx>{`
        .mv_feat_creators_list {
          aspect-ratio: ${mobileView ? "160/100" : "185/124"};
          height: 100%;
        }

        :global(.mv_feat_creators_list > span){
          border-radius: ${!mobileView && "10px"};
        }

        .title {
          font-family: "Roboto", sans-serif !important;
          color: ${theme.type == "light" ? "#fff" : theme.text};
        }

        .parentTitle {
          position: absolute;
          bottom: 12px;
        }

        :global(.webStyleCss .lazy-load-image-loaded){
           overflow : hidden
        }
      `}</style>
    </>
  );
}
