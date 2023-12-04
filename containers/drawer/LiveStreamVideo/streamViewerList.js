import React from "react";
import { ClipLoader } from "react-spinners";
import ViewerUserTile from "../../../components/LiveStream/viewerUserTile";
import isMobile from "../../../hooks/isMobile";
import { CLOSE_ICON_WHITE } from "../../../lib/config";
import { getStreamUserId } from "../../../lib/global";
import { getStreamViewersAPI } from "../../../services/liveStream";
import Icon from "../../../components/image/icon";

const streamViewerList = (props) => {
  const { streamId, onClose, creator = false } = props;
  const streamUserId = getStreamUserId();
  const [mobileView] = isMobile();
  const [viewersList, setViewersList] = React.useState([]);
  const limit = 10;
  const [page, setPage] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [totalCount, setTotalCount] = React.useState(0);

  const handleAPICall = () => {
    setLoading(true);
    getStreamViewersAPI(streamId, limit, page * limit)
      .then((res) => {
        const data = res.data.viewers || [];
        const totalCount = res.data.totalCount;
        if (data.length) {
          setViewersList(prev => [...prev, ...data]);
          setTotalCount(totalCount || 0);
          setPage((prev) => prev + 1);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  }

  React.useEffect(() => {
    handleAPICall();
  }, []);

  return (
    <>
      <div className="w-100 py-2">
        <div className="py-3 txt-heavy fntSz20 px-3 text-app">
          Viewers {viewersList?.length ? creator ? `(${viewersList.filter((viewer) => streamUserId !== viewer.viewerId).length})` : `(${viewersList?.length})` : ""}
        </div>
        {<Icon
          icon={CLOSE_ICON_WHITE + "#close-white"}
          width="15"
          height="15"
          alt="Close Icon"
          color={"var(--l_app_text)"}
          class="close_option cursor-pointer"
          onClick={onClose}
          viewBox="0 0 16 16"
        />}
        <div className="stream_viewers_list mb-3 overflow-auto text-app">
          {
            viewersList?.length ? viewersList.map((viewer) => (
              <ViewerUserTile isSelf={streamUserId === viewer.viewerId} key={viewer.viewerId} viewer={viewer} streamId={streamId} />
            )) : <></>
          }
          {loading && <div className="text-center py-3">
            <ClipLoader loading={loading} size={30} sizeUnit="px" />
          </div>}
        </div>
      </div>
      <style jsx="true">
        {`
    .stream_viewers_list {
      max-height: 80vh;
    }
    :global(.close_option){
      position: absolute;
      top: 1.5rem;
      right: 1rem;
      border-radius: 50%;
      // background: #3a343a;
      padding:7px;
      line-height: initial;
    }
    
    `}
      </style>
    </>
  );
};

export default streamViewerList;
