import React, { useState, useEffect } from "react";
import Image from "../../components/image/image";
import {
  Chevron_Left,
  Chevron_Right,
  LOGO,
  CLOSE_ICON_WHITE,
} from "../../lib/config";
import { authenticate, startLoader, stopLoader } from "../../lib/global";
import Router from "next/router";
import Wrapper from "../../hoc/Wrapper";
import Img from "../../components/ui/Img/Img";
import "../../node_modules/slick-carousel/slick/slick.css";
import { getAllStories } from "../../services/assets";
import StorySlider from "../../components/story/StorySlider";
import { useTheme } from "react-jss";
import dynamic from "next/dynamic";
import { isAgency } from "../../lib/config/creds";
import { useSelector } from "react-redux";
const Slider = dynamic(() => import("react-slick"));

function Dv_Stories(props) {
  const theme = useTheme();

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 1,
    speed: 500,
    nextArrow: <Img src={Chevron_Right}></Img>,
    prevArrow: <Img src={Chevron_Left}></Img>,
  };
  const selectedCreatorId = useSelector((state) => state?.selectedCreator?.creatorId);

  const [stories, setStories] = useState([]);
  const { drawerData, setActiveState, back, allList } = props;

  useEffect(() => {
    getUserStories(drawerData.userId);
    return () => {
      setStories([]);
    };
  }, []);

  const getUserStories = (userId) => {
    startLoader();
    getAllStories(userId, isAgency() ? selectedCreatorId : "")
      .then((res) => {
        if (res && res.data) {
          setStories(res.data.data);
        }
        stopLoader();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Wrapper>
      <div className="h-100 bg-dark-custom">
        <div className="col-12 p-0 d-flex align-items-center py-3">
          <div className="websiteContainer">
            <div className="row m-0 align-items-center justify-content-between">
              <div className="col-auto order-1 order-md-1 mb-3 mb-md-0 p-0">
                <Image
                  src={LOGO}
                  className="logoImg"
                  onClick={() =>
                    authenticate().then(() => {
                      props.setActiveState("timeline");
                      Router.replace("/");
                    })
                  }
                ></Image>
              </div>
              <div className="col-auto order-2">
                <Img
                  src={CLOSE_ICON_WHITE}
                  className="closeIcon"
                  onClick={() => props.onClose()}
                ></Img>
              </div>
            </div>

            <Slider {...settings}>
              {stories && stories.length && (
                <div className="slick-center">
                  <StorySlider
                    back={() => back()}
                    creator={drawerData}
                    setActiveState={setActiveState}
                    data={stories}
                  />
                </div>
              )}
            </Slider>
          </div>
        </div>
      </div>
      <style>
        {`
          :global(.closeIcon) {
            width: 23px;
            position: absolute;
            top: 5px;
            right: 0;
            cursor: pointer;
          }
          :global(.slick-slide) {
            width: 200px !important;
            height: 300px !important;
            margin: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          :global(.slick-center) {
            width: 300px !important;
            height: 500px !important;
          }
          .heading {
            z-index: 1;
          }
          :global(.slick-track) {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}
      </style>
    </Wrapper>
  );
}
export default Dv_Stories;
