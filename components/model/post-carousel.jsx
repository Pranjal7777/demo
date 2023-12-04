import React from 'react'
import { CarouselOpen } from '../../lib/rxSubject';
import CloudinaryVideo from '../cloudinaryVideo/cloudinaryVideo';
import CustomImageSlider from '../image-slider/ImageSlider';
import Model from './model';

const PostCarousel = () => {
    const [isModelOpen, setModelOpen] = React.useState(false);
    const [aspectWidth, setAspectWidth] = React.useState(411);
    const [state, setState] = React.useState([{}]);
    const [postType, setPostTye] = React.useState();
    CarouselOpen.subscribe((...params) => open_dialog(...params));

    const open_dialog = (props) => {
        setState(props.data);
        setPostTye(props.postType)
        setAspectWidth(props.width || 411)
        setModelOpen(true);
    }

    return (
        <Model
            open={isModelOpen}
            className="full_screen_dialog"
            closeIcon={true}
            fullScreen
            fullWidth
            onClose={() => setModelOpen(false)}>
            {state && state[0].type == 2
                ? <CloudinaryVideo
                    publicId={state[0].url}
                    thumbnail={state[0].thumbnail}
                    style={{
                        maxHeight: "100vh",
                        backgroundColor: "#242a37",
                        margin: "auto",
                    }}
                    className={`dv_postImg`}
                    isVisible={1}
                    postType={postType}
                    width={aspectWidth}
                />
                : <CustomImageSlider
                    className={`dv_postImg`}
                    style={{ height: "100vh", backgroundColor: "#54565c" }}
                    width={aspectWidth}
                    postType={postType}
                    isVisible={1}
                    imagesList={state}
                    imageDialog={true}
                />
            }
        </Model>
    )
}

export default PostCarousel;