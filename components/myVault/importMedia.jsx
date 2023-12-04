import React from 'react'
import ImageContainer from '../../containers/post/imageContainer';
import VideoContainer from '../../containers/post/videoContainer';

const ImportMedia = (props) => {
    return (
        <>

            {
                props?.type == 1 ? (
                    <ImageContainer
                        defaultImage={[file]}
                        onChange={(imgs) => {
                            fileObject.current =
                                imgs &&
                                imgs.filter((_) =>
                                    _.files ? true : false
                                );
                            validaPosting();
                            if (fileObject.current.length == 0) {
                                remove();
                            }
                        }}
                    />
                ) : (
                    <VideoContainer
                        defaultImage={[file]}
                        onChange={onVideoSelect}
                        remove={remove}
                        changeThumbanail={changeThumbanail}
                        file={file}
                    />
                )
            }
        </>
    )
}

export default ImportMedia