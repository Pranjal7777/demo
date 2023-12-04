import { useRouter } from "next/router";

import HashtagPostViewer from '../../components/Drawer/hashtag/hashtagViewer';

const HashtagViewer = () => {
  const Router = useRouter();

  const postId = Router.query.id;
  const hashtag = Router.query.h || "hashtag"

  return (
    <HashtagPostViewer hashtag={hashtag} postId={postId} />
  )
}

export default HashtagViewer;