import dynamic from "next/dynamic";
import React, { Component } from "react";
import Slider from "react-slick";
import { close_drawer } from "../../lib/global/loader";
const StoryDialog = dynamic(() => import("./StoryDialog"), { ssr: false });

/**
 * @description A component used in Mobile View to show the carousel for other user stories
 * @author Paritosh
 * @date 17/04/2021
 * @class StoryCarousel
 * @extends {Component}
 */
class StoryCarousel extends Component {
  state = {
    activeSlider: this.props.activeStory,
  };

  // Setting for the Story Carousel
  settings = {
    className: "MobileStoryCarousel",
    centerMode: false,
    centerPadding: "60px",
    lazyLoad: false,
    swipe: false,
    infinite: false,
    slidesToShow: 1,
    speed: 500,
    initialSlide: this.props.activeStory,
    arrows: false,
    beforeChange: (current, next) => this.stopCurrentStory(current, next),
    afterChange: (current) => this.startStory(current), // This function will be called after each slide change
    onSwipe: (direction) => {
      this.handleSwipe(direction);
    },
  };

  // This array contains the reference of each story slide's restart function i.e. startStory.
  refArray = [];

  handleSwipe = (direction) => {
    const activeSlider = this.state.activeSlider;
    if (
      direction === "left" &&
      activeSlider === this.props.drawerData?.length - 1
    ) {
      close_drawer();
    }
  };

  stopCurrentStory = (storyIndex, nextStoryIndex) => {
    if (storyIndex === nextStoryIndex) return;
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
        <div className="story-carousel-mobileView w-100 h-100">
          <Slider {...this.settings} ref={(c) => (this.slider = c)}>
            {this.props.drawerData?.length ? (
              this.props.drawerData.map((story, index) => {
                this.refArray.push(React.createRef());
                return (
                  <StoryDialog
                    key={index}
                    parentRef={this.refArray[index]}
                    nextSlide={this.nextSlide}
                    prevSlide={this.prevSlide}
                    isFirst={index === 0}
                    slideNum={index}
                    navigateSlide={this.navigateToSlide}
                    isPlayedFirst={index === this.props.activeStory}
                    isLast={this.props.drawerData.length === index + 1}
                    drawerData={story}
                    {...others}
                  />
                );
              })
            ) : (
              <> </>
            )}
          </Slider>
        </div>
        <style>
          {`
            .MobileStoryCarousel {
              background-color: ${this.props.theme.palette.l_app_bg};
            }

            .MobileStoryCarousel .btn_send_tip_tag img {
              display: unset !important;
            }
          `}
        </style>
      </>
    );
  }
}

export default StoryCarousel;
