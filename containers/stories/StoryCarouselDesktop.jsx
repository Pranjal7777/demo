import dynamic from "next/dynamic";
import React, { Component } from "react";
import Slider from "react-slick";
import { DARK_LOGO, CLOSE_ICON_WHITE, JUICY_HEADER_DARK_LOGO, JUICY_HEADER_LOGO } from "../../lib/config/logo";
import Icon from "../../components/image/icon";
const Image = dynamic(() => import("../../components/image/image"), {
  ssr: false,
});
const StoryDialog = dynamic(() => import("./StoryDialog"), { ssr: false });

/**
 * @description A component used in Desktop View to show the carousel for other user stories
 * @author Paritosh
 * @date 20/04/2021
 * @class StoryCarousel
 * @extends {Component}
 */
class StoryCarousel extends Component {
  state = {
    activeSlider: this.props.activeStory,
  };

  // Setting for the Story Carousel
  settings = {
    className: "DesktopStoryCarousel",
    centerMode: true,
    centerPadding: "60px",
    lazyLoad: false,
    swipe: false,
    infinite: false,
    slidesToShow: this.props.drawerData?.length === 1 ? 3 : 5, // To manage the center mode of Carousel properly
    speed: 500,
    initialSlide: this.props.activeStory,
    arrows: false,
    beforeChange: (current, next) => this.stopCurrentStory(current, next),
    afterChange: (current) => this.startStory(current), // This function will be called after each slide change
  };

  // This array contains the reference of each story slide's restart function i.e. startStory.
  refArray = [];

  stopCurrentStory = (storyIndex, next) => {
    if (this.refArray) {
      let func = this.refArray[storyIndex];
      if (typeof func?.current?.stop === "function") {
        func.current.stop();
      }
    }
  };

  //This function is to restart the story after each slide change
  startStory = (activeStoryIndex) => {
    this.setState({ activeSlider: activeStoryIndex });
    if (this.refArray) {
      let func = this.refArray[activeStoryIndex];
      if (typeof func?.current?.start === "function") {
        func.current.start();
      }
    }
  };

  // This function slides the next slider if possible
  nextSlide = () => {
    if (this.state.activeSlider + 1 === this.props.drawerData.length) return;
    this.slider.slickGoTo(this.state.activeSlider + 1);
    this.setState({ activeSlider: this.state.activeSlider + 1 });
  };

  // This function slides the previous slider if possible
  prevSlide = () => {
    if (this.state.activeSlider === 0) return;
    this.slider.slickGoTo(this.state.activeSlider - 1);
    this.setState({ activeSlider: this.state.activeSlider - 1 });
  };

  // This function navigates to any slide number with num parameter
  navigateToSlide = (num) => {
    if (num < 0 || num > this.props.drawerData.length - 1) return;
    this.slider?.slickGoTo(num);
  };

  render() {
    const { drawerData, activeStory, ...others } = this.props;
    return (
      <>
        <div className="story-carousel-desktopView w-100 h-100">
          <Image
            width={110}
            height={44}
            src={DARK_LOGO}
            style={{
              position: "fixed",
              top: "25px",
              left: "125px",
              zIndex: "1",
            }}
            onClick={() => {
              this.props.back ? this.props.back() : Router.back();
            }}
            className="cursorPtr"
          />
          <div
            style={{
              position: "fixed",
              top: "25px",
              right: "105px",
              cursor: "pointer",
              zIndex: "1",

            }}
          >
            <Icon
              icon={CLOSE_ICON_WHITE + "#close-white"}
              onClick={() => {
                this.props.back ? this.props.back() : Router.back();
              }}
              color={"#fff"}
              width={21}
              height={21}
              alt="Back Option"
            />
          </div>
          <Slider {...this.settings} ref={(c) => (this.slider = c)}>
            {this.props.drawerData?.length
              ? this.props.drawerData.map((story, index) => {
                this.refArray.push(React.createRef());
                return (
                  <StoryDialog
                    key={index}
                    parentRef={this.refArray[index]}
                    nextSlide={this.nextSlide}
                    prevSlide={this.prevSlide}
                    activeSlideNum={this.state.activeSlider}
                    slideNum={index}
                    navigateSlide={this.navigateToSlide}
                    isFirst={index === 0}
                    isPlayedFirst={index === this.props.activeStory}
                    isLast={this.props.drawerData.length === index + 1}
                    drawerData={story}
                    {...others}
                  />
                );
              })
              : <></>
            }
            {
              // Two blank div to make slider work properly
              [<div></div>, <div></div>, <div></div>, <div></div>]
            }
          </Slider>
        </div>
        <style>
          {`
            .DesktopStoryCarousel {
              background-color: var(--l_stories_background);
              height: 100%;
              display: flex;
              align-items: center;
              // background-color: #242A37;
            }

            .DesktopStoryCarousel .btn_send_tip_tag img {
              display: unset !important;
            }
            .DesktopStoryCarousel .slick-center {
              width: auto !important;
            }
            .slick-track {
              display: flex !important;
              align-items: center !important;
            }
          `}
        </style>
      </>
    );
  }
}

export default StoryCarousel;
