import dynamic from "next/dynamic";
import React from "react";
import Stories from "react-story-module";
import { DARK_LOGO } from "../../lib/config";
import { close_progress } from "../../lib/global";
import CustomFooter from "../../components/story/CustomFooter";
import Icon from '../../components/image/icon';
import { s3ImageLinkGen } from "../../lib/UploadAWS/uploadAWS";
import PendingStoryUpload from "./PendingStoryUpload";
const CustomHeaderComponent = dynamic(() => import("../../components/story/CustomHeader"), { ssr: false })
const Image = dynamic(() => import("../../components/image/image"), { ssr: false })

/**
 * @description This is the implementation of Story Module. This is for the Logged In User Story
 * @author Paritosh
 * @date 07/04/2021
 * @class StoryModule
 * @extends {React.Component}
 * @param this.state.story : Array - This array contains the All Story of this Particular User 
 * @param this.state.actionString: String - Used to control story state. If this set to 'pause', story will be paused, same for 'play', 'next' and 'previous'. 
 * @param this.state.activeIndex: Number - This number is the active Story index from the story array of current user.
 */

class StoryModule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      story: [],
      actionString: "",
      activeIndex: 0,
    };
  }

  action = (string) => {
    if (string == "play" || string == "pause") {
      this.setState({ actionString: string });
    }
  };

  next = () => {
    this.setState({ actionString: 'next' });
  }
  previous = () => {
    this.setState({ actionString: 'previous' });
  }

  setCustomVhToBody = () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vhCustom', `${vh}px`);
  };

  componentWillUnmount() {
    close_progress();

    window.removeEventListener('resize', this.setCustomVhToBody);
  }

  componentDidMount() {
    const setActiveState = this.props.setActiveState;
    const resultData = this.props.stories.map((item) => {
      if (item.storyData.type == 1) {
        return {
          _id: item._id,
          url: s3ImageLinkGen(this.props.S3_IMG_LINK, item.storyData.url),
          type: "image",
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
          // header: this.state.headers
        };
      } else if (item.storyData.type == 4) {
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
              <div style={{
                wordBreak: 'break-word',
                width: '100%',
                minHeight: '350px',
                background: `${item.storyData.bgColorCode}`,
                color: `${item.storyData.colorCode}`,
                padding: '10px',
                fontFamily: `${item.storyData.font}`,
                wordWrap: 'break-word',
                justifyContent: `${item.storyData.textAlign}`,
                textAlign: `${item.storyData.textAlign}`,
              }}
                className='d-flex align-items-center'
              >
                <h1
                  style={{
                    fontFamily: `${item.storyData.font}`,
                    fontSize: `${this.props.mobileView
                      ? item.storyData.text.length > 250 ? '5.5vw' : item.storyData.text.length > 200 ? '4.5vw' : item.storyData.text.length > 100 ? '4vw' : item.storyData.text.length > 50 ? '3.5vw' : '9.5vw'
                      : item.storyData.text.length > 250 ? '1.5vw' : item.storyData.text.length > 200 ? '1.5vw' : item.storyData.text.length > 100 ? '2vw' : item.storyData.text.length > 50 ? '2.5vw' : '3vw'}`,
                    wordWrap: 'break-word',
                  }}>{item.storyData.text}</h1>
              </div>
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
                <PendingStoryUpload
                />
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
          _id: item._id,
          url: item.storyData.url,
          type: "video",
          thumbnail: s3ImageLinkGen(this.props.S3_IMG_LINK, item.storyData.thumbnail, 30),
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
          // header: this.state.headers
        };
      }
    });
    this.setState({
      story: [...resultData],
    });
    // this.action('play') // For Safari Browser this line is must

    this.setCustomVhToBody();
    window.addEventListener('resize', this.setCustomVhToBody);
  }

  onAllStoriesEnd = (index, e) => {
    // console.log("onAllStoriesEnd: index", index);
    this.props.back();
  };
  onStoryEnd = (index, e) => {
    // console.log("onStoryEnd: index", index);
  };
  onStoryStart = (index, e) => {
    // console.log("onStoryStart: index", index);
    this.action("play");
    this.setState({ activeIndex: index });
  };


  render() {
    if (!this.state.story || !this.state.story.length) {
      return <div>Loading</div>;
    }
    return (
      <>
        <div className="App">
          {this.props.mobileView ? (
            <div className="stories">
              <Stories
                keyboardNavigation
                defaultInterval={5000}
                prevBeforeStory={() => { }}
                actionString={this.state.actionString}
                actionReset={() => { this.setState({ actionString: '' }) }}
                width="100vw"
                height="100%"
                progressBarStyle={{ bottom: 0 }}
                stories={this.state.story}
                videoAutoPlay={true}

                // current Index
                // currentIndex={this.state.story.findIndex(
                //   (item) => !item.isViewed
                // )}
                currentIndex={0}
                customHeader={
                  <CustomHeaderComponent
                    {...this.props}
                    activeStory={this.state.story[this.state.activeIndex]}
                    action={this.action}
                  />
                }
                onStoryEnd={this.onStoryEnd}
                onAllStoriesEnd={this.onAllStoriesEnd}
                onStoryStart={this.onStoryStart}
              />
            </div>
          ) : (
            <div className="DesktopStories w-100 h-100">
                <Image width={110} height={44} src={DARK_LOGO} className="cursorPtr" style={{ position: 'fixed', top: '25px', left: '145px' }} onClick={() => { this.props.back() }} />
              <div className="StoryTile">
                <Stories
                  className="storyContainer"
                  keyboardNavigation
                  prevBeforeStory={() => { }}
                  defaultInterval={5000}
                  actionString={this.state.actionString}
                  videoAutoPlay={true}
                  actionReset={() => { this.setState({ actionString: '' }) }}
                  width="100%"
                  height="100%"
                  progressBarStyle={{ bottom: 0 }}
                  stories={this.state.story}

                  // Current Index
                  // currentIndex={this.state.story.findIndex(
                  //   (item) => !item.isViewed
                  // )}
                  currentIndex={0}
                  customHeader={
                    <CustomHeaderComponent
                      {...this.props}
                      activeStory={this.state.story[this.state.activeIndex]}
                      action={this.action}
                    />
                  }
                  onStoryEnd={this.onStoryEnd}
                  onAllStoriesEnd={this.onAllStoriesEnd}
                  onStoryStart={this.onStoryStart}
                />
                    <button className="slick-arrow slick-prev cursorPtr" onClick={this.previous}/>
                    <button className="slick-arrow slick-next cursorPtr" onClick={this.next}/>
              </div>
            </div>
          )}
        </div>
        <style jsx={"true"}>
          {`
            .App {
              width: 100%;
              height: 100%;
            }
            .DesktopStories {
              background-color: var(--l_stories_background);
              display: flex;
              justify-content: center;
              align-items: center;
            }
            .StoryTile {
              width: 388px;
              // Updated by Paritosh on April 19th
              // height: 728px;
              height: 95vh;
              position: relative;
            }
            .stories{
              height: calc(var(--vhCustom, 1vh) * 100);
              display: flex;
              justify-content: center;
              align-items: center;
            }
            :global(.storyContainer) {
              border-radius: 10px;
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
          `}
        </style>
      </>
    );
  }
}
export default StoryModule;
