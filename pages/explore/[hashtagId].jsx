import { useEffect } from 'react';
import { useRouter } from 'next/router';
import HashtagFollow from '../../components/Drawer/hashtag/hashtagFollow';
import { useSelector } from "react-redux";


const HastagDetails = (props) => {
    const { query } = useRouter();

    const S3_IMG_LINK = useSelector((state) => state?.appConfig?.imageBaseUrl);
    const hashtag = {
        name: `#${query?.hashtagId.split("&")[0]}`
    }
    return <HashtagFollow hashtag={hashtag} S3_IMG_LINK={S3_IMG_LINK} />
}

export default HastagDetails;
