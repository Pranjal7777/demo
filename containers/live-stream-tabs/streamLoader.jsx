import React from 'react';
import { useSelector } from 'react-redux';
import { getCurrentStreamUserInfoHook } from '../../hooks/liveStreamHooks';
import { ProfilePlaceholder } from '../../lib/config';
import { s3ImageLinkGen } from '../../lib/UploadAWS/uploadAWS';

const streamLoader = ({ loaderPic = "" }) => {
  // const IMAGE_LINK = useSelector((state) => state?.cloudinaryCreds?.IMAGE_LINK);
  const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
  // const [hostPic, setHostPic] = React.useState('');

  return (
    <>
    <div className="stream__loader__bd">
      <img className="stream__loader__img" src={loaderPic ? s3ImageLinkGen(S3_IMG_LINK, loaderPic, null, 114, 114)  : ProfilePlaceholder} width={114} height={114} />
    </div>
    <style jsx="true">
    {`
    :global(.slick-slider) {
      filter: blur(6px);
    }
    .stream__loader__bd {
      height: 100vh;
      width: 100vw;
      position: fixed;
      z-index: 9;
      top: 0;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      overflow: hidden;
    }
    
    `}
    </style>
    </>
  )
}

export default streamLoader;
