import React from 'react'
import CancelIcon from "@material-ui/icons/Cancel";
import CloudinaryVideo from '../cloudinaryVideo/cloudinaryVideo';
import CustomImageSlider from '../image-slider/ImageSlider';

const postCarouselDrawer = (props) => {
    const { data, width, postType, onClose } = props;

    return (
        <>
            <CancelIcon onClick={onClose} className="close_icon" />
            <CustomImageSlider
                post={props.post}
                coverImage={props.post.previewData ? props.post.previewData[0]?.url : undefined }
                className={`dv_postImg`}
                style={{ height: "100vh", backgroundColor: "#54565c" }}
                width={width}
                postType={postType}
                isVisible={1}
                imagesList={data.filter(f => f.seqId!==0)}
                imageDialog={true}
            />
            <style jsx>{`
            :global(.rec-slider>div>div){
                height:100vh !important;
              }
            `}
            </style>
        </>
    )
}

export default postCarouselDrawer;