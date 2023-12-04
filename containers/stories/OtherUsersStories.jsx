import dynamic from "next/dynamic";
import React from "react";
import Stories, { WithSeeMore, WithHeader } from "react-story-module";
import {
  cloudinaryLink,
  EMPTY_PROFILE,
  CUSTOM_ARROW,
  IMAGE_LOCK_ICON,
  PLACE_HOLDER,
} from "../../lib/config";
import { close_progress } from "../../lib/global";
import { submitViewStory } from "../../services/assets";
import Icon from '../../components/image/icon';
import CustomFooter from "../../components/story/CustomFooter";
import { s3ImageLinkGen } from "../../lib/UploadAWS/uploadAWS";
import { open_progress } from "../../lib/global/loader";
import PendingStoryUpload from "./PendingStoryUpload";
import { handleContextMenu } from "../../lib/helper";
import { authenticate } from "../../lib/global/routeAuth";
import { getCookie } from "../../lib/session";
const Skeleton = dynamic(() => import("@material-ui/lab/Skeleton"), { ssr: false });
const Image = dynamic(() => import("../../components/image/image"), { ssr: false });
const CustomHeaderComponent = dynamic(() => import("../../components/story/CustomHeader"), { ssr: false });
const FigureCloudinayImage = dynamic(() => import("../../components/cloudinayImage/cloudinaryImage"), { ssr: false });

/**
 * @description This is the implementation of Story Module. This is for other user stories
 * @author Paritosh
 * @date 07/04/2021
 * @class StoryModule
 * @extends {React.Component}
 * @param this.state.story : Array - This array contains the All Story of this Particular User
 * @param this.state.actionString: String - Used to control story state. If this set to 'pause', story will be paused, same for 'play', 'next' and 'previous'.
 */

