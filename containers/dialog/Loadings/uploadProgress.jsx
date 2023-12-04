import React from 'react';
import { uploadProgressSubject } from '../../../lib/rxSubject';
import { close_dialog } from '../../../lib/global/loader';

const uploadProgress = (props) => {
    const { onClose } = props;
    const [progress, setProgress] = React.useState(0);
    const [postCount, setPostCount] = React.useState(0);
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        const varToUnsub = uploadProgressSubject.asObservable().subscribe((progress) => {
            setProgress(progress.uploaded);
            setPostCount(progress.postCount)
            setCount(progress.count)
            if(progress.postCount == progress.count && progress.uploaded == 100) {
                close_dialog("UPLOAD_PROGRESS")
            }
        });
        return () => {
            varToUnsub?.unsubscribe();
        }
    }, []);

    React.useEffect(() => {
        if (progress === 100 && postCount === count && count !== 0) {
            setTimeout(() => {
                onClose();
            }, 500);
        }
    }, [progress, postCount, count]);

    return (
        <>
            <div className="progressBar__box--backdrop"></div>
            <div className="progressBar__box position-relative scroll-hide">
                <div className="overflow-hidden progress_bar--loadbox">
                    <div style={{ width: `${progress}%` }} className="h-100 progress_bar--loaded txt-black d-flex align-items-center justify-content-center fntSz12">{progress}%</div>
                </div>
                <div className="text-center txt-black fntSz24 mt-4">
                    Uploading({progress}%)..
                </div>
                {count && postCount ? <div className="text-center txt-black fntSz24 mt-4">
                    {count} of {postCount}
                </div> : ""}
            </div>
            <style jsx="true">
                {`
        .progressBar__box--backdrop{
            width: 100vw;
            height: 100vh;
            position: fixed;
            left: 0;
            top: 0;
        }
        .progressBar__box {
            padding: 35px 20px;
        }
        .progress_bar--loadbox {
            width: 100%;
            border-radius: 30px;
            height: 18px;
            background-color: var(--l_input_bg);
        }
        
        :global(.loader){
            display:none;
        }

        .progress_bar--loaded {
            background-color: var(--l_base) !important;
            color: white;
        }


        `}
            </style>
        </>
    )
}

export default uploadProgress;
