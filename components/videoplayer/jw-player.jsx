import React from "react";
import dynamic from "next/dynamic";

const ReactJWPlayer = dynamic(() => import("react-jw-player"), { ssr: false });

const Videoplayer = (props) => {
  const { playlist = {}, publicId, postId } = props;
  const [isPaused, setIsPaused] = React.useState(false);
  // const [viewPortItem, setViewPortItem] = React.useState([]);
  // const [playedVideoList, setPlayedVideoList] = React.useState([])
  var observer;
  var videoElement;
  const onReady = (event) => {
    // const player = window.jwplayer(publicId);
    videoElement = document.getElementById(publicId);

    observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          // console.log('entry', entry)
          if (entry.isIntersecting) {
            // let player = window.jwplayer(entry.target.id);
            // console.log('player', player)
            // player.play()
          }
          if (!entry.isIntersecting) {
            let player = window.jwplayer(entry.target.id);
            player && player.pause && player.pause();
          }
        });
      },
      { threshold: 1 }
    );
    observer.observe(videoElement);
  };

  React.useEffect(() => {
    return () => {
      if (observer && videoElement) {
        observer && observer.unobserve(videoElement);
      }
    };
  }, []);

  // const handleVideoPlay = (e, id) => {
  //   console.log('video playing',e, id);
  //   setViewPortItem(prev=>[...prev, id])
  // }

  return (
    <div className="react_jw_palyer">
      {/* <HelperComponent viewPortItem={viewPortItem} /> */}
      <ReactJWPlayer
        playerId={publicId}
        onReady={onReady}
        onEnterFullScreen={(event) => {
          // console.log("exit click ", event);
          event && event.stopPropagation();
          event && event.preventDefault();
        }}
        onExitFullScreen={(event) => {
          // console.log("exit click ", event);
          event && event.stopPropagation();
          event && event.preventDefault();
        }}
        // onPlay={(e)=>handleVideoPlay(e, postId)}
        playerScript="https://content.jwplatform.com/libraries/YIw8ivBC.js"
        playlist={[playlist]}
        onBeforePlay={() => {
          //  console.log("onBeforePlay fired!")
        }}
      />
    </div>
  );
};

export default Videoplayer;

// class HelperComponent extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       analytics: []
//     }
//   }

//   componentWillUnmount(){
//     console.log('.....unmounting.....', this.props.viewPortItem);

//   }
//   render(){
//     return (<div></div>)
//   }

// }
