import React from "react";

import FigureImage from "../../../components/image/figure-image";
import Img from "../../../components/ui/Img/Img";

import LockProfile from "./lock-profile";
import VideoProfile from "./video-profile";
// import ImageGallery from "./image-gallery";

export default function ProfilePostGallery(props) {
  const post = {
    image: [
      "/images/desktop/profile_gallery/pro_gallery_1.png",
      "/images/desktop/profile_gallery/pro_gallery_2.png",
      "/images/desktop/profile_gallery/pro_gallery_3.png",
      "/images/desktop/profile_gallery/pro_gallery_4.png",
      "/images/desktop/profile_gallery/pro_gallery_5.png",
      "/images/desktop/profile_gallery/pro_gallery_6.png",
      "/images/desktop/profile_gallery/pro_gallery_7.png",
      "/images/desktop/profile_gallery/pro_gallery_8.png",
    ],
    video: [
      "/images/desktop/profile_gallery/pro_gallery_2.png",
      "/images/desktop/profile_gallery/pro_gallery_5.png",
    ],
  };

  // console.log(props.tabType);
  return (
    <div className="col-12">
      <div className="row">
        <div className="container">
          <div className="tab-content">
            <div id="home" className="tab-pane active">
              <div className="row row-cols-md-3 row-cols-2 dv_profile_gallery">
                {post.image.map((img, index) => {
                  return (
                    <div key={index} className="col mb-4">
                      <FigureImage src={img} width="100%" alt="pro_gallery_1" />
                      {/* <button className="btn btn-default dv_live_video">
                         <img
                        src={config.VIDEO_OUTLINE}
                        width={18}
                        />
                       </button> */}
                    </div>
                  );
                })}
                {post.video.map((video, index) => {
                  return (
                    <div key={index} className="col mb-4">
                      <FigureImage
                        src={video}
                        width="100%"
                        alt="pro_gallery_1"
                      />
                      <button className="btn btn-default dv_live_video">
                        <Img
                          src="/images/desktop/icons/live_video_outline.svg"
                          width={18}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* <ImageGallery post={post} /> */}

            <VideoProfile post={post} />

            <LockProfile post={post} />
          </div>
        </div>
      </div>
    </div>
  );
}