class StoryModule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      actionString: "",
      activeStory: 0,
      story: [],
      isActive: false, // To play the story for mobile view
      isLocked: false, // To show Locked Icon on Paid Story
    };
  }
  storyCopy; // A blank variable to copy the story data

  setIsActive = (flag) => {
    this.setState({ isActive: flag });
  };

  startStory = () => {
    this.setIsActive(true);
  };
  stopStory = () => {
    this.setIsActive(false);
  };

  // This action function is to pause and play the story
  action = (string) => {
    if (string == "play" || string == "pause") {
      this.setState({ actionString: string });
    }
  };

  // This function is to go on any story number. For example goto(3) will go to 3rd story of the user
  goto = (num) => {
    this.setState({ actionString: `goto ${num}` });
  };

  // This function is used to move to next story
  next = () => {
    this.setState({ actionString: "next" });
  };

  // This function is used to move to previous story
  previous = () => {
    this.setState({ actionString: "previous" });
  };

  setCustomVhToBody = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vhCustom', `${vh}px`);
  };

  openProfile = () => {
    authenticate(this.props.routerPass?.asPath ? this.props.routerPass?.asPath : "").then(() => {
      if (this.props.ownStory) return;
      const { creator } = this.props;
      this.action("pause");
      open_progress();
      window.open(
        `/${creator.username || creator.userName}`, '_self'
      );
    })

  }

  componentWillUnmount() {
    close_progress();

    window.removeEventListener('resize', this.setCustomVhToBody);
  }

  componentDidMount() {

    if (this.props.propref) {
      this.props.propref.current = {
        start: this.startStory,
        stop: this.stopStory,
      };
    } // A reference of this function used in StoryCarousel

    const setActiveState = this.props.setActiveState;
    const resultData = this.props.stories.map((item) => {
      if (item.storyData.type == 1) {
        return {
          isViewed: Boolean(item.isViewed),
          url: s3ImageLinkGen(this.props.S3_IMG_LINK, item.storyData.url, false, false, false, item.isVisible ? false : 5),
          type: "image",
          styles: {
            filter: item.isVisible ? "unset" : "blur(40px)",
          },
          seeMore: ({ close, action }) => <div></div>,
          seeMoreCollapsed: ({ toggleMore, action }) =>
            CustomFooter({
              toggleMore,
              action,
              item,
              setActiveState,
              ownStory: this.props.ownStory,
              creator: this.props.creator,
            }),
          customLayout: (
            <>
              {!item.isVisible
                ? <>
                  <div style={{ zIndex: "1100" }} className="w-100 d-flex flex-column justify-content-center align-items-center position-absolute">

                    <div className="feedStoryLock ">
                      <Icon
                        icon={`${IMAGE_LOCK_ICON}#lock_icon`}
                        color={this.props.theme.palette.white}
                        size={75}
                        unit="px"
                        viewBox="0 0 68.152 97.783"
                      />
                    </div>
                    <p style={{ background: "#fff", borderRadius: "150px" }} className=" col-11 text-center  fntSz18 fontW500 feedStoryLock_text cursorPtr p-2 mt-3" onClick={this.openProfile}>Subscribe</p>
                  </div>

                </>
                : <></>
              }
            </>
          )
        };
      } else if (item.storyData.type == 4) {
        return {
          _id: item._id,
          isViewed: Boolean(item.isViewed),
          type: "text",
          content: (props) => (
            <>
              <CustomHeaderComponent
                {...this.props}
                activeStory={this.state.activeStory}
                action={this.action}
              />
              <div style={{
                wordBreak: 'break-word',
                width: '100%',
                minHeight: '350px',
                background: `${item.storyData.bgColorCode}`,
                color: `${item.storyData.colorCode}`,
                padding: '10px',
                filter: `${!item.isVisible ? "blur(40px)" : "blur(0px)"}`,
                fontFamily: `${item.storyData.font}`,
                wordWrap: 'break-word',
                justifyContent: `${item.storyData.textAlign}`,
                textAlign: `${item.storyData.textAlign}`,
              }}
                className='d-flex  align-items-center'
              >
                {/* <h1 style={{ fontStyle: `${item.storyData.font}` }}>{item.storyData.text}</h1> */}
                <h1
                  style={{
                    fontFamily: `${item.storyData.font}`,
                    fontSize: `${this.props.mobileView
                      ? item.storyData.text.length > 250 ? '5.5vw' : item.storyData.text.length > 200 ? '4.5vw' : item.storyData.text.length > 100 ? '4vw' : item.storyData.text.length > 50 ? '3.5vw' : '9.5vw'
                      : item.storyData.text.length > 250 ? '1.5vw' : item.storyData.text.length > 200 ? '2vw' : item.storyData.text.length > 100 ? '2vw' : item.storyData.text.length > 50 ? '3.5vw' : '4.5vw'}`,
                    wordWrap: 'break-word',
                  }}>{item.storyData.text}</h1>
              </div>
              <div style={{
                position: 'absolute',
                bottom: '0',
                width: '100%',
                zIndex: '1000'
              }}>
                <CustomFooter action={this.action} item={item} setActiveState={setActiveState} ownStory={this.props.ownStory} creator={this.props.creator} />
              </div>
            </>
          ),
          customLayout: (
            <>
              {!item.isVisible
                ? <>
                  <div style={{ zIndex: "1100" }} className="w-100 d-flex flex-column justify-content-center align-items-center position-absolute">

                    <div className="feedStoryLock ">
                      <Icon
                        icon={`${IMAGE_LOCK_ICON}#lock_icon`}
                        color={this.props.theme.palette.white}
                        size={75}
                        unit="px"
                        viewBox="0 0 68.152 97.783"
                      />
                    </div>
                    <p style={{ background: "#fff", borderRadius: "150px" }} className=" col-11 text-center  fntSz18 fontW500 feedStoryLock_text cursorPtr p-2 mt-3" onClick={this.openProfile}>Subscribe</p>
                  </div>

                </>
                : <></>
              }
            </>
          )
        }
      } else {
        if (!item.storyData.url) {
          return {
            _id: item._id,
            type: "text",
            seeMore: ({ close, action }) => <div></div>,
            seeMoreCollapsed: ({ toggleMore, action }) =>
              CustomFooter({
                toggleMore,
                action,
                item,
                setActiveState,
                ownStory: this.props.ownStory,
                creator: this.props.creator,
                activeIndex: this.state.activeIndex,
              }),
            content: (props) => (
              <>
                <CustomHeaderComponent
                  {...this.props}
                  action={this.action}
                  activeIndex={this.state.activeIndex}
                  currentIndex={this.state.story.findIndex(
                    (item) => !item.isViewed
                  )}
                  activeStory={this.state.story[this.state.activeIndex]}
                />
                <PendingStoryUpload />
                <div style={{
                  position: 'absolute',
                  bottom: '0',
                  width: '100%',
                  zIndex: '1000'
                }}>
                  <CustomFooter action={this.action} item={item} setActiveState={setActiveState} ownStory={this.props.ownStory} creator={this.props.creator} activeIndex={this.state.activeIndex} />
                </div>
              </>
            ),
            // header: this.state.headers
          };
        }
        return {
          isViewed: Boolean(item.isViewed),
          autoPlay: item.isVisible,
          url: `${item.isVisible
            ? item.storyData.url
            : ""
            }`,
          type: "video",
          thumbnail: s3ImageLinkGen(this.props.S3_IMG_LINK, item.storyData.thumbnail, false, false, false, item.isVisible ? false : 5),
          thumbnailStyles: {
            filter: item.isVisible ? "unset" : "blur(40px)",
          },
          seeMore: ({ close, action }) => <div></div>,
          seeMoreCollapsed: ({ toggleMore, action }) =>
            CustomFooter({
              toggleMore,
              action,
              item,
              setActiveState,
              ownStory: this.props.ownStory,
              creator: this.props.creator,
            }),
          customLayout: (
            <>
              {!item.isVisible
                ? <>
                  <div style={{ zIndex: "1100" }} className="w-100 d-flex flex-column justify-content-center align-items-center position-absolute">
                    <div className="feedStoryLock ">
                      <Icon
                        icon={`${IMAGE_LOCK_ICON}#lock_icon`}
                        color={this.props.theme.palette.white}
                        size={75}
                        unit="px"
                        viewBox="0 0 68.152 97.783"
                      />
                    </div>
                    <p style={{ background: "#fff", borderRadius: "150px" }} className=" col-11 text-center  fntSz18 fontW500 feedStoryLock_text cursorPtr p-2 mt-3" onClick={this.openProfile}>Subscribe</p>
                  </div>
                </>
                : <></>
              }
            </>
          )
        };
      }
    });
    this.setState({
      story: [...resultData],
    });
    // this.action('play') // For Safari Browser this line is must
    if (resultData.length) {
      this.storyCopy = [...resultData];
    }

    if (this.props.isPlayedFirst) {
      this.setIsActive(true);
    }

    this.setCustomVhToBody();
    window.addEventListener('resize', this.setCustomVhToBody);
  }

  goToPreviousSlide = () => {
    if (this.props.isFirst) return;
    if (!this.props.prevSlide) return;
    this.stopStory();
    this.props.prevSlide();
  };

  onAllStoriesEnd = (index, e) => {
    if (this.props.isLast === undefined || this.props.isLast === true) {
      this.props.back();
      return;
    }
    this.props.nextSlide();
  };
  onStoryEnd = (index, e) => {
    // console.log("onStoryEnd: index", index);
  };

  onStoryStart = async (index, e) => {
    let auth = getCookie("auth");
    // this.action('pause')
    this.setState({ activeStory: this.props?.stories[index] });
    this.setState({ isLocked: !Boolean(this.props.stories[index].isVisible) });
    if (!this.props.stories[index].isViewed && !this.props.ownStory && auth) {
      try {
        const res = await submitViewStory(this.props.stories[index]._id)
      } catch (error) {
        console.log(error);
      }
    }
  };

  // This function is used to navigate to any slide in story carousel
  navigateSlide = () => {
    if (this.props.mobileView) return;
    const indexToNavigate = this.props.slideNum;
    this.props.navigateSlide(indexToNavigate);
  };

  // This function returns the JSX when no story is playing in the slider
  noStorySkeleton = () => {
    if (this.storyCopy?.length) {
      const { creator } = this.props;
      const imgSrc =
        this.storyCopy[0].type === "image"
          ? this.storyCopy[0].url
          : this.storyCopy[0].thumbnail;

      return (
        <div
          className="overflow-hidden w-100 h-100 position-relative d-flex justify-content-center align-items-center cursorPtr"
          onClick={this.navigateSlide}
          style={{ borderRadius: '20px' }}
        >
          <Image
            src={imgSrc || PLACE_HOLDER}
            style={{
              ...this.storyCopy[0].styles,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
              top: "0",
              left: "0",
              opacity: "0.7",
              borderRadius: '20px',
            }}
          />
          <div
            className="position-relative text-center callout-none"
            style={{
              fontSize: `${this.state.isActive || this.props.mobileView ? "1rem" : ".8rem"
                }`,
              color: 'white',
              fontWeight: '600'
            }}
            onContextMenu={handleContextMenu}
          >
            <FigureCloudinayImage
              publicId={creator.profilePic ? creator.profilePic : EMPTY_PROFILE}
              className="tileRounded active"
              style={{
                borderRadius: "50%",
                width: `${this.state.isActive || this.props.mobileView
                  ? "100px"
                  : "44px"
                  }`,
                height: `${this.state.isActive || this.props.mobileView
                  ? "100px"
                  : "44px"
                  }`,
                margin: "auto",
              }}
            />
            {creator.username}
          </div>
        </div>
      );
    }
    return (
      <div
        style={{
          position: "absolute",
          width: "100%",
          bottom: "15px",
          right: 0,
          left: 0,
        }}
      >
        <Skeleton
          className=""
          style={{
            width: "96%",
            height: "70vh",
            backgroundColor: this.props.theme.palette.l_shimmer_bgColor,
            margin: "auto",
            borderRadius: "8px",
          }}
          variant="rect"
        />
        <div className="mt-3" style={{ width: "100%" }}>
          <Skeleton
            className="ml-3"
            style={{
              backgroundColor: this.props.theme.palette.l_shimmer_bgColor,
              borderRadius: "8px",
            }}
            width={100}
            height={50}
            variant="rect"
          />
          <Skeleton
            className="my-3"
            style={{
              backgroundColor: this.props.theme.palette.l_shimmer_bgColor,
              width: "96%",
              margin: "auto",
              borderRadius: "8px",
            }}
            height={40}
            variant="rect"
          />
          <Skeleton
            style={{
              backgroundColor: this.props.theme.palette.l_shimmer_bgColor,
              width: "96%",
              margin: "auto",
              borderRadius: "8px",
            }}
            height={10}
            variant="rect"
          />
        </div>
      </div>
    );
  };

  render() {
    const customDesktopStyle = () => {
      if (this.props.mobileView) return;
      let slide_Difference = this.props.activeSlideNum - this.props.slideNum;
      if (slide_Difference === 2) {
        return {
          justifyContent: 'flex-end'
        }
      }
      else if (slide_Difference === -2) {
        return {
          justifyContent: 'flex-start'
        }
      }
      return {}
    }


    if (!this.state.story || !this.state.story.length) {
      return this.noStorySkeleton();
    }
    return (
      <>
        <div className="App">
          {this.props.mobileView ? (
            <div className="stories">
              {this.state.isActive ? (
                <>
                  <Stories
                    keyboardNavigation
                    defaultInterval={5000}
                    actionString={this.state.actionString}
                    prevBeforeStory={this.goToPreviousSlide}
                    actionReset={() => {
                      this.setState({ actionString: "" });
                    }}
                    width="100vw"
                    height="100%"
                    progressBarStyle={{ bottom: 0 }}
                    stories={this.state.story}
                    videoAutoPlay={!this.state.isLocked}
                    // currentIndex={this.state.story.findIndex(
                    //   (item) => !item.isViewed
                    // )}
                    customHeader={
                      <CustomHeaderComponent
                        activeStory={this.state.activeStory}
                        {...this.props}
                        action={this.action}
                      />
                    }
                    onStoryEnd={this.onStoryEnd}
                    onAllStoriesEnd={this.onAllStoriesEnd}
                    onStoryStart={this.onStoryStart}
                  />
                </>
              ) : (
                this.noStorySkeleton()
              )}
            </div>
          ) : (
            <div className={`DesktopStories w-100 h-100`} style={customDesktopStyle()}>
              <div className={`StoryTile ${this.state.isActive ? '' : 'smallStoryTile'}`}>
                {this.state.isActive
                  ? <>
                    <Stories
                      className="storyContainer"
                      keyboardNavigation
                      defaultInterval={5000}
                      prevBeforeStory={this.goToPreviousSlide}
                      actionString={this.state.actionString}
                      videoAutoPlay={!this.state.isLocked}
                      actionReset={() => this.setState({ actionString: "" })}
                      width="100%"
                      height="100%"
                      progressBarStyle={{ bottom: 0 }}
                      stories={this.state.story}
                      // currentIndex={this.state.story.findIndex(
                      //   (item) => !item.isViewed
                      // )}
                      customHeader={
                        <CustomHeaderComponent
                          {...this.props}
                          activeStory={this.state.activeStory}
                          action={this.action}
                        />
                      }
                      onStoryEnd={this.onStoryEnd}
                      onAllStoriesEnd={this.onAllStoriesEnd}
                      onStoryStart={this.onStoryStart}
                    />
                    {/* {this.state.isLocked
                      ? <><div className="position-absolute DV_feedStoryLock cursorPtr">
                        <Icon
                          icon={`${IMAGE_LOCK_ICON}#lock_icon`}
                          color={this.props.theme.palette.white}
                          size={75}
                          unit="px"
                          viewBox="0 0 68.152 97.783"
                        />
                      </div>
                      <p className="col-11 text-center position-absolute fntSz18 fontW500 feedStoryLock_text cursorPtr">Subscribe</p>
                      </>
                      : <></>
                    } */}
                    <button className="slick-arrow slick-prev cursorPtr" onClick={this.previous} />
                    <button className="slick-arrow slick-next cursorPtr" onClick={this.next} />

                  </>
                  : this.noStorySkeleton()
                }
              </div>
            </div>
          )}
        </div>

        <style jsx>
          {`
            .App {
              width: 100%;
              height: 100%;
            }
            .smallStoryTile{
              width: 10.18vw !important;
              height: 229px !important;
              transition: all 0.25s;
            }
            .DesktopStories {
              background-color: var(--l_stories_background);
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .StoryTile {
              // Updated by Paritosh on April 23rd
              width: 388px;
              height: 95vh;
              transition: all 0.5s;
              position: relative;
            }
            
            :global(.storyContainer) {
              border-radius: 10px;
            }
            :global(.storyContainer img) {
              max-height: 95vh !important;
            }
          
            .stories{
              height: calc(var(--vhCustom, 1vh) * 100) !important;
              display: flex;
              justify-content: center;
              align-items: center;
            }

            :global(.slick-next) {
              top: 50% !important;
              right: -8% !important%;
              z-index: 10 !important;
            }

            :global(.slick-prev) {
              top: 50% !important;
              left: -8% !important;
              z-index: 10 !important;
            }
            :global(.slick-prev:before),
            :global(.slick-next:before) {
              font-size: 23px;
            }
            
            :global(.feedStoryLock_text) {
              z-index: 1000;
              background: #fff;
              color:#000 !important;
              border-radius: 20px;
              padding: 6px 0px 6px 0px!important;
              border: 1px solid white;
            }

            // Only for Safari 10.1+ 
            /**
             * @author Bhoomika A
             * @date 08-06-2021
             * @description Set height for safari browser
             */
            @media not all and (min-resolution:.001dpcm) { @media {
              .stories { 
                height: 100%;          
              }
          }}
          `}
        </style>
      </>
    );
  }
}

export default StoryModule;
