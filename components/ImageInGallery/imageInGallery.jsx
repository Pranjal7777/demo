import React from "react";
import * as config from "../../lib/config";
import { open_drawer, open_post_dialog } from "../../lib/global";
import FigureCloudinayImage from "../cloudinayImage/cloudinaryImage";
import Image from "../image/image";


const ImageInGallery = (props) => {

    const {images,isVisible, ...otherProps } = props
    return (
        <div 
            style={{position:"relative", width: "100%"}} 
            onClick={() => {
                props.postType == 3 &&
                open_drawer("postCarousel",{data: images, width: props.width * 3},"right")
                }
            }>
            <FigureCloudinayImage 
                publicId={images[0].url}
                ratio={1}
                isVisible={isVisible}
                width={props.width || 50}
                style={{width:"100%",objectFit: "cover", objectPosition: "center"}}
                {...otherProps}
            />
        <div className="p-1" style={{position: "absolute", top: "0", right: "0", left: "0", right: "0", height: "100%", width: "100%"}}>
            <Image 
                src={config.MULTIPLE_IMAGE_ICON}
                alt="multiple-image-icon"
                className="multiple-image-icon"
            />
        </div>
        </div>
    )
}

export default ImageInGallery;